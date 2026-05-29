import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardList, LogOut, X, Activity } from 'lucide-react';

const AcademySidebar = ({ isOpen, setIsOpen }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem('user')) || {};
  });

  useEffect(() => {
    const handleUserUpdate = () => {
      const u = JSON.parse(localStorage.getItem('user')) || {};
      setCurrentUser(u);
    };

    window.addEventListener('user-update', handleUserUpdate);
    return () => window.removeEventListener('user-update', handleUserUpdate);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/academy/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Athletes', path: '/academy/students', icon: <Users size={20} /> },
    { name: 'Physical Tests', path: '/academy/physical-tests', icon: <ClipboardList size={20} /> },
    { name: 'Performance', path: '/academy/performance', icon: <Activity size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/institute/login';
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-slate-950/35 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300 pointer-events-auto"
        ></div>
      )}

      {/* Main Sidebar Box */}
      <div className={`w-64 bg-bg-card text-slate-800 flex flex-col shadow-sm border-r border-[#d8cfc0] z-40 transition-transform duration-300 
        fixed md:relative top-0 bottom-0 left-0 h-full md:translate-x-0 
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-[#e2d8c9] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#b97716] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              A
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide uppercase block leading-tight text-slate-900">
                Academy<span className="text-accent">Portal</span>
              </span>
              <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-widest truncate max-w-[120px] block">
                {currentUser.instituteName || 'SportSphere'}
              </span>
            </div>
          </div>

          {/* Close menu drawer button (Mobile only) */}
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="md:hidden text-slate-500 hover:text-slate-900 p-1 hover:bg-[#f3eadc] rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Navigation list */}
        <div className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2 select-none">Menu</div>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#fff1d6] text-[#8a520f] border border-[#e7c98e] font-bold' 
                    : 'text-slate-600 hover:bg-[#f3eadc] hover:text-slate-900 font-medium'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-[#e2d8c9] shrink-0">
          <button 
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-300 cursor-pointer font-bold"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AcademySidebar;
