import MessageSocketService from "../services/messagesSocket"
import { encryptMessage } from "../../../utils/crypto";

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

    return {
        joinRoom,
        leaveRoom,
        sendMessage,
    }
}

export default useMessages;