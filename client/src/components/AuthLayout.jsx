import React, { useState, useEffect } from 'react';
import { Activity, UserPlus, ShieldAlert } from 'lucide-react';

const RunningAthlete = () => {
  const [pose, setPose] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPose((p) => (p + 1) % 8);
    }, 75); // Professional high-speed 75ms run-cycle rate
    return () => clearInterval(timer);
  }, []);

  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
      {/* Dynamic speed-dust lines behind the athlete */}
      {pose % 2 === 0 ? (
        <g stroke="currentColor" strokeWidth="1" opacity="0.6">
          <path d="M3 8h3" />
          <path d="M1 12h4" />
          <path d="M2 16h3" />
        </g>
      ) : (
        <g stroke="currentColor" strokeWidth="1" opacity="0.6">
          <path d="M2 9h3" />
          <path d="M0 13h5" />
          <path d="M1 17h3" />
        </g>
      )}

      {pose === 0 && (
        <>
          <circle cx="13.5" cy="4.2" r="1.8" fill="currentColor" />
          <path d="M12.5 6c-0.5 1.5-1 3-1.5 5" />
          <path d="M11 11l3.5 3 1.5 4.5 1.5-0.3" />
          <path d="M11 11l-2.5 2-2 4-1-0.5" />
          <path d="M12 6.8l2.5 2.2 2 2" />
          <path d="M12 6.8l-2.5 1.7-1.5 1.5" />
        </>
      )}
      {pose === 1 && (
        <>
          <circle cx="13" cy="4.7" r="1.8" fill="currentColor" />
          <path d="M12.2 6.5c-0.5 1.5-1 3-1.4 4.7" />
          <path d="M10.8 11.2l2.2 3.8 0.2 4 1.6 0" />
          <path d="M10.8 11.2l-2.8 0.8-0.2 3.5-1.3 1" />
          <path d="M11.8 7.2l2 2.6 1.4 2" />
          <path d="M11.8 7.2l-2.8 1.6-1.5 1.2" />
        </>
      )}
      {pose === 2 && (
        <>
          <circle cx="13.2" cy="4.4" r="1.8" fill="currentColor" />
          <path d="M12.4 6.2c-0.5 1.5-1 3-1.4 4.8" />
          <path d="M11 11l0.8 4 0.7 4 1.7 0" />
          <path d="M11 11l-1.8 2.8 0.8 3.2-1.2 0.2" />
          <path d="M12 6.9l0.8 2.6 1 2" />
          <path d="M12 6.9l-2.2 1.6-1.6 1.3" />
        </>
      )}
      {pose === 3 && (
        <>
          <circle cx="13.8" cy="3.8" r="1.8" fill="currentColor" />
          <path d="M13 5.6c-0.5 1.5-1 3-1.5 4.9" />
          <path d="M11.5 10.5l0 4.5-0.5 3.5-0.5 1" />
          <path d="M11.5 10.5l2.7 1.5-0.4 4 1.4 0.5" />
          <path d="M12.5 6.3l-1 2.2-1.5 2" />
          <path d="M12.5 6.3l2 1.5 1.5 1.4" />
        </>
      )}
      {pose === 4 && (
        <>
          <circle cx="13.5" cy="4.2" r="1.8" fill="currentColor" />
          <path d="M12.5 6c-0.5 1.5-1 3-1.5 5" />
          <path d="M11 11l-2.5 2-2 4-1-0.5" />
          <path d="M11 11l3.5 3 1.5 4.5 1.5-0.3" />
          <path d="M12 6.8l-2.5 1.7-1.5 1.5" />
          <path d="M12 6.8l2.5 2.2 2 2" />
        </>
      )}
      {pose === 5 && (
        <>
          <circle cx="13" cy="4.7" r="1.8" fill="currentColor" />
          <path d="M12.2 6.5c-0.5 1.5-1 3-1.4 4.7" />
          <path d="M10.8 11.2l-2.8 0.8-0.2 3.5-1.3 1" />
          <path d="M10.8 11.2l2.2 3.8 0.2 4 1.6 0" />
          <path d="M11.8 7.2l-2.8 1.6-1.5 1.2" />
          <path d="M11.8 7.2l2 2.6 1.4 2" />
        </>
      )}
      {pose === 6 && (
        <>
          <circle cx="13.2" cy="4.4" r="1.8" fill="currentColor" />
          <path d="M12.4 6.2c-0.5 1.5-1 3-1.4 4.8" />
          <path d="M11 11l-1.8 2.8 0.8 3.2-1.2 0.2" />
          <path d="M11 11l0.8 4 0.7 4 1.7 0" />
          <path d="M12 6.9l-2.2 1.6-1.6 1.3" />
          <path d="M12 6.9l0.8 2.6 1 2" />
        </>
      )}
      {pose === 7 && (
        <>
          <circle cx="13.8" cy="3.8" r="1.8" fill="currentColor" />
          <path d="M13 5.6c-0.5 1.5-1 3-1.5 4.9" />
          <path d="M11.5 10.5l2.7 1.5-0.4 4 1.4 0.5" />
          <path d="M11.5 10.5l0 4.5-0.5 3.5-0.5 1" />
          <path d="M12.5 6.3l2 1.5 1.5 1.4" />
          <path d="M12.5 6.3l-1 2.2-1.5 2" />
        </>
      )}
    </svg>
  );
};

