import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, User, ShieldAlert, Sparkles, Check, X } from 'lucide-react';
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
  const dropdownRef = useRef(null);

  // Initialize SSE event source connection with resilient auto-reconnection
  useEffect(() => {
    let eventSource;
    let reconnectTimeout;

    const connectSSE = () => {
      // Close any existing connection safely first
      if (eventSource) {
        eventSource.close();
      }

      eventSource = new EventSource('http://localhost:5000/api/notifications/stream');

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
    <header className="h-20 bg-white shadow-sm border-b border-slate-100 flex items-center justify-between px-4 md:px-8 z-30 relative shrink-0">
      
      {/* Left Search Bar + Hamburger Trigger */}
      <div className="flex items-center gap-2 w-full md:w-96 relative">
        <button 
          onClick={toggleSidebar}
          className="md:hidden text-slate-500 hover:text-slate-800 p-2 hover:bg-slate-50 rounded-xl transition-all mr-1 shrink-0"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all text-xs font-semibold text-slate-800"
          />
        </div>
      </div>

      {/* Right User Bar */}
      <div className="flex items-center gap-6">
        
        {/* Bell Notification Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={handleToggleDropdown}
            className={`relative p-2.5 rounded-xl transition-all duration-200 text-slate-500 hover:text-secondary hover:bg-slate-50 border ${
              showDropdown ? 'border-secondary bg-blue-50/50 text-secondary' : 'border-slate-100'
            }`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white rounded-full border-2 border-white text-[9px] font-black flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Glowing Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-50 animate-fade-in divide-y divide-slate-100">
              
              {/* Dropdown Header */}
              <div className="px-5 py-4 bg-slate-900 text-white flex justify-between items-center">
                <span className="font-extrabold text-xs tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles size={14} className="text-accent animate-spin-slow" />
                  System Notifications
                </span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-black">
                  REALTIME
                </span>
              </div>

              {/* Notification Roster */}
              <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-50">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-4 flex gap-3 hover:bg-slate-50/50 transition-colors ${
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
              <div className="px-4 py-2.5 bg-slate-50 text-center text-[10px] text-slate-500 font-semibold select-none">
                Listening to native SSE stream port...
              </div>

            </div>
          )}
        </div>
        
        {/* User Badge */}
        <div 
          onClick={handleProfileRedirect}
          className="flex items-center gap-3 border-l pl-6 border-slate-100 select-none cursor-pointer hover:bg-slate-50/80 p-1.5 rounded-2xl transition-all"
          title="View Profile"
        >
          {currentUser.avatar ? (
            <img 
              src={`http://localhost:5000${currentUser.avatar}`} 
              alt={currentUser.name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-secondary shadow-md shadow-blue-500/10"
              onError={(e) => {
                e.target.onerror = null;
                // clear to fallback
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-black shadow-md shadow-blue-500/25">
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
        <div className="fixed top-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 p-4 border-l-4 border-l-secondary flex items-start gap-3.5 animate-slide-in shadow-blue-500/10">
          <div className={`p-2 rounded-xl shrink-0 ${
            activeToast.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
            activeToast.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
            'bg-blue-500/10 text-secondary'
          }`}>
            <Bell size={18} className="animate-bounce" />
          </div>
          
          <div className="flex-1">
            <h4 className="font-extrabold text-sm text-slate-100">{activeToast.title}</h4>
            <p className="text-xs text-slate-400 font-semibold mt-0.5 leading-snug">{activeToast.message}</p>
          </div>

          <button 
            onClick={() => setActiveToast(null)}
            className="text-slate-500 hover:text-slate-300 transition-colors p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}

    </header>
  );
};

export default Header;
