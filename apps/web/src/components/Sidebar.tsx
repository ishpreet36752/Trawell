import React from 'react';
import { Handshake, UsersRound, HandHeart, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

// Interfaces
interface NavigationItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const navigationItems: NavigationItem[] = [
    { icon: Handshake, label: 'Connections', path: '/connections' },
    { icon: UsersRound, label: 'Groups', path: '/groups' },
    { icon: HandHeart, label: 'Requests', path: '/requests' },
  ];

  return (
    <div className="sticky">
      <nav className="mt-5">
        {navigationItems.map((item: NavigationItem, index: number) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="m-1">
              <Link to={item.path}>
                <button className="font-bold text-xl flex justify-center hover:bg-gray-100 rounded-lg m-2 p-2">
                  <IconComponent className="mt-1 mx-2" />
                  {isOpen && <span>{item.label}</span>}
                </button>
              </Link>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;