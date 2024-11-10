import MessageSocketService from "../services/messagesSocket"
import { encryptMessage, decryptMessage } from "../../../utils/crypto";

const useMessages = () => {
    const joinRoom = (userID: string, contactID: string) => {
        const roomID = userID < contactID ? `${userID}-${contactID}` : `${contactID}-${userID}`;
        MessageSocketService.joinRoom(roomID);
        return roomID;
    } 

    const leaveRoom = (userID: string, contactID: string) => {
        const roomID = userID < contactID ? `${userID}-${contactID}` : `${contactID}-${userID}`;
        MessageSocketService.leaveRoom(roomID);
        return roomID;
    }

    const sendMessage = (roomID: string, message: string, publicKey: string) => {
        const encryptedMessage = encryptMessage(message, publicKey);
        MessageSocketService.sendMessage(roomID, encryptedMessage);
    }

    const onMessage = (privKey: string, callback: (message: string) => void) => {
        MessageSocketService.subscribe((message) => {
            // Decrypt message
            const decryptedMessage = decryptMessage(message, privKey);
            callback(decryptedMessage);
        });
    }

    return {
        joinRoom,
        leaveRoom,
        sendMessage,
        onMessage
    }
}

export default useMessages;