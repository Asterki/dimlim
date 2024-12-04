import { Socket, Server } from 'socket.io';
import { z } from 'zod';

import { User } from '../../../shared/types/models';

import { MessagesPrivateSendData, MessagePrivateSendResponse } from '../../../shared/types/sockets/messages';

const sendPrivateMessage = async (user: User, socket: Socket, io: Server, data: MessagesPrivateSendData) => {
  // Zod verify data here
  const parsedEncryptedMessage = z
    .object({
      message: z.object({
        messageId: z.string().length(36),
        senderId: z.string().length(36),
        recipientId: z.string().length(36),
        encryptedAESKey: z.string(),
        iv: z.string(),
        encryptedMessage: z.string(),
      }),
    })
    .safeParse(data);

  if (!parsedEncryptedMessage.success) return socket.emit('error', 'Invalid message data');
  const message = parsedEncryptedMessage.data.message;

  // Check if the user is in the room, if they're not, it's assumed that either:
  // - The user is not in the room
  // - The user is blocked by the contact
  const roomName = [user.userID, parsedEncryptedMessage.data.message.recipientId].sort().join('-');
  if (!socket.rooms.has(roomName))
    return socket.emit('messages-private-send', {
      messageID: message.messageId,
      status: 'error',
    } as MessagePrivateSendResponse);
    
    // Check if the recipient is in the room
  const room = io.sockets.adapter.rooms.get(roomName)!
  const recipientRoom = Array.from(room)
  if (recipientRoom.length < 2) {
    // If the recipient is offline, store the message in the database
    // (Implement your logic to store the message in the database here)
    socket.emit('messages-private-send', {
      messageID: message.messageId,
      status: 'delivered',
    } as MessagePrivateSendResponse); // Acknowledge the sender
  } else {
    io.to(roomName).emit('messages-private-new', parsedEncryptedMessage.data); // Send the message to the recipient
    socket.emit('messages-private-send', {
      messageID: message.messageId,
      status: 'sent',
    } as MessagePrivateSendResponse); // Acknowledge the sender
  }
};

export default { sendPrivateMessage };
