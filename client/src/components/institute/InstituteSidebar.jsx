import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardList, FileBarChart, LogOut, X, Activity } from 'lucide-react';

const InstituteSidebar = ({ isOpen, setIsOpen }) => {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const navItems = [
    { name: 'Dashboard', path: '/institute/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Students', path: '/institute/students', icon: <Users size={20} /> },
    { name: 'Physical Tests', path: '/institute/physical-tests', icon: <ClipboardList size={20} /> },
    { name: 'Performance', path: '/institute/performance', icon: <Activity size={20} /> },
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
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center font-bold text-lg shadow-lg">
              I
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide uppercase block leading-tight">
                Institute<span className="text-blue-400">Portal</span>
              </span>
              <span className="text-[9px] text-white/40 font-semibold uppercase tracking-widest">
                {user.instituteName || 'SportSphere'}
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
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.2)] font-bold' 
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

export default InstituteSidebar;
