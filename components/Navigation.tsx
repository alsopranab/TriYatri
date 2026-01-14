
import React from 'react';
// Fix: Ensure NavLink is correctly imported
import { NavLink } from 'react-router-dom';

interface NavigationProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  isRiderMode?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isDarkMode, isRiderMode = false }) => {
  // ICON-ONLY NAVIGATION SPEC
  const navItems = isRiderMode ? [
    { path: '/', icon: 'fa-location-crosshairs' },
    { path: '/rides', icon: 'fa-indian-rupee-sign' },
    { path: '/profile', icon: 'fa-id-badge' },
  ] : [
    { path: '/', icon: 'fa-house' },
    { path: '/rides', icon: 'fa-clock-rotate-left' },
    { path: '/messages', icon: 'fa-comments' },
    { path: '/profile', icon: 'fa-user-gear' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 flex flex-col items-center pb-6 pointer-events-none z-[100]">
      <div className="pointer-events-auto flex items-center justify-around w-[90%] max-w-[340px] h-16 rounded-[32px] bg-[#1A1C1E] dark:bg-[#0A0A0A] shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-white/5 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex items-center justify-center transition-all duration-300 w-12 h-12 rounded-full ${
                isActive 
                  ? 'text-[#4BA678] scale-110' 
                  : 'text-white/30'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <i className={`fa-solid ${item.icon} text-lg`}></i>
                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-[#4BA678] rounded-full animate-in zoom-in duration-300"></div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Navigation;