const AuthLayout = ({ children, isLoading, toast, heroTitle, heroSubtitle, pageTitle, pageSubtitle }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans overflow-hidden">
      
      {/* Left Column: Premium Immersive Sports Hero Section */}
      <div 
        className="hidden md:flex md:w-1/2 lg:w-3/5 bg-cover bg-center relative items-center justify-center p-12 overflow-hidden"
        style={{ 
          backgroundImage: "linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.6) 100%), url('https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop&v=3')" 
        }}
      >
        {/* Dynamic abstract glowing highlights in background */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/20 blur-[150px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/15 blur-[130px] opacity-30"></div>

        {/* Motivational Content */}
        <div className="relative z-10 max-w-lg text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-widest uppercase">
            <Activity size={14} className="text-accent animate-pulse" />
            SportSphere Athletic Portal
          </div>
          <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight uppercase">
            {heroTitle || <>TRAIN LIKE A <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">CHAMPION.</span></>}
          </h2>
          <p className="text-slate-300 text-lg font-medium leading-relaxed">
            {heroSubtitle || "Create your profile today and gain access to elite sports metrics, scheduling tools, and team analytics."}
          </p>
        </div>
      </div>

      {/* Right Column: Sleek Form Container with Premium Dark Background */}
      <div className="w-full md:w-1/2 lg:w-2/5 bg-slate-950 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-between p-8 sm:p-12 md:p-16 min-h-screen overflow-y-auto border-l border-slate-900 relative">
        {/* Subtle ambient glows for premium depth inside the form panel */}
        <div className="absolute top-[20%] right-[-10%] w-[250px] h-[250px] rounded-full bg-secondary/10 blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[250px] h-[250px] rounded-full bg-accent/5 blur-[100px] pointer-events-none z-0"></div>
        
        {/* Top Header Placeholder (Logo/Title on Mobile) */}
        <div className="flex items-center justify-between md:justify-end mb-6 relative z-10">
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <UserPlus size={20} className="text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">SportSphere</span>
          </div>
          <span className="text-xs text-slate-500 font-bold">SPORTSPHERE v2.0</span>
        </div>

        {/* Main Form Body */}
        <div className="w-full max-w-sm mx-auto my-auto space-y-6 animate-fade-in-up relative z-10">
          <div>
            <h3 className="text-3xl font-black text-white tracking-tight">{pageTitle}</h3>
            <p className="text-slate-400 text-sm mt-2 font-medium">{pageSubtitle}</p>
          </div>

          {/* Form wrapper */}
          <div className="relative">
            {children}

            {/* Custom Sprinter Loader & Button wrapper */}
            {isLoading && (
              <div className="sprinter-container mt-4">
                <div className="sprinter-track"></div>
                <div className="sprinter-track-progress"></div>
                <div className="sprinter-icon">
                  <RunningAthlete />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-slate-500 font-medium mt-8 border-t border-slate-800/80 pt-4 relative z-10">
          © {new Date().getFullYear()} SportSphere Inc. All Rights Reserved.
        </div>
      </div>

      {/* Premium Dynamic Custom Toast Notification */}
      {toast?.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-4 bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl animate-fade-in-up max-w-sm border border-slate-800 border-l-4 ${toast.isError ? 'border-red-500' : 'border-emerald-500'}`}>
          <div className={`flex items-center justify-center rounded-full p-2.5 ${toast.isError ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
            {toast.isError ? (
              <ShieldAlert size={20} className="animate-bounce" />
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            )}
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 tracking-wide">{toast.title}</h4>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthLayout;
