import { Server } from 'socket.io';
import { createServer } from 'http';

import SessionManager from './sessions';

// Middleware for auth
import passport from 'passport';

import { EncryptedMessage, User } from '../../../shared/types/models';

// Import routes
import RoomsSocketHandlers from '../sockets/rooms';
import MessageSocketHandlers from '../sockets/messages';

class SocketServer {
  private static instance: SocketServer | null = null;

  io: Server = new Server();

  public static getInstance() {
    if (!SocketServer.instance) SocketServer.instance = new SocketServer();
    return SocketServer.instance;
  }

  registerEventHandlers() {
    this.io.on('connection', (socket) => {
      socket.on('joinPrivateChatRoom', async (contactID: string) => {
        // @ts-ignore
        const user = socket.request.user as User;
        RoomsSocketHandlers.joinPrivateRoom(user, socket, contactID);
      });

      socket.on('leavePrivateChatRoom', (contactID: string) => {
        // @ts-ignore
        const user = socket.request.user as User;
        RoomsSocketHandlers.leavePrivateRoom(user, socket, contactID);
      });

      socket.on('sendPrivateMessage', async (data: { message: EncryptedMessage; contactID: string }) => {
        // @ts-ignore
        const user = socket.request.user as User;
        MessageSocketHandlers.sendPrivateMessage(user, socket, this.io, data);
      });
    });
  }

  registerAuthMiddleware() {
    const onlyForHandshake = (middleware: any) => {
      return (req: any, res: any, next: any) => {
        const isHandshake = req._query.sid === undefined;
        if (isHandshake) {
          middleware(req, res, next);
        } else {
          next();
        }
      };
    };

    this.io.engine.use(onlyForHandshake(SessionManager.prototype.getInstance().getSessionMiddleware()));
    this.io.engine.use(onlyForHandshake(passport.session()));
    this.io.engine.use(
      onlyForHandshake(
        (req: { user: any }, res: { writeHead: (arg0: number) => void; end: () => void }, next: () => void) => {
          if (req.user) {
            next();
          } else {
            res.writeHead(401);
            res.end();
          }
        },
      ),
    );
  }

  loadToServer(server: ReturnType<typeof createServer>) {
    this.io.attach(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        credentials: true,
        exposedHeaders: ['set-cookie'],
      },
    });

    this.registerAuthMiddleware();
    this.registerEventHandlers();

    // Load each event here

    this.io.on('listening', () => {
      console.log('Socket server ready');
    });
  }
}

export default SocketServer;
