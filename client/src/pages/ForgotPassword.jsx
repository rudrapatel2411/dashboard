import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, Mail, Lock } from 'lucide-react';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';

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
    <AuthLayout
      isLoading={isLoading}
      toast={toast}
      heroTitle={<>RECOVERY IS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">CRITICAL.</span></>}
      heroSubtitle="Re-secure your profile settings to quickly return to tracking your fitness achievements and health goals."
      pageTitle="Reset Password"
      pageSubtitle={step === 1 ? 'Step 1: Request OTP Verification' : 'Step 2: Enter OTP & Reset Password'}
    >
      <form className="space-y-5" onSubmit={step === 1 ? handleVerify : handleReset}>
        {step === 1 ? (
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Registered Email or Mobile Number
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
            <p className="text-[10px] text-slate-400 mt-2 font-semibold leading-relaxed">
              * A 6-digit OTP verification code will be sent to your registered contact details.
            </p>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Enter 6-Digit OTP
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-500">
                  <KeyRound size={18} />
                </span>
                <input 
                  type="text" 
                  name="otp"
                  className="w-full pl-12 pr-4 py-3 rounded-xl sports-input-dark text-center tracking-widest text-lg font-bold text-white"
                  placeholder="000000"
                  maxLength={6}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Enter New Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-500">
                  <Lock size={18} />
                </span>
                <input 
                  type="password" 
                  name="newPassword"
                  className="w-full pl-12 pr-4 py-3 rounded-xl sports-input-dark text-sm"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>
          </>
        )}

        <div className="relative pt-4">
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2 ${
              isLoading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none hover:scale-100' 
                : 'bg-gradient-to-r from-secondary to-accent hover:from-blue-600 hover:to-orange-500 shadow-blue-500/25'
            }`}
          >
            {isLoading ? (step === 1 ? 'Generating OTP...' : 'Resetting Password...') : (step === 1 ? 'Generate OTP' : 'Verify & Reset Password')}
          </button>
        </div>
      </form>

      <div className="text-center text-xs mt-6 pt-4 border-t border-slate-800/80">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-secondary hover:text-blue-400 font-bold transition-colors">
          <ArrowLeft size={14} />
          Return to Login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
