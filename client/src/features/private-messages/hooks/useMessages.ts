import * as React from 'react';

import SocketService from '../services/socket';
import MessageStorage from '../services/messageStorage';

import { EncryptedMessage, Message } from '../../../../../shared/types/models';
import { Socket } from 'socket.io-client';

import {
  generateAESKey,
  encryptWithAES,
  decryptKeyWithRSA,
  decryptWithAES,
  encryptKeyWithRSA,
} from '../../../utils/crypto';

const useMessages = () => {
  const [currentMessages, setCurrentMessages] = React.useState<Message[]>([]);

  // Connecton to the socket when the component mounts
  const [socket, setSocket] = React.useState<Socket | null>(null);
  React.useEffect(() => {
    if (socket) {
      socket.disconnect();
    }

    const newSocket = SocketService.connect();
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const joinPrivateChat = async (userID: string, contactID: string) => {
    const roomID = userID < contactID ? `${userID}-${contactID}` : `${contactID}-${userID}`;
    SocketService.socketEmitters.rooms.joinPrivateChatRoom(contactID);

    const messages = await fetchMessages(roomID);
    setCurrentMessages(messages);

    return roomID;
  };

  const leavePrivateChat = (contactID: string) => {
    SocketService.socketEmitters.rooms.leavePrivateChatRoom(contactID);
    return true;
  };

  const sendMessage = async (publicKey: string, message: Message) => {
    const messageString = JSON.stringify(message); // The message object must be converted to a string

    const aesKey = generateAESKey();
    const aesResult = encryptWithAES(messageString, aesKey);

    const encryptedAESKey = encryptKeyWithRSA(aesKey, publicKey);

    // Send both the encrypted symmetric key and the encrypted message
    SocketService.socketEmitters.messages.sendPrivateMessage(message.recipientId, {
      messageId: message.id,
      senderId: message.senderId,
      recipientId: message.recipientId,
      iv: aesResult.iv,
      encryptedAESKey: encryptedAESKey,
      encryptedMessage: aesResult.ciphertext,
    } as EncryptedMessage);

    // Save the message to indexedDB
    const roomID =
      message.senderId < message.recipientId
        ? `${message.senderId}-${message.recipientId}`
        : `${message.recipientId}-${message.senderId}`;
    console.log(await MessageStorage.createMessage(roomID, message));
  };

  const fetchMessages = async (roomID: string, offset?: number) => {
    const messages = await MessageStorage.fetchMessaes(roomID, offset);
    if (!messages) return [];
    return messages;
  };

  const onMessage = (privateKeyPem: string, callback: (message: Message) => void) => {
    SocketService.subscribe((encryptedMessage: EncryptedMessage) => {
      try {
        const decryptedAESKey = decryptKeyWithRSA(encryptedMessage.encryptedAESKey, privateKeyPem);
        const decryptedMessage = decryptWithAES(
          encryptedMessage.encryptedMessage,
          decryptedAESKey,
          encryptedMessage.iv,
        );

        const result = JSON.parse(decryptedMessage) as Message; // The decrypted message must be converted back to an object

        // Save the message to indexedDB
        const roomID =
          result.senderId < result.recipientId
            ? `${result.senderId}-${result.recipientId}`
            : `${result.recipientId}-${result.senderId}`;
        MessageStorage.createMessage(roomID, result);

        callback(result);
      } catch (err) {
        // The user deleted their own private key, so guess what, they can't read their messages anymore
        // We'll make them pay by logging them out
      }
    });
  };

  return {
    currentMessages,
    joinPrivateChat,
    leavePrivateChat,
    sendMessage,
    onMessage,
    fetchMessages,
  };
};

export default useMessages;
