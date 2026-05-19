import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Activity, Lock, Mail } from 'lucide-react';
import axios from 'axios';

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
          {/* Frame 0: Contact (Right foot contact, left arm forward) */}
          <circle cx="13.5" cy="4.2" r="1.8" fill="currentColor" />
          <path d="M12.5 6c-0.5 1.5-1 3-1.5 5" /> {/* Torso */}
          <path d="M11 11l3.5 3 1.5 4.5 1.5-0.3" /> {/* Front leg */}
          <path d="M11 11l-2.5 2-2 4-1-0.5" /> {/* Back leg */}
          <path d="M12 6.8l2.5 2.2 2 2" /> {/* Left arm */}
          <path d="M12 6.8l-2.5 1.7-1.5 1.5" /> {/* Right arm */}
        </>
      )}
      {pose === 1 && (
        <>
          {/* Frame 1: Down / Weight Absorption (Knee bent, body drops slightly) */}
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
          {/* Frame 2: Passing Phase (Supporting leg straightening, knee swinging through) */}
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
          {/* Frame 3: Knee Drive / Max Height (Knee driven high forward, strong arm drive) */}
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
          {/* Frame 4: Alternate Contact (Mirror of Frame 0) */}
          <circle cx="13.5" cy="4.2" r="1.8" fill="currentColor" />
          <path d="M12.5 6c-0.5 1.5-1 3-1.5 5" />
          <path d="M11 11l-2.5 2-2 4-1-0.5" /> {/* Back leg becomes front leg */}
          <path d="M11 11l3.5 3 1.5 4.5 1.5-0.3" /> {/* Front leg becomes back leg */}
          <path d="M12 6.8l-2.5 1.7-1.5 1.5" /> {/* Arm mirror */}
          <path d="M12 6.8l2.5 2.2 2 2" />
        </>
      )}
      {pose === 5 && (
        <>
          {/* Frame 5: Alternate Down (Mirror of Frame 1) */}
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
          {/* Frame 6: Alternate Passing Phase (Mirror of Frame 2) */}
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
          {/* Frame 7: Alternate Knee Drive (Mirror of Frame 3) */}
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

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', title: '', isError: false });

  const triggerToast = (title, message, isError = false) => {
    setToast({ show: true, title, message, isError });
    setTimeout(() => {
      setToast({ show: false, title: '', message: '', isError: false });
    }, 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const identifier = e.target.identifier?.value;
    const password = e.target.password?.value;
    if (!identifier || !password) {
      triggerToast("Validation Alert", "Please enter both email/number and password to login.", true);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: identifier, // Handled as email or phone by the backend
        password
      });

      const { token, id, name, role, email } = response.data;
      
      // Save credentials in localStorage for route protection
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id, name, role, email }));

      triggerToast("Success!", "Login successful! Opening Dashboard...");
      setTimeout(() => {
        setIsLoading(false);
        // Force refresh so that react router reads the new authentication state instantly
        window.location.href = '/dashboard';
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      const errMsg = error.response?.data?.message || "Invalid credentials or server offline.";
      triggerToast("Login Failed", errMsg, true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans overflow-hidden">
      
      {/* Left Column: Premium Immersive Sports Hero Section */}
      <div 
        className="hidden md:flex md:w-1/2 lg:w-3/5 bg-cover bg-center relative items-center justify-center p-12 overflow-hidden"
        style={{ 
          backgroundImage: "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.5) 100%), url('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop')" 
        }}
      >
        {/* Dynamic abstract glowing highlights in background */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/20 blur-[150px] opacity-40 animate-pulse-soft"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/15 blur-[130px] opacity-30 animate-pulse-soft" style={{ animationDelay: '2s' }}></div>

        {/* Motivational Content */}
        <div className="relative z-10 max-w-lg text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-widest uppercase">
            <Activity size={14} className="text-accent animate-pulse" />
            Performance Hub
          </div>
          <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            LIMITS ARE JUST <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">AN ILLUSION.</span>
          </h2>
          <p className="text-slate-300 text-lg font-medium leading-relaxed">
            Track your progress, analyze performance, and conquer your athletic potential with SportSphere.
          </p>
        </div>
      </div>

      {/* Right Column: Sleek Form Container with Premium Dark Background */}
      <div className="w-full md:w-1/2 lg:w-2/5 bg-slate-950 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-between p-8 sm:p-12 md:p-16 min-h-screen overflow-y-auto border-l border-slate-900 relative">
        {/* Subtle ambient glows for premium depth inside the form panel */}
        <div className="absolute top-[20%] right-[-10%] w-[250px] h-[250px] rounded-full bg-secondary/10 blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[250px] h-[250px] rounded-full bg-accent/5 blur-[100px] pointer-events-none z-0" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Top Header Placeholder (Logo/Title on Mobile) */}
        <div className="flex items-center justify-between md:justify-end mb-8 relative z-10">
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity size={20} className="text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">SportSphere</span>
          </div>
          <span className="text-xs text-slate-500 font-bold">SPORTSPHERE v2.0</span>
        </div>

        {/* Main Form Body */}
        <div className="w-full max-w-sm mx-auto my-auto space-y-8 animate-fade-in-up relative z-10">
          <div>
            <h3 className="text-3xl font-black text-white tracking-tight">Welcome Back</h3>
            <p className="text-slate-400 text-sm mt-2 font-medium">Please sign in to your athlete profile</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Email or Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-500">
                  <Mail size={18} />
                </span>
                <input 
                  type="text" 
                  name="identifier"
                  className="w-full pl-12 pr-4 py-3 rounded-xl sports-input-dark text-sm"
                  placeholder="Enter email or phone number"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-500">
                  <Lock size={18} />
                </span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  className="w-full pl-12 pr-12 py-3 rounded-xl sports-input-dark text-sm"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-400">
                <input type="checkbox" className="w-4 h-4 rounded text-secondary focus:ring-secondary border-slate-700 bg-slate-900" disabled={isLoading} />
                <span>Remember session</span>
              </label>
              <Link to="/forgot-password" className="text-secondary hover:text-blue-400 font-bold transition-colors">
                Forgot Password?
              </Link>
            </div>

            {/* Custom Sprinter Loader & Button wrapper */}
            <div className="relative pt-4">
              {isLoading && (
                <div className="sprinter-container">
                  <div className="sprinter-track"></div>
                  <div className="sprinter-track-progress"></div>
                  <div className="sprinter-icon">
                    <RunningAthlete />
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2 ${
                  isLoading 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none hover:scale-100' 
                    : 'bg-gradient-to-r from-secondary to-accent hover:from-blue-600 hover:to-orange-500 shadow-blue-500/25'
                }`}
              >
                {isLoading ? 'Verifying Profile...' : 'Sign In'}
              </button>
            </div>
          </form>

          <p className="text-slate-400 text-xs font-semibold text-center mt-4">
            New to SportSphere? <Link to="/register" className="text-accent font-bold hover:underline transition-colors ml-1">Register Here</Link>
          </p>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-slate-500 font-medium mt-8 border-t border-slate-800/80 pt-4 relative z-10">
          © 2026 SportSphere Inc. All Rights Reserved.
        </div>
      </div>

      {/* Premium Dynamic Custom Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-4 bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl animate-fade-in-up max-w-sm border border-slate-800 border-l-4 ${toast.isError ? 'border-red-500' : 'border-gov-green'}`}>
          <div className={`flex items-center justify-center rounded-full p-2.5 ${toast.isError ? 'bg-red-500/10 text-red-500' : 'bg-gov-green/10 text-gov-green'}`}>
            {toast.isError ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
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

export default Login;
