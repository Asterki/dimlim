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
        authorId: z.string().length(36),
        receiverId: z.string().length(36),
        encryptedAESKey: z.string(),
        iv: z.string(),
        encryptedMessage: z.string(),
      }),
      contactID: z.string().length(36),
    })
    .safeParse(data);

  if (!parsedEncryptedMessage.success) return socket.emit('error', 'Invalid message data');
  const message = parsedEncryptedMessage.data.message;

  // Check if the user is in the room, if they're not, it's assumed that either:
  // - The user is not in the room
  // - The user is blocked by the contact
  const roomName = [user.userID, parsedEncryptedMessage.data.contactID].sort().join('-');
  if (!socket.rooms.has(roomName))
    return socket.emit('messages-private-send', {
      messageID: message.messageId,
      status: 'error',
    } as MessagePrivateSendResponse);

  // TODO: If the recipient is not in the room, we should send a push notification, and save the message to the database
  if (false) {
    socket.emit('messages-private-send', {
      messageID: message.messageId,
      status: 'delivered',
    } as MessagePrivateSendResponse); // Acknowledge the sender
  } else {
    io.to(roomName).emit('messages.private.new', parsedEncryptedMessage.data); // Send the message to the recipient
    socket.emit('messages-private-send', {
      messageID: message.messageId,
      status: 'sent',
    } as MessagePrivateSendResponse); // Acknowledge the sender
  }
};

export default { sendPrivateMessage };
