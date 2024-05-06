import { Server } from 'socket.io';
import { createServer } from 'http';

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
      console.log('Socket connected');

      socket.on('messageewq', (data) => {
        console.log('Message received');
        this.io.send('Message received');
      });
    });

    // Once the server is ready
    this.io.on('listening', () => {
      console.log('Socket server ready');
    });
  }
}

export default SocketServer;
