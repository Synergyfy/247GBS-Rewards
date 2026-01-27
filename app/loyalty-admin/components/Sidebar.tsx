'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Gift, Megaphone, X, ChevronDown, QrCode } from 'lucide-react';

const menuItems = [
  {
    title: 'Business',
    path: '/loyalty-admin/business',
    icon: LayoutDashboard,
  },
  {
    title: 'Staff',
    path: '/loyalty-admin/staff',
    icon: Users,
  },
  {
    title: 'Rewards',
    path: '/loyalty-admin/rewards',
    icon: Gift,
  },
  {
    title: 'Campaign',
    path: '/loyalty-admin/campaign',
    icon: Megaphone,
    subLinks: [
      { title: 'All Campaigns', path: '/loyalty-admin/campaign?type=ALL' },
      { title: 'Preset', path: '/loyalty-admin/campaign?type=PRESET' },
      { title: 'Seasonal', path: '/loyalty-admin/campaign?type=SEASONAL' },
      { title: 'Co-Branded', path: '/loyalty-admin/campaign?type=CO_BRANDED' },

    ]
  },
  {
    title: 'Generate Codes',
    path: '/loyalty-admin/generate-codes',
    icon: QrCode,
  },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const currentType = searchParams?.get('type') || (pathname === '/loyalty-admin/campaign' ? 'ALL' : '');

  const [openSubMenus, setOpenSubMenus] = React.useState<Record<string, boolean>>({
    Campaign: pathname.startsWith('/loyalty-admin/campaign')
  });

  const toggleSubMenu = (title: string) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            LoyaltyPro
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-2" data-tour-id="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || (item.subLinks && item.subLinks.some(sub => pathname === sub.path.split('?')[0]));
            const Icon = item.icon;
            const tourId = `menu-${item.title.toLowerCase()}`;
            const isSubMenuOpen = openSubMenus[item.title];

            if (item.subLinks) {
              return (
                <div key={item.title} className="space-y-1">
                  <button
                    onClick={() => toggleSubMenu(item.title)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${isSubMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isSubMenuOpen && (
                    <div className="pl-12 space-y-1">
                      {item.subLinks.map((sub) => {
                        const subPathBase = sub.path.split('?')[0];
                        const subType = new URLSearchParams(sub.path.split('?')[1]).get('type');
                        const isSubActive = pathname === subPathBase && currentType === subType;

                        return (
                          <Link
                            key={sub.path}
                            href={sub.path}
                            onClick={() => setIsOpen(false)}
                            className={`block py-2 text-sm transition-colors duration-200 ${isSubActive
                              ? 'text-blue-600 font-medium'
                              : 'text-gray-500 hover:text-gray-900'
                              }`}
                          >
                            {sub.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                data-tour-id={tourId}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
