import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, User, Mail, Phone, Lock, Activity } from 'lucide-react';
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

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', title: '', isError: false });

  const triggerToast = (title, message, isError = false) => {
    setToast({ show: true, title, message, isError });
    setTimeout(() => {
      setToast({ show: false, title: '', message: '', isError: false });
    }, 4000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const username = e.target.username?.value;
    const email = e.target.email?.value;
    const phone = e.target.phone?.value;
    const password = e.target.password?.value;
    const confirmPassword = e.target.confirmPassword?.value;

    if (!username || !email || !phone || !password || !confirmPassword) {
      triggerToast("Validation Alert", "Please fill in all the fields to create an account.", true);
      return;
    }

    if (password !== confirmPassword) {
      triggerToast("Validation Alert", "Passwords do not match.", true);
      return;
    }

    setIsLoading(true);
    try {
      // Post actual values to the Express/Mongoose backend
      await axios.post('http://localhost:5000/api/auth/register', {
        name: username,
        email,
        phone,
        password
      });

      triggerToast("Success!", "Successfully created your account!");
      setTimeout(() => {
        setIsLoading(false);
        navigate('/login');
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      const errMsg = error.response?.data?.message || "Server connection failed. Try again later.";
      triggerToast("Registration Failed", errMsg, true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 font-sans overflow-hidden relative">

      {/* Decorative gradient orbs for premium feel */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-100/40 blur-[150px] pointer-events-none"></div>

      {/* Centered Card Container */}
      <div className="relative z-10 w-full max-w-md mx-4 sm:mx-auto animate-fade-in-up">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

          {/* SportSync Logo & Branding */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3">
              <span className="text-white font-black text-xl">S</span>
            </div>
            <span className="text-xl font-black text-primary tracking-tight">SportSync</span>
            <span className="text-[10px] text-text-light font-bold tracking-widest uppercase mt-1">SPORTSYNC v2.0</span>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold tracking-widest uppercase text-secondary mb-3">
              <Activity size={14} className="text-accent animate-pulse" />
              Athlete Registration
            </div>
            <h3 className="text-3xl font-black text-primary tracking-tight">Get Started</h3>
            <p className="text-text-light text-sm mt-2 font-medium">Create your dedicated athlete profile</p>
          </div>

          {/* Registration Form */}
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-text-light">
                  <User size={18} />
                </span>
                <input 
                  type="text" 
                  name="username"
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl sports-input text-sm"
                  placeholder="JohnDoe123"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-text-light">
                  <Mail size={18} />
                </span>
                <input 
                  type="email" 
                  name="email"
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl sports-input text-sm"
                  placeholder="athlete@sportsync.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-text-light">
                  <Phone size={18} />
                </span>
                <input 
                  type="tel" 
                  name="phone"
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl sports-input text-sm"
                  placeholder="e.g. +919876543210"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-text-light">
                  <Lock size={18} />
                </span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  className="w-full pl-12 pr-12 py-2.5 rounded-xl sports-input text-sm"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  className="absolute right-4 top-3 text-text-light hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-text-light">
                  <Lock size={18} />
                </span>
                <input 
                  type="password" 
                  name="confirmPassword"
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl sports-input text-sm"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
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
                className={`w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2 mt-2 ${
                  isLoading 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none hover:scale-100' 
                    : 'bg-gradient-to-r from-secondary to-accent hover:from-blue-600 hover:to-orange-500 shadow-blue-500/25'
                }`}
              >
                {isLoading ? 'Creating Profile...' : 'Register Account'}
              </button>
            </div>
          </form>

          <p className="text-text-light text-xs font-semibold text-center mt-4">
            Already have an account? <Link to="/login" className="text-secondary hover:text-blue-400 font-bold transition-colors ml-1">Login Here</Link>
          </p>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-text-light font-medium mt-6">
          © 2026 SportSync Inc. All Rights Reserved.
        </div>
      </div>

      {/* Premium Dynamic Custom Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-4 bg-white text-primary px-5 py-4 rounded-xl shadow-2xl animate-fade-in-up max-w-sm border border-gray-100 border-l-4 ${toast.isError ? 'border-l-red-500' : 'border-l-gov-green'}`}>
          <div className={`flex items-center justify-center rounded-full p-2.5 ${toast.isError ? 'bg-red-50 text-red-500' : 'bg-green-50 text-gov-green'}`}>
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
            <h4 className="font-bold text-sm text-primary tracking-wide">{toast.title}</h4>
            <p className="text-xs text-text-light font-semibold mt-0.5">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
