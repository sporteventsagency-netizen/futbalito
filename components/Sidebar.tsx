
import React from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import usePermissions from '../hooks/usePermissions.ts';
// FIX: Added .ts extension to module import to resolve module resolution error.
import type { Page } from '../types.ts';
import {
  ChartPieIcon, EyeIcon, WrenchScrewdriverIcon, UsersIcon,
  UserGroupIcon, FlagIcon, MapIcon, LifebuoyIcon, UserCircleIcon,
  ShieldCheckIcon, NewspaperIcon, BanknotesIcon, Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon, XMarkIcon, BuildingLibraryIcon, AcademicCapIcon,
  TrophyIcon
} from './icons/Icons.tsx';

interface SidebarProps {
  page: Page;
  setPage: (page: Page) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

// FIX: Define a type for menu items to ensure type safety.
interface MenuItem {
    page: Page;
    label: string;
    icon: React.ReactNode;
    permission: boolean;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  pageName: Page;
  currentPage: Page;
  setPage: (page: Page) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, pageName, currentPage, setPage }) => (
  <li>
    <button
      onClick={() => setPage(pageName)}
      className={`w-full flex items-center p-2 rounded-lg text-left transition-colors ${
        currentPage === pageName
          ? 'bg-blue-600 text-white'
          : 'text-gray-200 hover:bg-blue-800 hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ page, setPage, sidebarOpen, setSidebarOpen }) => {
  const { organizationSettings } = useCompetitions();
  const { hasPermission } = usePermissions();

  // FIX: Explicitly type the menuItems object to fix type inference issues.
  const menuItems: {
    main: MenuItem[];
    manage: MenuItem[];
    tools: MenuItem[];
    account: MenuItem[];
  } = {
    main: [
      { page: 'DASHBOARD', label: 'Dashboard', icon: <ChartPieIcon className="h-6 w-6" />, permission: true },
      { page: 'BROWSE', label: 'Browse', icon: <EyeIcon className="h-6 w-6" />, permission: true },
    ],
    manage: [
      { page: 'MANAGE_COMPETITIONS', label: 'Competitions', icon: <ShieldCheckIcon className="h-6 w-6" />, permission: hasPermission('competitions:edit') },
      { page: 'MANAGE_SPORTS', label: 'Sports', icon: <TrophyIcon className="h-6 w-6" />, permission: hasPermission('sports:manage') },
      { page: 'MANAGE_TEAMS', label: 'Teams', icon: <UsersIcon className="h-6 w-6" />, permission: hasPermission('teams:edit') },
      { page: 'MANAGE_PLAYERS', label: 'Players', icon: <UserGroupIcon className="h-6 w-6" />, permission: hasPermission('players:manage') },
      { page: 'MANAGE_ARENAS', label: 'Arenas', icon: <MapIcon className="h-6 w-6" />, permission: hasPermission('arenas:manage') },
      { page: 'MANAGE_REFEREES', label: 'Referees', icon: <LifebuoyIcon className="h-6 w-6" />, permission: hasPermission('referees:manage') },
      { page: 'MANAGE_OBSERVERS', label: 'Observers', icon: <UserCircleIcon className="h-6 w-6" />, permission: hasPermission('observers:manage') },
      { page: 'MANAGE_ORGANIZERS', label: 'Organizers', icon: <AcademicCapIcon className="h-6 w-6" />, permission: hasPermission('organizers:manage') },
      { page: 'MANAGE_NATIONAL_TEAM', label: 'National Team', icon: <FlagIcon className="h-6 w-6" />, permission: hasPermission('players:manage') },
    ],
    tools: [
      { page: 'PUBLISH', label: 'Publish', icon: <NewspaperIcon className="h-6 w-6" />, permission: hasPermission('publish:customize_sites') },
      { page: 'REPORTS', label: 'Reports', icon: <BanknotesIcon className="h-6 w-6" />, permission: hasPermission('transfers:manage') },
      { page: 'MARKETPLACE', label: 'Marketplace', icon: <BuildingLibraryIcon className="h-6 w-6" />, permission: true },
    ],
    account: [
      { page: 'SETTINGS', label: 'Settings', icon: <Cog6ToothIcon className="h-6 w-6" />, permission: true },
    ]
  };

  return (
    <>
        <div className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-30 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
        <aside className={`fixed lg:relative inset-y-0 left-0 bg-blue-900 text-white w-64 p-4 space-y-6 flex flex-col transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}>
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <img src={organizationSettings.logoUrl} alt="Logo" className="h-10 w-10 rounded-full" />
                <span className="text-xl font-bold">{organizationSettings.name}</span>
            </div>
             <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-300 hover:text-white">
                <XMarkIcon className="h-6 w-6" />
            </button>
        </div>

        <nav className="flex-1">
            <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Main</h3>
            <ul className="mt-2 space-y-1">
                {menuItems.main.filter(item => item.permission).map(item => (
                    <NavItem key={item.page} icon={item.icon} label={item.label} pageName={item.page} currentPage={page} setPage={setPage} />
                ))}
            </ul>

            <h3 className="mt-6 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Manage</h3>
            <ul className="mt-2 space-y-1">
                 {menuItems.manage.filter(item => item.permission).map(item => (
                    <NavItem key={item.page} icon={item.icon} label={item.label} pageName={item.page} currentPage={page} setPage={setPage} />
                ))}
            </ul>

            <h3 className="mt-6 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tools</h3>
            <ul className="mt-2 space-y-1">
                {menuItems.tools.filter(item => item.permission).map(item => (
                    <NavItem key={item.page} icon={item.icon} label={item.label} pageName={item.page} currentPage={page} setPage={setPage} />
                ))}
            </ul>
        </nav>

        <div>
            <ul className="space-y-1 border-t border-blue-800 pt-4">
                 {menuItems.account.filter(item => item.permission).map(item => (
                    <NavItem key={item.page} icon={item.icon} label={item.label} pageName={item.page} currentPage={page} setPage={setPage} />
                ))}
                 <li>
                    <button
                    className="w-full flex items-center p-2 rounded-lg text-gray-200 hover:bg-blue-800 hover:text-white"
                    >
                    <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
                    <span className="ml-3">Logout</span>
                    </button>
                </li>
            </ul>
        </div>
        </aside>
    </>
  );
};

export default Sidebar;