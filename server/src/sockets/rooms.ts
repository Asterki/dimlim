import { Socket } from 'socket.io';

import { z } from 'zod';

import { fetchUserByID } from '../utils/users';

import { User } from '../../../shared/types/models';
import {
  RoomsPrivateJoinData,
  RoomsPrivateJoinResponse,
  RoomsPrivateLeaveData,
  RoomsPrivateLeaveResponse,
} from '../../../shared/types/sockets/rooms';

// We don't check if the room has more than 2 users, because users may have multiple devices
// connected to the same account, and we want to deliver messages to all of them
// However, we should check if the user is in the contacts list, and if they belong to that room.
const joinPrivateRoom = async (user: User, socket: Socket, data: RoomsPrivateJoinData) => {
  // Validate contact ID
  const parsedData = z
    .object({
      contactID: z.string().min(37).max(37),
    })
    .safeParse(data);
  if (!parsedData.success)
    return socket.emit('rooms.private.join', { roomName: '', status: 'error' } as RoomsPrivateJoinResponse);
  const contactID = parsedData.data.contactID;

  // Anti-inspect-element-user-really-get-a-life-and-stop-trying-to-break-things
  if (!user.contacts.accepted.includes(contactID))
    return socket.emit('rooms.private.join', { roomName: '', status: 'error' } as RoomsPrivateJoinResponse);
  if (user.userID === contactID)
    return socket.emit('rooms.private.join', { roomName: '', status: 'error' } as RoomsPrivateJoinResponse);

  // Avoid the user from joining the room if they blocked the contact
  if (user.contacts.blocked.includes(contactID))
    return socket.emit('rooms.private.join', { roomName: '', status: 'blocked' } as RoomsPrivateJoinResponse);

  // Avoid the user from joining the room if they're blocked by the contact
  const contact = await fetchUserByID(contactID);
  if (!contact) return socket.emit('rooms.private.join', { roomName: '', status: 'error' } as RoomsPrivateJoinResponse);
  if (contact.contacts.blocked.includes(user.userID))
    return socket.emit('rooms.private.join', { roomName: '', status: 'blocked' } as RoomsPrivateJoinResponse);

  // Join the room
  const roomName = [user.userID, contactID].sort().join('-');
  socket.join(roomName);
  socket.emit('rooms.private.join', { roomName, status: 'joined' } as RoomsPrivateJoinResponse);
};

const leavePrivateRoom = (user: User, socket: Socket, data: RoomsPrivateLeaveData) => {
  // Validate contact ID
  const parsedData = z
    .object({
      contactID: z.string().min(37).max(37),
    })
    .safeParse(data);
  if (!parsedData.success)
    return socket.emit('rooms.private.leave', { roomName: '', status: 'error' } as RoomsPrivateLeaveResponse);
  const contactID = parsedData.data.contactID;

  // Leave the room
  const roomName = [user.userID, contactID].sort().join('-');
  socket.leave(roomName);
  socket.emit('rooms.private.leave', { roomName, status: 'left' } as RoomsPrivateLeaveResponse);
};

export default { joinPrivateRoom, leavePrivateRoom };
