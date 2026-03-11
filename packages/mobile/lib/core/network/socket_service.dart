import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;
import '../storage/local_storage.dart';

final socketServiceProvider = Provider<SocketService>((ref) {
  return SocketService();
});

class SocketService {
  static const String _baseUrl = 'http://localhost:4000';

  io.Socket? _trackingSocket;
  io.Socket? _chatSocket;

  io.Socket? get trackingSocket => _trackingSocket;
  io.Socket? get chatSocket => _chatSocket;

  Future<void> connectTracking() async {
    final storage = LocalStorage();
    final token = await storage.getAccessToken();

    _trackingSocket = io.io(
      '$_baseUrl/tracking',
      io.OptionBuilder()
          .setTransports(['websocket'])
          .setAuth({'token': token})
          .enableAutoConnect()
          .enableReconnection()
          .build(),
    );

    _trackingSocket!.onConnect((_) {
      print('[Socket] Tracking connected');
    });

    _trackingSocket!.onDisconnect((_) {
      print('[Socket] Tracking disconnected');
    });

    _trackingSocket!.onError((err) {
      print('[Socket] Tracking error: $err');
    });
  }

  Future<void> connectChat() async {
    final storage = LocalStorage();
    final token = await storage.getAccessToken();

    _chatSocket = io.io(
      '$_baseUrl/chat',
      io.OptionBuilder()
          .setTransports(['websocket'])
          .setAuth({'token': token})
          .enableAutoConnect()
          .enableReconnection()
          .build(),
    );

    _chatSocket!.onConnect((_) {
      print('[Socket] Chat connected');
    });

    _chatSocket!.onDisconnect((_) {
      print('[Socket] Chat disconnected');
    });
  }

  void emitLocation(double lat, double lng, String tripId) {
    _trackingSocket?.emit('location:update', {
      'latitude': lat,
      'longitude': lng,
      'tripId': tripId,
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  void joinTripRoom(String tripId) {
    _trackingSocket?.emit('trip:join', {'tripId': tripId});
  }

  void leaveTripRoom(String tripId) {
    _trackingSocket?.emit('trip:leave', {'tripId': tripId});
  }

  void sendMessage(String chatRoomId, String message) {
    _chatSocket?.emit('message:send', {
      'chatRoomId': chatRoomId,
      'content': message,
    });
  }

  void joinChatRoom(String chatRoomId) {
    _chatSocket?.emit('chat:join', {'chatRoomId': chatRoomId});
  }

  void disconnect() {
    _trackingSocket?.disconnect();
    _chatSocket?.disconnect();
    _trackingSocket = null;
    _chatSocket = null;
  }
}
