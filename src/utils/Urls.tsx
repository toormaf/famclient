export const URLS = {
    ANDROID_APP_LINK: "https://play.google.com/store/apps/details?id=com.pubg.imobile&hl=en_IN&gl=US",
    IOS_APP_LINK: "https://apps.apple.com/us/app/pubg-mobile-resistance/id1330123889"
};

export const API_ENDPOINTS = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || '',

    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH_TOKEN: '/auth/refresh',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_EMAIL: '/auth/verify-email',
    },

    USER: {
        PROFILE: '/user/profile',
        UPDATE_PROFILE: '/user/profile/update',
        PREFERENCES: '/user/preferences',
        DELETE_ACCOUNT: '/user/delete',
    },

    FAMILY: {
        TREE: '/family/tree',
        MEMBERS: '/family/members',
        ADD_MEMBER: '/family/members/add',
        UPDATE_MEMBER: '/family/members/update',
        DELETE_MEMBER: '/family/members/delete',
        CONNECTIONS: '/family/connections',
    },

    CHAT: {
        MESSAGES: '/chat/messages',
        SEND_MESSAGE: '/chat/send',
        CONVERSATIONS: '/chat/conversations',
        CREATE_CONVERSATION: '/chat/create',
    },

    VAULT: {
        DOCUMENTS: '/vault/documents',
        UPLOAD: '/vault/upload',
        DOWNLOAD: '/vault/download',
        DELETE: '/vault/delete',
    },

    MAPS: {
        LOCATIONS: '/maps/locations',
        ADD_LOCATION: '/maps/add',
        UPDATE_LOCATION: '/maps/update',
        DELETE_LOCATION: '/maps/delete',
    },

    NOTES: {
        ALL: '/notes',
        CREATE: '/notes/create',
        UPDATE: '/notes/update',
        DELETE: '/notes/delete',
    },
};