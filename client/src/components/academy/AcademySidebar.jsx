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
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300 pointer-events-auto"
        ></div>
      )}

      {/* Main Sidebar Box */}
      <div className={`w-64 bg-primary text-white flex flex-col shadow-xl z-40 transition-transform duration-300 
        fixed md:relative top-0 bottom-0 left-0 h-full md:translate-x-0 
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-lg shadow-lg">
              A
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide uppercase block leading-tight">
                Academy<span className="text-amber-400">Portal</span>
              </span>
              <span className="text-[9px] text-white/40 font-semibold uppercase tracking-widest truncate max-w-[120px] block">
                {currentUser.instituteName || 'SportSphere'}
              </span>
            </div>
          </div>

          {/* Close menu drawer button (Mobile only) */}
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="md:hidden text-white/60 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Navigation list */}
        <div className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
          <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 px-2 select-none">Menu</div>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)] font-bold' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white font-medium'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <button 
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-white/70 hover:bg-red-500/20 hover:text-red-400 transition-colors duration-300 cursor-pointer font-bold"
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
