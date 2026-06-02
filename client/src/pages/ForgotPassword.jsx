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
    setTimeout(() => setToast({ show: false, title: '', message: '', isError: false }), 4500);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const identifier = e.target.identifier?.value;
    if (!identifier) {
      triggerToast('Validation', 'Please enter your registered email or phone number.', true);
      return;
    }
    setIsLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
      // Fix #1 + #16: Use VITE_API_URL and do NOT read OTP from response (security fix).
      // The OTP is printed to the server console in development mode.
      await axios.post(`${API_URL}/auth/forgot-password`, { identifier });
      triggerToast('OTP Generated!', 'Check the server console (development) or your registered email (production) for the OTP.');
      setTimeout(() => {
        setIsLoading(false);
        setStep(2);
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      const errMsg = error.response?.data?.message || 'User not found or connection error.';
      triggerToast('Verification Failed', errMsg, true);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const otp = e.target.otp?.value;
    const newPassword = e.target.newPassword?.value;
    if (!otp || !newPassword) {
      triggerToast('Validation', 'Please enter the OTP and new password.', true);
      return;
    }
    if (otp.length !== 6) {
      triggerToast('Validation', 'OTP must be exactly 6 digits.', true);
      return;
    }
    setIsLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
      await axios.post(`${API_URL}/auth/reset-password`, { otp, newPassword });
      triggerToast('Password Updated!', 'Redirecting you to login...');
      setTimeout(() => {
        setIsLoading(false);
        // Fix #17: Redirect to /admin/login (explicit) not /login (which redirects anyway)
        navigate('/admin/login');
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      const errMsg = error.response?.data?.message || 'Incorrect or expired OTP.';
      triggerToast('Reset Failed', errMsg, true);
    }
  };

  return (
    <AuthLayout
      isLoading={isLoading}
      toast={toast}
      pageTitle="Reset Password"
      pageSubtitle={step === 1 ? 'Enter your registered contact to receive an OTP' : 'Enter the OTP and choose a new password'}
    >
      <form className="auth-form" onSubmit={step === 1 ? handleVerify : handleReset}>

        {/* Step indicator */}
        <div className="auth-steps">
          <div className={`auth-step ${step >= 1 ? 'auth-step-active' : ''}`}>1</div>
          <div className="auth-step-line" />
          <div className={`auth-step ${step >= 2 ? 'auth-step-active' : ''}`}>2</div>
        </div>

        {step === 1 ? (
          <div className="auth-field">
            <label className="auth-label">Email or Mobile Number</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon"><Mail size={16} /></span>
              <input
                type="text"
                name="identifier"
                className="auth-input"
                placeholder="Enter email or phone number"
                disabled={isLoading}
              />
            </div>
            <p className="auth-hint">A 6-digit OTP will be sent to your registered contact.</p>
          </div>
        ) : (
          <>
            <div className="auth-field">
              <label className="auth-label">6-Digit OTP</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><KeyRound size={16} /></span>
                <input
                  type="text"
                  name="otp"
                  className="auth-input auth-otp-input"
                  placeholder="000000"
                  maxLength={6}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="auth-field">
              <label className="auth-label">New Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon"><Lock size={16} /></span>
                <input
                  type="password"
                  name="newPassword"
                  className="auth-input"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`auth-btn ${isLoading ? 'auth-btn-loading' : ''}`}
        >
          {isLoading
            ? (step === 1 ? 'Sending OTP...' : 'Resetting...')
            : (step === 1 ? 'Send OTP' : 'Reset Password')}
        </button>

        <p className="auth-redirect">
          <Link to="/login" className="auth-link auth-link-back">
            <ArrowLeft size={13} />
            Back to Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
