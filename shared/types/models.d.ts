export type User = {
  userID: string;
  created: number;
  email: {
    value: string;
    verified: boolean;
  };
  profile: {
    username: string;
    avatar: string;
    imageID: string;
    website: string;
    bio: string;
  };
  contacts: {
    blocked: string[];
    pending: string[];
    requests: string[];
    accepted: string[];
  };
  pubKey: string;
  privKey: {
    iv: string;
    ciphertext: string;
  };
  preferences: {
    privacy: {
      showOnlineStatus: boolean;
      showLastSeen: boolean;
      showReadReceipts: boolean;
    };
    notifications: {
      showNotifications: boolean;
      playSound: boolean;
    };
    general: {
      theme: string;
      language: string;
    };
    security: {
      twoFactor: {
        active: boolean;
        secret: string;
      };
      password: string;
    };
  };
}

export type Contact = {
  username: string;
  avatar: string;
  imageID: string;
  website: string;
  bio: string;
};

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'file';
  url: string;
  name: string;
  size: number;
}

export interface Reaction {
  userId: string;
  type: 'like' | 'love' | 'laugh' | 'surprise' | 'sad' | 'angry';
}

export interface EditHistory {
  editedAt: Date;
  previousContent: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  attachments?: Attachment[];
  reactions?: Reaction[];
  editHistory?: EditHistory[];
  isRead: boolean;
  offset: number; // This is client-side only
}

export interface EncryptedMessage {
  roomId: string;
  author: string;
  recipient: string;
  encryptedAESKey: string; // Encrypted symmetric key
  iv: string; // Initialization vector
  encryptedMessage: string; // Encrypted message data
  timestamp: Date; // Timestamp of the message
}
