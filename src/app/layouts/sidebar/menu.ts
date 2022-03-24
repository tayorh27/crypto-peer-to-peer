import { MenuItem } from './menu.model';

export const MENUA: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx bxs-dashboard',
        link: '',
    },
    {
        id: 7,
        isLayout: true
    },
    {
        id: 8,
        label: 'MORE',
        isTitle: true
    },
    {
        id: 9,
        label: 'MENUITEMS.APPS.TEXT',
        icon: 'bx bxs-grid',
        subItems: [
            {
                id: 10,
                label: 'MENUITEMS.APPS.LIST.CALENDAR',
                link: '/apps/calender',
                parentId: 9
            },
            {
                id: 11,
                label: 'MENUITEMS.APPS.LIST.CHAT',
                link: '/apps/chat',
                parentId: 9
            },
            {
                id: 12,
                label: 'MENUITEMS.APPS.LIST.EMAIL',
                badge: {
                    variant: 'success',
                    text: 'Em',
                },
                parentId: 9,
                subItems: [
                    {
                        id: 13,
                        label: 'MENUITEMS.APPS.LIST.SUB.INBOX',
                        link: '/apps/inbox',
                        parentId: 12
                    },
                    {
                        id: 14,
                        label: 'MENUITEMS.APPS.LIST.SUB.READEMAIL',
                        link: '/apps/read/1',
                        parentId: 12
                    }
                ]
            }
        ]
    },
    {
        id: 15,
        label: 'MENUITEMS.AUTHENTICATION.TEXT',
        icon: 'bx bx-user-circle',
        badge: {
            variant: 'success',
            text: '9',
        },
        subItems: [
            {
                id: 16,
                label: 'MENUITEMS.AUTHENTICATION.LIST.LOGIN',
                link: '/account/login',
                parentId: 15
            },
            {
                id: 16,
                label: 'MENUITEMS.AUTHENTICATION.LIST.LOGIN1',
                link: '/account/login1',
                parentId: 15
            },
            {
                id: 17,
                label: 'MENUITEMS.AUTHENTICATION.LIST.REGISTER',
                link: '/account/register',
                parentId: 15
            },
            {
                id: 17,
                label: 'MENUITEMS.AUTHENTICATION.LIST.REGISTER1',
                link: '/account/register1',
                parentId: 15
            },
            {
                id: 18,
                label: 'MENUITEMS.AUTHENTICATION.LIST.RECOVERPWD',
                link: '/account/recoverpwd',
                parentId: 15
            },
            {
                id: 18,
                label: 'MENUITEMS.AUTHENTICATION.LIST.RECOVERPWD1',
                link: '/account/recoverpwd1',
                parentId: 15
            },
            {
                id: 19,
                label: 'MENUITEMS.AUTHENTICATION.LIST.LOCKSCREEN',
                link: '/account/lockscreen',
                parentId: 15
            },
            {
                id: 20,
                label: 'MENUITEMS.AUTHENTICATION.LIST.CONFIRMMAIL',
                link: '/account/confirm-mail',
                parentId: 15
            },
            {
                id: 21,
                label: 'MENUITEMS.AUTHENTICATION.LIST.EMAILVERIFICATION',
                link: '/account/email-verification',
                parentId: 15
            },
            {
                id: 22,
                label: 'MENUITEMS.AUTHENTICATION.LIST.TWOSTEPVERIFICATION',
                link: '/account/two-step-verification',
                parentId: 15
            }
        ]
    },
    {
        id: 23,
        label: 'MENUITEMS.PAGES.TEXT',
        icon: 'bx bx-file',
        subItems: [
            {
                id: 24,
                label: 'MENUITEMS.PAGES.LIST.STARTER',
                link: '/pages/starter',
                parentId: 23
            },
            {
                id: 26,
                label: 'MENUITEMS.PAGES.LIST.PROFILE',
                link: '/pages/profile',
                parentId: 23
            },
            {
                id: 27,
                label: 'MENUITEMS.PAGES.LIST.INVOICE',
                link: '/pages/invoice',
                parentId: 23
            },
            {
                id: 28,
                label: 'MENUITEMS.PAGES.LIST.MAINTENANCE',
                link: '/pages/maintenance',
                parentId: 23
            },
            {
                id: 29,
                label: 'MENUITEMS.PAGES.LIST.COMINGSOON',
                link: '/pages/comingsoon',
                parentId: 23
            },
            {
                id: 30,
                label: 'MENUITEMS.PAGES.LIST.TIMELINE',
                link: '/pages/timeline',
                parentId: 23
            },
            {
                id: 31,
                label: 'MENUITEMS.PAGES.LIST.PRICING',
                link: '/pages/pricing',
                parentId: 23
            },
            {
                id: 32,
                label: 'MENUITEMS.PAGES.LIST.ERROR404',
                link: '/pages/404',
                parentId: 23
            },
            {
                id: 33,
                label: 'MENUITEMS.PAGES.LIST.ERROR500',
                link: '/pages/500',
                parentId: 23
            }
        ]
    },
    {
        id: 34,
        label: 'MENUITEMS.ADMINKIT.TEXT',
        isTitle: true
    },
    {
        id: 35,
        label: 'MENUITEMS.UIELEMENTS.TEXT',
        icon: 'bx bx-briefcase',
        link: '/ui',

    },
    {
        id: 36,
        label: 'MENUITEMS.ADVANCEDKIT.TEXT',
        icon: 'bx bxs-cube-alt',
        subItems: [
            {
                id: 37,
                label: 'MENUITEMS.ADVANCEDKIT.LIST.SWEETALERT',
                link: '/advanced/sweet-alert',
                parentId: 36
            },
            {
                id: 38,
                label: 'MENUITEMS.ADVANCEDKIT.LIST.RANGESLIDER',
                link: '/advanced/rangeslider',
                parentId: 36
            },
            {
                id: 39,
                label: 'MENUITEMS.ADVANCEDKIT.LIST.NOTIFICATIONS',
                link: '/advanced/notifications',
                parentId: 36
            },
            {
                id: 40,
                label: 'MENUITEMS.ADVANCEDKIT.LIST.CAROUSEL',
                link: '/advanced/carousel',
                parentId: 36
            }
        ]
    },
    {
        id: 41,
        label: 'MENUITEMS.TYPOGRAPHY.TEXT',
        icon: 'bx bx-text',
        link: '/typography',

    },
    {
        id: 42,
        label: 'MENUITEMS.FORMS.TEXT',
        icon: 'bx bxs-magic-wand',
        badge: {
            variant: 'danger',
            text: '2',
        },
        subItems: [
            {
                id: 43,
                label: 'MENUITEMS.FORMS.LIST.ELEMENTS',
                link: '/form/elements',
                parentId: 42
            },
            {
                id: 44,
                label: 'MENUITEMS.FORMS.LIST.ADVANCED',
                link: '/form/advanced',
                parentId: 42
            }
        ]
    },
    {
        id: 45,
        label: 'MENUITEMS.TABLES.TEXT',
        icon: 'bx bx-table',
        subItems: [
            {
                id: 46,
                label: 'MENUITEMS.TABLES.LIST.BASIC',
                link: '/tables/basic',
                parentId: 45
            },
            {
                id: 47,
                label: 'MENUITEMS.TABLES.LIST.ADVANCED',
                link: '/tables/datatable',
                parentId: 45
            }
        ]
    },
    {
        id: 48,
        label: 'MENUITEMS.CHARTS.TEXT',
        icon: 'bx bx-doughnut-chart',
        link: '/charts',

    },
    {
        id: 49,
        label: 'MENUITEMS.ICONS.TEXT',
        icon: 'bx bx-layer',
        subItems: [
            {
                id: 50,
                label: 'MENUITEMS.ICONS.LIST.BOXICONS',
                link: '/icons/boxicons',
                parentId: 49
            },
            {
                id: 51,
                label: 'MENUITEMS.ICONS.LIST.MATERIALDESIGN',
                link: '/icons/materialdesign',
                parentId: 49
            },
            {
                id: 52,
                label: 'MENUITEMS.ICONS.LIST.DRIPICONS',
                link: '/icons/dripicons',
                parentId: 49
            },
            {
                id: 53,
                label: 'MENUITEMS.ICONS.LIST.FONTAWESOME',
                link: '/icons/fontawesome',
                parentId: 49
            }
        ]
    },
    {
        id: 54,
        label: 'MENUITEMS.MAPS.TEXT',
        icon: 'bx bx-map',
        link: '/maps',

    },
    {
        id: 55,
        label: 'MENUITEMS.MULTILEVEL.TEXT',
        icon: 'bx-share-alt',
        subItems: [
            {
                id: 56,
                label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.1',
                parentId: 55
            },
            {
                id: 57,
                label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.2',
                parentId: 55,
                subItems: [
                    {
                        id: 58,
                        label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.1',
                        parentId: 57,
                    },
                    {
                        id: 59,
                        label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.2',
                        parentId: 57,
                    }
                ]
            },
        ]
    }
];

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx bxs-dashboard',
        link: '',
    },
    {
        id: 7,
        isLayout: true
    },
    {
        id: 8,
        label: 'CRYPTO',
        isTitle: true
    },
    {
        id: 18,
        label: 'P2P',
        icon: 'bx bxs-dashboard',
        link: '/p2p',
    },
    {
        id: 9,
        label: 'Create Order',
        icon: 'bx bxs-dashboard',
        link: '/p2p/new-order',
    },
    {
        id: 10,
        label: 'My Orders',
        icon: 'bx bxs-dashboard',
        link: '/p2p/my-orders',
    },
    {
        id: 11,
        label: 'Send/Receive Token',
        icon: 'bx bxs-dashboard',
        link: '/tokens',
    },
    {
        id: 12,
        label: 'Order History',
        icon: 'bx bxs-dashboard',
        link: '/p2p/orders/history',
    },
    {
        id: 13,
        label: 'Token Transactions',
        icon: 'bx bxs-dashboard',
        link: '/tokens/transaction',
    },
    {
        id: 14,
        label: 'FIAT',
        isTitle: true
    },
    {
        id: 15,
        isLayout: true
    },
    {
        id: 16,
        label: 'Fund NGN',
        icon: 'bx bxs-dashboard',
        link: '',
    },
    {
        id: 16,
        label: 'Withdraw NGN',
        icon: 'bx bxs-dashboard',
        link: '',
    },
    {
        id: 17,
        label: 'NGN Transactions',
        icon: 'bx bxs-dashboard',
        link: '',
    },
];

