import MessageSocketService from '../services/messagesSocket';
import { EncryptedMessage, Message } from '../../../../../shared/types/models';

import {
  generateAESKey,
  encryptWithAES,
  decryptKeyWithRSA,
  decryptWithAES,
  encryptKeyWithRSA,
} from '../../../utils/crypto';

const useMessages = () => {
  const joinRoom = (userID: string, contactID: string) => {
    const roomID = userID < contactID ? `${userID}-${contactID}` : `${contactID}-${userID}`;
    MessageSocketService.joinRoom(roomID);
    return roomID;
  };

  const leaveRoom = (userID: string, contactID: string) => {
    const roomID = userID < contactID ? `${userID}-${contactID}` : `${contactID}-${userID}`;
    MessageSocketService.leaveRoom(roomID);
    return roomID;
  };

  const sendMessage = (roomID: string, publicKey: string, message: Message) => {
    const messageString = JSON.stringify(message); // The message object must be converted to a string

    const aesKey = generateAESKey();
    const aesResult = encryptWithAES(messageString, aesKey);

    const encryptedAESKey = encryptKeyWithRSA(aesKey, publicKey);

    // Send both the encrypted symmetric key and the encrypted message
    MessageSocketService.sendMessage(roomID, {
      iv: aesResult.iv,
      encryptedAESKey: encryptedAESKey,
      encryptedMessage: aesResult.ciphertext,
      roomId: roomID,
      author: message.senderId,
      recipient: message.receiverId,
      timetamp: message.createdAt,
    } as EncryptedMessage);
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
        callback(result);
      } catch (err) {
        // Prob means that the message was not meant for this user
        // console.error('Error decrypting message:', err);
      }
    });
  };

  return {
    joinRoom,
    leaveRoom,
    sendMessage,
    onMessage,
  };
};

export default useMessages;
