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

      socket.on("start_room", (data: {
        userID: string;
        contactID: string
      }) => {
        const roomName = [data.userID, data.contactID].sort().join('_');
        socket.join(roomName); 
      })

      socket.on("message", (data: {
        userID: string;
        contactID: string;
        message: string;
      }) => {
        const roomName = [data.userID, data.contactID].sort().join('_');
        this.io.to(roomName).emit("message", data);
      })
    });

    // Once the server is ready
    this.io.on('listening', () => {
      console.log('Socket server ready');
    });
  }
}

export default SocketServer;
