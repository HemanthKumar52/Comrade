import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TrackingService } from './tracking.service';

@WebSocketGateway({ namespace: '/tracking', cors: true })
export class TrackingGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly trackingService: TrackingService) {}

  @SubscribeMessage('join-trip')
  handleJoinTrip(
    @MessageBody() data: { tripId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`trip:${data.tripId}`);
    return { event: 'joined-trip', data: { tripId: data.tripId } };
  }

  @SubscribeMessage('leave-trip')
  handleLeaveTrip(
    @MessageBody() data: { tripId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`trip:${data.tripId}`);
    return { event: 'left-trip', data: { tripId: data.tripId } };
  }

  @SubscribeMessage('update-location')
  async handleUpdateLocation(
    @MessageBody()
    data: {
      tripId: string;
      userId: string;
      lat: number;
      lng: number;
      speed?: number;
      altitude?: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    await this.trackingService.updateMemberLocation(
      data.tripId,
      data.userId,
      data.lat,
      data.lng,
    );

    await this.trackingService.saveTrackPoint(data.tripId, data.userId, {
      lat: data.lat,
      lng: data.lng,
      speed: data.speed,
      altitude: data.altitude,
    });

    const geofenceResults = await this.trackingService.checkGeofences(
      data.tripId,
      data.lat,
      data.lng,
    );

    client.to(`trip:${data.tripId}`).emit('location-updated', {
      userId: data.userId,
      lat: data.lat,
      lng: data.lng,
      speed: data.speed,
      altitude: data.altitude,
      timestamp: new Date().toISOString(),
    });

    const entered = geofenceResults.filter((g) => g.inside);
    if (entered.length > 0) {
      this.server.to(`trip:${data.tripId}`).emit('geofence-entered', {
        userId: data.userId,
        geofences: entered,
      });
    }

    return { event: 'location-ack', data: { success: true } };
  }

  @SubscribeMessage('sos-alert')
  handleSOSAlert(
    @MessageBody()
    data: { tripId: string; userId: string; lat: number; lng: number; message?: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(`trip:${data.tripId}`).emit('sos-alert', {
      userId: data.userId,
      lat: data.lat,
      lng: data.lng,
      message: data.message || 'SOS! Need help!',
      timestamp: new Date().toISOString(),
    });

    return { event: 'sos-ack', data: { success: true } };
  }
}
