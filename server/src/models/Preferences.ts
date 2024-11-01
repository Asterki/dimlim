import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PreferencesSchema = new Schema({
  privacy: {
    type: Object,
    default: {
      showOnlineStatus: true,
      showLastSeen: true,
      showReadReceipts: true,
    },
  },
  notifications: {
    type: Object,
    default: {
      showNotifications: true,
      playSound: true,
    },
  },
  general: {
    type: Object,
    default: {
      theme: 'dark',
      language: 'en',
    },
  },
  security: {
    twoFactor: {
      active: {
        type: Boolean,
        default: false,
      },
      secret: {
        type: String,
        default: '',
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
});

export default mongoose.model('Preferences', PreferencesSchema);