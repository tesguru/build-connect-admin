

export const APIURLS = {

    AUTH: {
      LOGIN: 'auth/login',
      REGISTER: 'auth/signup',
      FORGOT_PASSWORD: '/auth/forgot-password',
      VERIFYOTP: '/auth/verify-reset-otp',
      RESENDOTP: '/auth/resend-reset-otp',
      CHANGEPASSWORD: '/auth/reset-password',
      REFRESHTOKEN: '/auth/reset-token'
    },
    DASHBOARD: {
    USERS: '/admin/users',
    PROJECTS: '/admin/projects',
    BIDS: '/admin/bids',
    DOCUMENTS: '/admin/documents',
    MEETINGS: '/admin/meetings',
    ADMIN: '/admin/admins',
    ESCROW: '/admin/escrows',
    PROPERTY: '/admin/properties',
    MORTGAGE: '/admin/mortgage-applications',
    DELETE_REQUESTS: '/admin/account-deletion/requests',
    UPLOAD: {
    PREPARE_UPLOAD: "admin/files/prepare",
    CONFIRM_UPLOAD: (fileId: string) => `admin/files/${fileId}/confirm`,
  },
   SUPPORT: {
    SUPPORT: '/admin/support',
  },
    INDEX: {
    DASHBOARDANALYTICS: '/admin/analytics/',
    RECENTACTIVITY: '/admin/support',
  },
    },
 
} as const;