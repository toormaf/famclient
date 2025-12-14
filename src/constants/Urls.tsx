export const URLS = {
    ANDROID_APP_LINK: "https://play.google.com/store/apps/details?id=com.pubg.imobile&hl=en_IN&gl=US",
    IOS_APP_LINK: "https://apps.apple.com/us/app/pubg-mobile-resistance/id1330123889",
    HOME_URL:"/home",
    LOGIN_URL:"/login"
};
export const API_ENDPOINTS = {
    ACCOUNT: {
        LOGIN: '/account/login',
        SIGNUP: '/account/signup',
        LOGOUT: '/auth/logout',
        REFRESH_TOKEN: '/auth/refresh',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_EMAIL: '/auth/verify-email',
    },
    IMAGES:'/f/',
    PEOPLE: {
        DETAILS: "/people/",
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

export const UN_AUTH_URLS = [API_ENDPOINTS.ACCOUNT.LOGIN, API_ENDPOINTS.ACCOUNT.SIGNUP];
