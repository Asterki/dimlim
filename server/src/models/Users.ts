import mongoose from 'mongoose';
import Profile from './Profiles';
import Contacts from './Contacts';
import Preferences from './Preferences';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userID: {
    type: String,
    required: true,
    unique: true,
  },
  created: {
    type: Number,
    required: true,
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  contacts: {
    type: Schema.Types.ObjectId,
    ref: 'Contacts',
    required: true,
  },
  pubKey: {
    type: Buffer,
  },
  preferences: {
    type: Schema.Types.ObjectId,
    ref: 'Preferences',
    required: true,
  },
});

export default mongoose.model('User', UserSchema, 'users');