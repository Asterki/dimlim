import MessageSocketService from '../services/messagesSocket';
import { generateSymmetricKey, encryptSymmetric, decryptSymmetric, encryptKey, decryptKey } from '../../../utils/crypto';
import { EncryptedMessage, Message } from '../../../../../shared/types/models';

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
    const messageString = JSON.stringify(message);

    // Generate a random symmetric key for AES encryption
    const symmetricKey = generateSymmetricKey();

    // Encrypt the message with the symmetric key
    const encryptedMessage = encryptSymmetric(messageString, symmetricKey);

    // Encrypt the symmetric key with the recipient's RSA public key
    const encryptedSymmetricKey = encryptKey(symmetricKey, publicKey);

    // Send both the encrypted symmetric key and the encrypted message
    MessageSocketService.sendMessage(roomID, {
        encryptedSymmetricKey,
        encryptedMessage,
        roomId: roomID,
        author: message.senderId,
        recipient: message.receiverId,
        timestamp: message.createdAt,
    });
  };

  const onMessage = (privKey: string, callback: (message: Message) => void) => {
    MessageSocketService.subscribe((encryptedMessage: EncryptedMessage) => {
      // Decrypt the symmetric key using the recipient's RSA private key
      const symmetricKey = decryptKey(encryptedMessage.encryptedSymmetricKey, privKey);

      // Decrypt the message using the symmetric key
      const decryptedMessageContent = decryptSymmetric(encryptedMessage.encryptedMessage, symmetricKey);
      const decryptedMessage: Message = JSON.parse(decryptedMessageContent);

      callback(decryptedMessage);
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