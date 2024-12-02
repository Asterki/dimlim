import * as React from 'react';

import MessageSocketService from '../services/messagesSocket';
import MessageStorage from '../services/messageStorage';
import { EncryptedMessage, Message } from '../../../../../shared/types/models';

import {
  generateAESKey,
  encryptWithAES,
  decryptKeyWithRSA,
  decryptWithAES,
  encryptKeyWithRSA,
} from '../../../utils/crypto';

const useMessages = () => {
  const [currentRoom, setCurrentRoom] = React.useState<string>('');
  const [currentMessages, setCurrentMessages] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const joinRoom = async (userID: string, contactID: string) => {
    const roomID = userID < contactID ? `${userID}-${contactID}` : `${contactID}-${userID}`;
    MessageSocketService.joinPrivateChatRoom(contactID);
    setCurrentRoom(roomID);

    const messages = await fetchMessages(roomID);
    setCurrentMessages(messages);

    return roomID;
  };

  const leaveRoom = () => {
    MessageSocketService.leaveRoom(currentRoom);
    return currentRoom;
  };

  const sendMessage = async (publicKey: string, message: Message) => {
    const messageString = JSON.stringify(message); // The message object must be converted to a string

    const aesKey = generateAESKey();
    const aesResult = encryptWithAES(messageString, aesKey);

    const encryptedAESKey = encryptKeyWithRSA(aesKey, publicKey);

    // Send both the encrypted symmetric key and the encrypted message
    MessageSocketService.sendMessage(currentRoom, {
      iv: aesResult.iv,
      encryptedAESKey: encryptedAESKey,
      encryptedMessage: aesResult.ciphertext,
      roomId: currentRoom,
      author: message.senderId,
      recipient: message.receiverId,
      timestamp: message.createdAt,
    } as EncryptedMessage);

    // Save the message to indexedDB
    console.log(await MessageStorage.createMessage(currentRoom, message));
  };

  const onMessage = (privateKeyPem: string, callback: (message: Message) => void) => {
    MessageSocketService.subscribe((encryptedMessage: EncryptedMessage) => {
      try {
        const decryptedAESKey = decryptKeyWithRSA(encryptedMessage.encryptedAESKey, privateKeyPem);
        const decryptedMessage = decryptWithAES(
          encryptedMessage.encryptedMessage,
          decryptedAESKey,
          encryptedMessage.iv,
        );

        const result = JSON.parse(decryptedMessage) as Message; // The decrypted message must be converted back to an object

        // Save the message to indexedDB
        MessageStorage.createMessage(encryptedMessage.roomId, result);

        callback(result);
      } catch (err) {
        // The user deleted their own private key, so guess what, they can't read their messages anymore
        // We'll make them pay by logging them out
      }
    });
  };

  const fetchMessages = async (roomID: string, offset?: number) => {
    const messages = await MessageStorage.fetchMessaes(roomID, offset);
    if (!messages) return [];
    return messages;
  };

  return {
    joinRoom,
    leaveRoom,
    sendMessage,
    onMessage,
    fetchMessages,
    currentRoom,
    currentMessages,
    loading,
    setCurrentMessages
  };
};

export default useMessages;
