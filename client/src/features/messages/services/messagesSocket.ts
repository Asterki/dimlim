import { io, Socket } from 'socket.io-client';
import { EncryptedMessage } from '../../../../../shared/types/models';

type MessageCallback = (message: EncryptedMessage) => void;

const MessageSocketService = (() => {
  let socket: Socket | null = null;
  const messageCallbacks: MessageCallback[] = [];
  const reconnectInterval = 5000; // 5 seconds
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 10;
  const url = import.meta.env.VITE_SERVER_HOST;

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
      console.log(data);
    });

    socket.on('privateMessage', (data: EncryptedMessage) => {
      notifySubscribers(data);
    });

    socket.on('joinedPrivateChatRoom', (data) => {
      console.log(`Joined room: ${data}`); // TODO: Handle this event
    });

    socket.on('leftPrivateChatRoom', (data) => {
      console.log(`Left room: ${data}`); // TODO: Handle this event
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
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
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

  const joinPrivateChatRoom = (contactID: string) => {
    if (socket) {
      socket.emit('joinPrivateChatRoom', contactID);
    } else {
      console.error('Socket.io is not connected. Cannot join room.');
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socket) {
      socket.emit('leavePrivateChatRoom', roomId);
    } else {
      console.error('Socket.io is not connected. Cannot leave room.');
    }
  };

  const sendMessage = (roomId: string, message: EncryptedMessage) => {
    if (socket && socket.connected) {
      socket.emit('privateMessage', message);
    } else {
      console.error('Socket.io is not connected. Message not sent.');
    }
  };

  const subscribe = (callback: MessageCallback) => {
    messageCallbacks.push(callback);
  };

  const unsubscribe = (callback: MessageCallback) => {
    const index = messageCallbacks.indexOf(callback);
    if (index !== -1) {
      messageCallbacks.splice(index, 1);
    }
  };

  const notifySubscribers = (message: EncryptedMessage) => {
    messageCallbacks.forEach((callback) => callback(message));
  };

  return {
    connect,
    disconnect,
    joinPrivateChatRoom,
    leaveRoom,
    sendMessage,
    subscribe,
    unsubscribe,
  };
})();

export default MessageSocketService;
