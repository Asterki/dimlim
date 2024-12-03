import { io, Socket } from 'socket.io-client';
import { EncryptedMessage } from '../../../../../shared/types/models';

// Emmitters
import { sendPrivateMessage } from './socketEmitters/messages';
import { joinPrivateChatRoom, leavePrivateChatRoom } from './socketEmitters/rooms';

// Types
import type { MessagePrivateSendResponse } from '../../../../../shared/types/sockets/messages';
import type { RoomsPrivateJoinResponse, RoomsPrivateLeaveResponse } from '../../../../../shared/types/sockets/rooms';

// Listeners
import eventManager from './eventListener';

const SocketService = (() => {
  const url = import.meta.env.VITE_SERVER_HOST;
  let socket: Socket | undefined = undefined;

  const reconnectInterval = 5000; // 5 seconds
  const maxReconnectAttempts = 10;
  let reconnectAttempts = 0;

  const socketEmitters = {
    messages: {
      sendPrivateMessage: (recipientId: string, data: EncryptedMessage) =>
        sendPrivateMessage(recipientId, data, socket),
    },
    rooms: {
      joinPrivateChatRoom: (contactId: string) => joinPrivateChatRoom(contactId, socket),
      leavePrivateChatRoom: (contactId: string) => leavePrivateChatRoom(contactId, socket),
    },
  };

  const socketListeners = {};

  const connect = () => {
    if (socket) {
      socket.disconnect();
    }

    socket = io(url, {
      autoConnect: true,
      reconnection: false,
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('Socket.io connection established');
      reconnectAttempts = 0;
    });

    socket.on('error', (data) => {
      console.log(data); // These wont be handled since it's impossible that they will happen unless the user is messing with the code
    });

    // Timeout and reconnect on disconnect
    socket.on('timeout', () => {
      console.log('Socket.io connection timed out');
      reconnect();
    });

    socket.on('disconnect', () => {
      console.log('Socket.io connection closed');
      reconnect();
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.io connection error:', error);
      socket?.disconnect();
    });

    // Custom events
    // #region Message events
    socket.on('messages-private-new', (data: MessagePrivateSendResponse) => {
      eventManager.notifySubscribers('messages-private-new', data);
    });
    socket.on('messages-private-send', (data: MessagePrivateSendResponse) => {
      eventManager.notifySubscribers('messages-private-send', data);
    });
    // #endregion

    // #region Message events
    socket.on('rooms-private-join', (data: RoomsPrivateJoinResponse) => {
      eventManager.notifySubscribers('rooms-private-join', data);
    });
    socket.on('rooms-private-leave', (data: RoomsPrivateLeaveResponse) => {
      eventManager.notifySubscribers('rooms-private-leave', data);
    });
    // #endregion

    return socket;
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      socket = undefined;
    }
  };

  const reconnect = () => {
    if (reconnectAttempts < maxReconnectAttempts) {
      setTimeout(() => {
        console.log('Attempting to reconnect...');
        reconnectAttempts++;
        connect();
      }, reconnectInterval);
    } else {
      console.error('Max reconnect attempts reached');
    }
  };

  return {
    connect,
    disconnect,
    socketEmitters,
    socketListeners,
  };
})();

export default SocketService;
