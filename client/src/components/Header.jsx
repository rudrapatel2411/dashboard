import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-20 bg-bg-card shadow-sm border-b border-gray-100 flex items-center justify-between px-8 z-10">
      <div className="flex items-center w-96 relative">
        <Search className="absolute left-3 text-text-light w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search students, sports..." 
          className="w-full bg-bg-main border border-gray-200 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 rounded-full hover:bg-bg-main transition-colors text-text-light hover:text-secondary">
          <Bell size={22} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l pl-6 border-gray-200 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-semibold text-text-dark">Admin User</p>
            <p className="text-xs text-text-light">Sports Director</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
