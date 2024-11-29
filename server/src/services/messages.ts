import EncryptedMessagesModel from '../models/EncryptedMessages';

import { EncryptedMessage } from '../../../shared/types/models';

class MessagesSevice {
  private static instance: MessagesSevice;

  private constructor() {}

  public static getInstance(): MessagesSevice {
    if (!MessagesSevice.instance) {
      MessagesSevice.instance = new MessagesSevice();
    }
    return MessagesSevice.instance;
  }

  public async storeMessage(data: EncryptedMessage) {
    const message = new EncryptedMessagesModel(data);
    await message.save();
  }

  public async getMessageCount(roomId: string, limit: number, skip: number) {
    const messages = await EncryptedMessagesModel.find({ roomId }).sort({ createdAt: -1 }).limit(limit).skip(skip);
    return messages;
  }
}

export default MessagesSevice.getInstance();
