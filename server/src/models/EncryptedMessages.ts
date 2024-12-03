import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const EncryptedMessages = new Schema({
  senderId: {
    type: String,
    required: true,
  },
  recipientId: {
    type: String,
    required: true,
  },
  messageId: {
    type: String,
    required: true,
  },
  encryptedAESKey: {
    type: String,
    required: true,
  },
  iv: {
    type: String,
    required: true,
  },
  encryptedMessage: {
    type: String,
    required: true,
  },
});

export default mongoose.model('EncryptedMessages', EncryptedMessages, 'encryptedMessages');
