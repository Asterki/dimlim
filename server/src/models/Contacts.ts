import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ContactsSchema = new Schema({
  blocked: {
    type: [String],
    default: [],
  },
  pending: {
    type: [String],
    default: [],
  },
  requests: {
    type: [String],
    default: [],
  },
  accepted: {
    type: [String],
    default: [],
  },
});

export default mongoose.model('Contacts', ContactsSchema);