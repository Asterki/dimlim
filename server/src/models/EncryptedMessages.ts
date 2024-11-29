import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const EncryptedMessages = new Schema({
  roomId: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  recipient: {
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
  timestamp: {
    type: Date,
    required: false,
    default: Date.now,
  },
});

export default mongoose.model('EncryptedMessages', EncryptedMessages, 'encryptedMessages');
