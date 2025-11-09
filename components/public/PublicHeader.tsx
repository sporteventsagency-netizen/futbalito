import React from 'react';

interface NavItem {
  name: string;
  href: string;
}

interface PublicHeaderProps {
  logoUrl: string;
  title: string;
  primaryColor: string;
  navItems?: NavItem[];
  activePage?: string; // New prop to indicate the active page
}

/**
 * A reusable header for all public-facing pages.
 * It displays a logo, title, and an optional navigation menu.
 * @param {PublicHeaderProps} props The component props.
 * @returns {JSX.Element} The rendered header component.
 */
const PublicHeader: React.FC<PublicHeaderProps> = ({ logoUrl, title, primaryColor, navItems, activePage }) => {
  return (
    <header className="p-6 border-b bg-white shadow-sm sticky top-0 z-20" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
      <div className="container mx-auto flex justify-between items-center">
        <a href="/?portal=true" className="flex items-center">
          <img src={logoUrl} alt="Logo" className="h-12 w-12 rounded-full object-cover" />
          <h2 className="ml-4 text-xl font-bold text-gray-800">{title}</h2>
        </a>
        {navItems && navItems.length > 0 && (
          <nav className="hidden md:flex space-x-6 items-center">
            {navItems.map(item => {
              const isActive = activePage === item.name;
              return (
                <a 
                  key={item.name} 
                  href={item.href} 
                  className={`text-sm font-semibold transition-colors ${
                    isActive 
                      ? 'text-gray-900' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  style={isActive ? { color: primaryColor } : {}}
                >
                  {item.name}
                  {isActive && <div className="h-0.5 mt-1" style={{ backgroundColor: primaryColor }} />}
                </a>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};

export default PublicHeader;