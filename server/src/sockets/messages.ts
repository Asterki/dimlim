import { Socket, Server } from 'socket.io';

import { z } from 'zod';

import { fetchUserByID } from '../utils/users';

import { EncryptedMessage, User } from '../../../shared/types/models';

const sendPrivateMessage = async (
  user: User,
  socket: Socket,
  io: Server,
  data: { message: EncryptedMessage; contactID: string },
) => {
  // Zod verify data here
  const ParsedEncryptedMessage = z
    .object({
      message: z.object({
        roomId: z.string(),
        author: z.string(),
        recipient: z.string(),
        encryptedAESKey: z.string(),
        iv: z.string(),
        encryptedMessage: z.string(),
        timestamp: z.date(),
      }),
      contactID: z.string().length(36),
    })
    .safeParse(data);

  if (!ParsedEncryptedMessage.success) return socket.emit('error', 'Invalid message data');

  // Check if the user is in the room, if they're not, it's assumed that either:
  // - The user is not in the room
  // - The user is blocked by the contact
  const roomName = [user.userID, ParsedEncryptedMessage.data.contactID].sort().join('-');
  if (!socket.rooms.has(roomName)) return socket.emit('error', 'You are not in this room');

  io.to(roomName).emit('privateMessage', ParsedEncryptedMessage.data);
};

export default { sendPrivateMessage };