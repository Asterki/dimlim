import { Socket } from 'socket.io-client';

import { EncryptedMessage } from '../../../../../../shared/types/models';

const sendPrivateMessage = (message: EncryptedMessage, socket?: Socket) => {
  if (socket && socket.connected) {
    socket.emit('messages-private-send', {
      message,
    });
  } else {
    console.error('Socket.io is not connected. Message not sent.');
  }
};

export { sendPrivateMessage };
