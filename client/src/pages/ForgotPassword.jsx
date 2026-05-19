import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen flex items-center justify-center sports-bg-overlay relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-secondary blur-[150px] opacity-20 animate-pulse-soft"></div>

      <div className="w-full max-w-md p-8 glass-panel rounded-2xl shadow-2xl relative z-10 border border-white/20 animate-slide-up">
        <Link to="/login" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to login
        </Link>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-warning to-accent rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <KeyRound size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Reset Password</h2>
          <p className="text-gray-300 mt-2 text-center">
            {step === 1 ? "Enter your email or phone number to receive an OTP" : "Enter OTP and new password"}
          </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => { 
          e.preventDefault(); 
          if (step === 1) {
            const identifier = e.target.identifier?.value;
            if (!identifier) {
              alert("Please enter your email or phone number.");
              return;
            }
            setStep(2); 
          } else {
            const otp = e.target.otp?.value;
            const newPassword = e.target.newPassword?.value;
            if (!otp || !newPassword) {
              alert("Please fill in all the details.");
              return;
            }
            // Proceed with password reset
          }
        }}>
          {step === 1 ? (
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Email or Phone Number</label>
              <input 
                type="text" 
                name="identifier"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary transition-all bg-white/50"
                placeholder="Email or Phone Number"
                required
              />
            </div>

          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Enter OTP</label>
                <input 
                  type="text" 
                  name="otp"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-secondary text-center tracking-widest text-lg font-bold bg-white/50"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">New Password</label>
                <input 
                  type="password" 
                  name="newPassword"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-secondary bg-white/50"
                  placeholder="••••••••"
                />
              </div>
            </>

          )}

          <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-secondary to-primary text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            {step === 1 ? "Send OTP" : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
