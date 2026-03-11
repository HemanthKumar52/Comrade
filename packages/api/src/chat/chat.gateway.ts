import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ namespace: '/chat', cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`chat:${data.roomId}`);
    return { event: 'joined-room', data: { roomId: data.roomId } };
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`chat:${data.roomId}`);
    return { event: 'left-room', data: { roomId: data.roomId } };
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(
    @MessageBody()
    data: {
      roomId: string;
      senderId: string;
      content: string;
      type?: string;
      mediaUrl?: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.chatService.sendMessage(
      data.roomId,
      data.senderId,
      data.content,
      data.type,
      data.mediaUrl,
    );

    client.to(`chat:${data.roomId}`).emit('new-message', message);

    return { event: 'message-sent', data: message };
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { roomId: string; userId: string; name: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`chat:${data.roomId}`).emit('user-typing', {
      userId: data.userId,
      name: data.name,
    });

    return { event: 'typing-ack', data: { success: true } };
  }
}
