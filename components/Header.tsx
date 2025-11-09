

import React, { useState, useRef, useEffect } from 'react';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../context/CompetitionContext.tsx';
// FIX: Added .ts extension to module import.
import usePermissions from '../hooks/usePermissions.ts';
// FIX: Added .tsx extension to module import.
import { Bars3Icon, MagnifyingGlassIcon, ChevronDownIcon, UserIcon } from './icons/Icons.tsx';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { users, setCurrentUser } = useCompetitions();
  const { currentUser, currentRole } = usePermissions();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!currentUser) return null;

  return (
    <header className="flex-shrink-0 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="relative ml-4 hidden md:block">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
            >
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-gray-500" />
                </div>
                <div className="text-left hidden md:block">
                    <p className="text-sm font-semibold text-gray-800">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentRole?.name}</p>
                </div>
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </button>
            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                    <div className="py-1">
                        <p className="px-4 py-2 text-xs text-gray-500">Switch User</p>
                        {users.map(user => (
                            <button
                                key={user.id}
                                onClick={() => {
                                    setCurrentUser(user.id);
                                    setDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm ${currentUser.id === user.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                {user.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
