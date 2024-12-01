import { Server } from 'socket.io';
import { createServer } from 'http';
import Logger from 'file-error-logging/dist/cjs';

import { z } from 'zod';

import { EncryptedMessage } from '../../../shared/types/models';

class SocketServer {
  private static instance: SocketServer | null = null;

  io: Server = new Server();

  public static getInstance() {
    if (!SocketServer.instance) SocketServer.instance = new SocketServer();
    return SocketServer.instance;
  }

  loadToServer(server: ReturnType<typeof createServer>) {
    this.io.attach(server, {
      cors: {
        origin: 'http://localhost:5173',
        credentials: true,
        exposedHeaders: ['set-cookie'],
      },
    });

    this.io.on('connection', (socket) => {
      Logger.log('info', `Socket connected: ${socket.id}`);

      socket.on('joinRoom', (roomId: string) => {
        const parsedRoomId = z.string().min(73).max(73).safeParse(roomId);
        if (!parsedRoomId.success) {
          return // Handle error here
        }

        socket.join(parsedRoomId.data);
      });

      socket.on('leaveRoom', (roomId: string) => {
        socket.leave(roomId);
      });

      socket.on('message', (data: EncryptedMessage) => {
        // Zod verify data here
        const ParsedEncryptedMessage = z.object({
          roomId: z.string(),
          author: z.string(),
          recipient: z.string(),
          encryptedAESKey: z.string(),
          iv: z.string(),
          encryptedMessage: z.string(),
          timestamp: z.date(),
        }).safeParse(data);

        if (!ParsedEncryptedMessage.success) {
          return // Handle error here
        }

        this.io.to(data.roomId).emit('message', ParsedEncryptedMessage.data);
      });
    });

    // Once the server is ready
    this.io.on('listening', () => {
      Logger.log('info', 'Socket server listening');
    });
  }
}

export default SocketServer;
