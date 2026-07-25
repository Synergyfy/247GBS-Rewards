// ============================================
// Tour Step Types & Configuration
// ============================================

export interface TourStep {
    id: string;
    targetSelector: string;
    title: string;
    description: string;
    placement: 'top' | 'right' | 'bottom' | 'left';
    route?: string;
}

export const tourSteps: TourStep[] = [
    {
        id: 'sidebar-navigation',
        targetSelector: '[data-tour-id="sidebar-nav"]',
        title: 'Navigation Menu',
        description: 'Use the sidebar to navigate between different sections of your dashboard. Access Business, Staff, Rewards, and Campaign management from here.',
        placement: 'right',
        route: '/loyalty-admin/business',
    },
    {
        id: 'business-menu',
        targetSelector: '[data-tour-id="menu-business"]',
        title: 'Business Management',
        description: 'Manage your business profiles, settings, and configurations. This is where you set up your organization details.',
        placement: 'right',
        route: '/loyalty-admin/business',
    },
    {
        id: 'staff-menu',
        targetSelector: '[data-tour-id="menu-staff"]',
        title: 'Staff Management',
        description: 'Add and manage your team members. Control access permissions and monitor staff activity.',
        placement: 'right',
    },
    {
        id: 'rewards-menu',
        targetSelector: '[data-tour-id="menu-rewards"]',
        title: 'Rewards Setup',
        description: 'Create and manage reward tiers for your loyalty program. Define point values and redemption options.',
        placement: 'right',
    },
    {
        id: 'campaign-menu',
        targetSelector: '[data-tour-id="menu-campaign"]',
        title: 'Campaign Center',
        description: 'Launch promotional campaigns to engage your customers. Track performance and optimize results.',
        placement: 'right',
    },
    {
        id: 'header-area',
        targetSelector: '[data-tour-id="header"]',
        title: 'Dashboard Header',
        description: 'Access quick actions and your account settings from the header bar.',
        placement: 'bottom',
    },
    {
        id: 'help-button',
        targetSelector: '[data-tour-id="help-button"]',
        title: 'Need Help?',
        description: 'You can restart this tour anytime by clicking the Help button. We\'re here to guide you!',
        placement: 'bottom',
    },
];
