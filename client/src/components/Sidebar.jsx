import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Trophy, Activity, FileBarChart, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Students', path: '/students', icon: <Users size={20} /> },
    { name: 'Sports', path: '/sports', icon: <Trophy size={20} /> },
    { name: 'Performance', path: '/performance', icon: <Activity size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileBarChart size={20} /> },
  ];

  return (
    <div className="w-64 bg-primary text-white flex flex-col shadow-xl">
      <div className="h-20 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center font-bold text-lg shadow-lg">
            S
          </div>
          <span className="font-bold text-lg tracking-wide uppercase">Sport<span className="text-accent">Sync</span></span>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
        <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 px-2">Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-secondary/20 text-accent border border-secondary/30 shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-white/70 hover:bg-danger/20 hover:text-danger transition-colors duration-300">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
