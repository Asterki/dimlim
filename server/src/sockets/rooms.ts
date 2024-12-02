import { Socket } from 'socket.io';

import { z } from 'zod';

import { fetchUserByID } from '../utils/users';

import { User } from '../../../shared/types/models';

// We don't check if the room has more than 2 users, because users may have multiple devices
// connected to the same account, and we want to deliver messages to all of them
// However, we should check if the user is in the contacts list, and if they belong to that room.
const joinPrivateRoom = async (user: User, socket: Socket, contactID: string) => {
  // Validate contact ID
  const parsedContactID = z.string().length(36).safeParse(contactID);
  if (!parsedContactID.success) return socket.emit('error', 'Invalid contact ID');
  if (user.userID === parsedContactID.data) return socket.emit('error', 'Cannot chat with yourself');
  if (!user.contacts.accepted.includes(parsedContactID.data)) return socket.emit('error', 'Contact not found');
  if (user.contacts.blocked.includes(parsedContactID.data)) return socket.emit('error', 'Contact is blocked');

  // Avoid the user from joining the room if they're blocked by the contact
  const contact = await fetchUserByID(parsedContactID.data);
  if (!contact) return socket.emit('error', 'Contact not found');
  if (contact.contacts.blocked.includes(user.userID)) return socket.emit('error', 'You are blocked by this contact');

  // Join the room
  const roomName = [user.userID, parsedContactID.data].sort().join('-');
  socket.join(roomName);
  socket.emit('joinedPrivateChatRoom', roomName);
};

const leavePrivateRoom = (user: User, socket: Socket, contactID: string) => {
  // Validate contact ID
  const parsedContactID = z.string().min(37).max(37).safeParse(contactID);
  if (!parsedContactID.success) return socket.emit('error', 'Invalid contact ID');
  if (user.userID === parsedContactID.data) return socket.emit('error', 'Cannot chat with yourself');
  if (!user.contacts.accepted.includes(parsedContactID.data)) return socket.emit('error', 'Contact not found');

  // Leave the room
  const roomName = [user.userID, parsedContactID.data].sort().join('-');
  socket.leave(roomName);
  socket.emit('leftPrivateChatRoom', roomName);
};

export default { joinPrivateRoom, leavePrivateRoom };
