import { Socket } from 'socket.io-client';

const joinPrivateChatRoom = (contactID: string, socket?: Socket) => {
  if (socket) {
    socket.emit('rooms-private-join', {
      contactID,
    });
  } else {
    console.error('Socket.io is not connected. Cannot join room.');
  }
};

const leavePrivateChatRoom = (contactID: string, socket?: Socket) => {
  if (socket) {
    socket.emit('rooms-private-leave', { contactID });
  } else {
    console.error('Socket.io is not connected. Cannot leave room.');
  }
};

export { joinPrivateChatRoom, leavePrivateChatRoom };
