import mongoose from "mongoose";
const Schema = mongoose.Schema;

const User = new Schema({
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
        username: {
            type: String,
            required: true,
            unique: true,
        },
        avatar: {
            type: String,
            default: "",
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
            default: "",
        }
    },

    contacts: {
        blocked: {
            type: Array<string>,
            default: [],
        },
        pending: {
            type: Array<string>,
            default: [],
        },
        requests: {
            type: Array<string>,
            default: [],
        },
        accepted: {
            type: Array<string>,
            default: [],
        },
    },

    pubKey: {
        type: Buffer,
    },

    preferences: {
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
                theme: "dark",
                language: "en",
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
                },
            },
            password: {
                type: String,
                required: true,
            },
        },
    },
});

export default mongoose.model("User", User, "users");
