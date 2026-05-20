import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, Mail, Lock, Activity } from 'lucide-react';
import axios from 'axios';

const RunningAthlete = () => {
  const [pose, setPose] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPose((p) => (p + 1) % 8);
    }, 75);
    return () => clearInterval(timer);
  }, []);

  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', title: '', isError: false });

  const triggerToast = (title, message, isError = false) => {
    setToast({ show: true, title, message, isError });
    setTimeout(() => {
      setToast({ show: false, title: '', message: '', isError: false });
    }, 4500);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const identifier = e.target.identifier?.value;
    if (!identifier) {
      triggerToast("Validation Alert", "Please enter your registered email or phone number.", true);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        identifier
      });

      const generatedOtp = response.data.otp;

      triggerToast("OTP Code Sent!", `Your recovery OTP is: ${generatedOtp}. Use it in the next step.`, false);
      setTimeout(() => {
        setIsLoading(false);
        setStep(2);
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      const errMsg = error.response?.data?.message || "User not found or connection error.";
      triggerToast("Verification Failed", errMsg, true);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const otp = e.target.otp?.value;
    const newPassword = e.target.newPassword?.value;

    if (!otp || !newPassword) {
      triggerToast("Validation Alert", "Please enter both the OTP and the new password.", true);
      return;
    }

    if (otp.length !== 6) {
      triggerToast("Validation Alert", "Invalid OTP. Must be 6 digits.", true);
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', {
        otp,
        newPassword
      });

      triggerToast("Success!", "Successfully updated password! Returning to login...");
      setTimeout(() => {
        setIsLoading(false);
        navigate('/login');
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      const errMsg = error.response?.data?.message || "Incorrect or expired OTP verification code.";
      triggerToast("Password Reset Failed", errMsg, true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main font-sans relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[120px] pointer-events-none animate-pulse-soft"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-accent/8 blur-[100px] pointer-events-none animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[50%] left-[50%] w-[300px] h-[300px] rounded-full bg-secondary/5 blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-pulse-soft" style={{ animationDelay: '1s' }}></div>

      {/* Main Card */}
      <div className="w-full max-w-md mx-4 animate-fade-in-up relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-blue-500/20 mb-4">
              S
            </div>
            <span className="font-bold text-xl tracking-wide uppercase text-primary">Sport<span className="text-accent">Sphere</span></span>
            <p className="text-text-light text-xs mt-1 font-medium">Sports Performance Dashboard</p>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-primary tracking-tight">Reset Password</h3>
            <p className="text-text-light text-sm mt-1">
              {step === 1 ? 'Step 1: Request OTP Verification' : 'Step 2: Enter OTP & Reset Password'}
            </p>
          </div>

          {/* Form Content */}
          <form className="space-y-5" onSubmit={step === 1 ? handleVerify : handleReset}>
            {step === 1 ? (
              <div>
                <label className="block text-xs font-semibold text-text-dark uppercase tracking-wider mb-2">
                  Registered Email or Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-text-light">
                    <Mail size={18} />
                  </span>
                  <input 
                    type="text" 
                    name="identifier"
                    className="w-full pl-12 pr-4 py-3 rounded-xl sports-input text-sm"
                    placeholder="Enter email or phone number"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-[10px] text-text-light mt-2 font-semibold leading-relaxed">
                  * A 6-digit OTP verification code will be sent to your registered contact details.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-text-dark uppercase tracking-wider mb-2">
                    Enter 6-Digit OTP
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-text-light">
                      <KeyRound size={18} />
                    </span>
                    <input 
                      type="text" 
                      name="otp"
                      className="w-full pl-12 pr-4 py-3 rounded-xl sports-input text-center tracking-widest text-lg font-bold text-text-dark"
                      placeholder="000000"
                      maxLength={6}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-dark uppercase tracking-wider mb-2">
                    Enter New Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-text-light">
                      <Lock size={18} />
                    </span>
                    <input 
                      type="password" 
                      name="newPassword"
                      className="w-full pl-12 pr-4 py-3 rounded-xl sports-input text-sm"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </>
            )}

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
                className={`w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  isLoading 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none hover:scale-100' 
                    : 'bg-gradient-to-r from-secondary to-accent hover:from-blue-600 hover:to-orange-500 shadow-blue-500/25'
                }`}
              >
                {isLoading ? (step === 1 ? 'Generating OTP...' : 'Resetting Password...') : (step === 1 ? 'Generate OTP' : 'Verify & Reset Password')}
              </button>
            </div>
          </form>

          {/* Card Footer */}
          <div className="text-center text-xs mt-6 pt-4 border-t border-gray-100">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-secondary hover:text-blue-700 font-bold transition-colors">
              <ArrowLeft size={14} />
              Return to Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-text-light font-medium mt-6">
          © 2026 SportSphere. All Rights Reserved.
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-4 bg-white text-text-dark px-5 py-4 rounded-xl shadow-2xl animate-fade-in-up max-w-sm border border-gray-100 border-l-4 ${toast.isError ? 'border-l-danger' : 'border-l-gov-green'}`}>
          <div className={`flex items-center justify-center rounded-full p-2.5 ${toast.isError ? 'bg-danger/10 text-danger' : 'bg-gov-green/10 text-gov-green'}`}>
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

export default ForgotPassword;
