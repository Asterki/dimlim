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

    socket = io(url);

    socket.on('connect', () => {
      console.log('Socket.io connection established');
      reconnectAttempts = 0;
    });

    socket.on('message', (data: EncryptedMessage) => {
      notifySubscribers(data);
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

  const joinRoom = (roomId: string) => {
    if (socket) {
      socket.emit('joinRoom', roomId);
    } else {
      console.error('Socket.io is not connected. Cannot join room.');
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socket) {
      socket.emit('leaveRoom', roomId);
    } else {
      console.error('Socket.io is not connected. Cannot leave room.');
    }
  };

  const sendMessage = (roomId: string, message: EncryptedMessage) => {
    if (socket && socket.connected) {
      socket.emit('message', message);
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
    joinRoom,
    leaveRoom,
    sendMessage,
    subscribe,
    unsubscribe,
  };
})();

export default MessageSocketService;