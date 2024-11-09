interface User {
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

type Contact = User.Profile;

export type { User, Contact };