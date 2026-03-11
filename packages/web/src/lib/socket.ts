import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

export function createTrackingSocket(): Socket {
  return io(`${WS_URL}/tracking`, {
    autoConnect: false,
    auth: { token: localStorage.getItem('partner_token') },
  });
}

export function createChatSocket(): Socket {
  return io(`${WS_URL}/chat`, {
    autoConnect: false,
    auth: { token: localStorage.getItem('partner_token') },
  });
}
