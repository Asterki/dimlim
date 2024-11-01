export interface Preferences {
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
      secret?: string;
    };
    password: string;
  };
}

export interface Contacts {
  blocked: string[];
  pending: string[];
  requests: string[];
  accepted: string[];
}

export interface Profile {
  username: string;
  avatar?: string;
  email: {
    value: string;
    verified: boolean;
  };
  imageID?: string;
  website?: string;
  bio?: string;
}

export interface User {
  userID: string;
  created: number;
  profile: Profile;
  contacts: Contacts;
  pubKey?: Buffer;
  preferences: Preferences;
}

export type { User, Profile, Contacts, Preferences };
