import React, { useState, useEffect, useRef } from 'react';
import { Bell, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar, searchTerm = "", setSearchTerm = () => {} }) => {
  const navigate = useNavigate();

  // Read user from localStorage dynamically
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem('user')) || { name: 'Admin', role: 'Sports Director' };
  });

  useEffect(() => {
    const handleUserUpdate = () => {
      const u = JSON.parse(localStorage.getItem('user')) || { name: 'Admin', role: 'Sports Director' };
      setCurrentUser(u);
    };

    window.addEventListener('user-update', handleUserUpdate);
    return () => window.removeEventListener('user-update', handleUserUpdate);
  }, []);

  const initial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'A';

  const handleProfileRedirect = () => {
    if (currentUser.role === 'admin') {
      navigate('/profile');
    } else if (currentUser.role === 'institution' && currentUser.instituteType === 'academy') {
      navigate('/academy/profile');
    } else {
      navigate('/institute/profile');
    }
  };

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: "notif-init-1",
      title: "Welcome to SportSphere Dashboard",
      message: "Your administrator dashboard is loaded and fully synchronized.",
      type: "info",
      timestamp: new Date(Date.now() - 3600000) // 1h ago
    },
    {
      id: "notif-init-2",
      title: "Active System Evaluation",
      message: "Physical Test engine successfully mounted on standard class structures.",
      type: "success",
      timestamp: new Date(Date.now() - 7200000) // 2h ago
    }
  ]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [activeToast, setActiveToast] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dashboard-theme') === 'dark' ? 'dark' : 'light';
  });
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('dashboard-theme', theme);
  }, [theme]);

  // Initialize SSE event source connection with resilient auto-reconnection
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const SERVER_BASE = API_BASE.replace('/api', '');

  useEffect(() => {
    let eventSource;
    let reconnectTimeout;

    const connectSSE = () => {
      // Close any existing connection safely first
      if (eventSource) {
        eventSource.close();
      }

      // Fix #15: Use VITE_API_URL env var — no hardcoded localhost
      eventSource = new EventSource(`${SERVER_BASE}/api/notifications/stream`);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Ignore initial connection confirmation
          if (data.status === 'connected') return;

          // Add to notifications feed
          const newNotif = {
            id: data.id || `notif-${Date.now()}`,
            title: data.title || "Notification Received",
            message: data.message || "",
            type: data.type || "info",
            timestamp: new Date(data.timestamp || Date.now())
          };

          setNotifications((prev) => [newNotif, ...prev]);
          setUnreadCount((c) => c + 1);

          // Display screen-wide animated toast notification
          setActiveToast(newNotif);
          
          // Auto-dismiss toast after 4.5 seconds
          setTimeout(() => {
            setActiveToast(null);
          }, 4500);

        } catch (err) {
          // Silent error handler for parsing failures
        }
      };

      eventSource.onerror = () => {
        // Terminate failed socket stream safely
        if (eventSource) {
          eventSource.close();
        }
        // Gracefully attempt reconnection in 5 seconds
        reconnectTimeout = setTimeout(connectSSE, 5000);
      };
    };

    connectSSE();

    // Close sockets on unmount
    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
    setUnreadCount(0); // Mark all as read
  };

  const handleThemeToggle = () => {
    setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark');
  };

  const isDarkTheme = theme === 'dark';

  const getHumanTime = (dateObj) => {
    const diffMs = Date.now() - new Date(dateObj).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return new Date(dateObj).toLocaleDateString();
  };

  return (
    <header className="h-[72px] bg-bg-card shadow-sm border-b border-[#d8cfc0] flex items-center justify-between px-4 md:px-7 z-30 relative shrink-0">
      
      {/* Left Search Bar + Hamburger Trigger */}
      <div className="flex items-center gap-2 flex-1 min-w-0 md:max-w-96 relative">
        <button 
          onClick={toggleSidebar}
          className="md:hidden text-slate-500 hover:text-slate-900 p-2 hover:bg-[#f3eadc] rounded-lg transition-all mr-1 shrink-0"
        >
          <Menu size={22} strokeWidth={2.4} />
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 text-slate-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#fbf7ee] border border-[#d8cfc0] rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-xs font-semibold text-slate-800"
          />
        </div>
      </div>

      {/* Right User Bar */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-5 shrink-0">
        {/* Black / White Theme Toggle */}
        <button
          type="button"
          onClick={handleThemeToggle}
          className={`relative h-10 w-16 shrink-0 overflow-hidden rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary/25 ${
            isDarkTheme
              ? 'bg-[#05070a] border-[#313943] shadow-[0_0_0_1px_rgba(85,255,170,0.08)]'
              : 'bg-white border-[#d8cfc0] shadow-sm hover:bg-[#fbf7ee]'
          }`}
          aria-label={isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span
            className={`absolute inset-y-0 flex w-full items-center justify-between px-2 transition-colors ${
              isDarkTheme ? 'text-white/55' : 'text-slate-400'
            }`}
            aria-hidden="true"
          >
            <Sun size={14} />
            <Moon size={14} />
          </span>
          <span
            className={`absolute left-1 top-1 flex h-8 w-8 items-center justify-center rounded-md transition-all duration-300 ${
              isDarkTheme
                ? 'translate-x-6 bg-white text-black shadow-[0_0_18px_rgba(125,255,190,0.18)]'
                : 'translate-x-0 bg-black text-white shadow-sm'
            }`}
            aria-hidden="true"
          >
            {isDarkTheme ? <Moon size={15} /> : <Sun size={15} />}
          </span>
        </button>
        
        {/* Bell Notification Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={handleToggleDropdown}
            className={`relative p-2.5 rounded-lg transition-all duration-200 text-slate-600 hover:text-secondary hover:bg-[#f3eadc] border ${
              showDropdown ? 'border-secondary bg-[#eaf2f8] text-secondary' : 'border-[#d8cfc0]'
            }`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-danger text-white rounded-full border-2 border-bg-card text-[9px] font-black flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Glowing Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-[-59px] sm:right-0 mt-3 w-[calc(100vw-2rem)] max-w-80 bg-bg-card rounded-lg border border-[#d8cfc0] shadow-xl overflow-hidden z-50 animate-fade-in divide-y divide-[#e4dccf]">
              
              {/* Dropdown Header */}
              <div className="px-5 py-4 bg-[#ecf3f8] text-primary flex justify-between items-center">
                <span className="font-extrabold text-xs tracking-wider uppercase flex items-center gap-1.5">
                  <Bell size={14} className="text-secondary" />
                  System Notifications
                </span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#cadeeb] text-secondary font-black">
                  REALTIME
                </span>
              </div>

              {/* Notification Roster */}
              <div className="max-h-[300px] overflow-y-auto divide-y divide-[#efe7d9]">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-4 flex gap-3 hover:bg-[#fbf7ee] transition-colors ${
                        notif.type === 'warning' ? 'border-l-4 border-amber-500' :
                        notif.type === 'success' ? 'border-l-4 border-emerald-500' :
                        'border-l-4 border-secondary'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-2">
                          <h5 className="font-extrabold text-slate-800 text-xs">{notif.title}</h5>
                          <span className="text-[9px] text-slate-400 font-bold shrink-0">{getHumanTime(notif.timestamp)}</span>
                        </div>
                        <p className="text-[10px] font-medium text-slate-500 mt-1 leading-normal">{notif.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                    No active notifications.
                  </div>
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="px-4 py-2.5 bg-[#fbf7ee] text-center text-[10px] text-slate-500 font-semibold select-none">
                Listening to native SSE stream port...
              </div>

            </div>
          )}
        </div>
        
        {/* User Badge */}
        <div 
          onClick={handleProfileRedirect}
          className="flex items-center gap-2 sm:gap-3 border-l pl-2 sm:pl-3 md:pl-5 border-[#e2d8c9] select-none cursor-pointer hover:bg-[#f3eadc] p-1.5 rounded-lg transition-all"
          title="View Profile"
        >
          {currentUser.avatar ? (
            <img 
              src={`${SERVER_BASE}${currentUser.avatar}`} 
              alt={currentUser.name} 
              className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-secondary shadow-sm"
              onError={(e) => {
                e.target.onerror = null;
                // clear to fallback
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-secondary text-white flex items-center justify-center font-black shadow-sm">
              {initial}
            </div>
          )}
          <div className="hidden sm:block">
            <p className="text-sm font-extrabold text-slate-800 leading-tight">{currentUser.name}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              {currentUser.role === 'admin' ? 'Admin' : currentUser.instituteType === 'academy' ? 'Academy' : 'Institute'}
            </p>
          </div>
        </div>

      </div>

      {/* Modern, High-End Slide-In Toast Notification Alert */}
      {activeToast && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:top-6 sm:right-6 sm:w-full sm:max-w-sm z-50 bg-bg-card text-slate-800 rounded-lg shadow-xl border border-[#d8cfc0] p-4 border-l-4 border-l-secondary flex items-start gap-3.5 animate-slide-in">
          <div className={`p-2 rounded-xl shrink-0 ${
            activeToast.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
            activeToast.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
            'bg-blue-500/10 text-secondary'
          }`}>
            <Bell size={18} className="animate-bounce" />
          </div>
          
          <div className="flex-1">
            <h4 className="font-extrabold text-sm text-slate-900">{activeToast.title}</h4>
            <p className="text-xs text-slate-600 font-semibold mt-0.5 leading-snug">{activeToast.message}</p>
          </div>

          <button 
            onClick={() => setActiveToast(null)}
            className="text-slate-500 hover:text-slate-800 transition-colors p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}

    </header>
  );
};

export default Header;
