import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  email: {
    value: {
      type: String,
      required: true,
      unique: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  imageID: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
});

export default mongoose.model('Profile', ProfileSchema);