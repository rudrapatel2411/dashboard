import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, ClipboardList, Activity, FileBarChart, UserCheck, LogOut, X, School } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Institutions', path: '/institutions', icon: <Building2 size={20} /> },
    { name: 'Academies', path: '/academies', icon: <School size={20} /> },
    { name: 'Performance', path: '/performance', icon: <Activity size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileBarChart size={20} /> },
    { name: 'Institute Approvals', path: '/approval', icon: <UserCheck size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
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
            <div className="w-10 h-10 rounded-lg bg-secondary text-white flex items-center justify-center font-bold text-lg shadow-sm">
              S
            </div>
            <span className="font-bold text-lg tracking-wide uppercase text-slate-900">
              Sport<span className="text-secondary">Sphere</span>
            </span>
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
              onClick={() => setIsOpen(false)} // Auto collapse drawer on mobile selection
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#eaf2f8] text-secondary border border-[#cadeeb] font-bold' 
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

export default Sidebar;
