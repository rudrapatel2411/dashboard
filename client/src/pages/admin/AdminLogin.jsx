import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import AuthLayout from '../../components/AuthLayout';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', title: '', isError: false });

  const triggerToast = (title, message, isError = false) => {
    setToast({ show: true, title, message, isError });
    setTimeout(() => setToast({ show: false, title: '', message: '', isError: false }), 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email?.value;
    const password = e.target.password?.value;
    if (!email || !password) {
      triggerToast('Validation', 'Please enter both email and password.', true);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      const data = response.data;

      // Verify this is an admin account
      if (data.role !== 'admin') {
        setIsLoading(false);
        triggerToast('Access Denied', 'This login is for administrators only. Please use the Institute login portal.', true);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        name: data.name,
        role: data.role,
        email: data.email
      }));
      triggerToast('Success!', 'Welcome back, Admin! Opening Dashboard...');
      setTimeout(() => {
        setIsLoading(false);
        window.location.href = '/dashboard';
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      const errMsg = error.response?.data?.message || 'Invalid credentials or server offline.';
      triggerToast('Login Failed', errMsg, true);
    }
  };

  return (
    <AuthLayout
      isLoading={isLoading}
      toast={toast}
      pageTitle="Admin Portal"
      pageSubtitle="Sign in with your administrator credentials"
    >
      {/* Admin badge */}
      <div className="flex items-center justify-center mb-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white tracking-wider uppercase">
          <ShieldCheck size={12} />
          Administrator Access
        </span>
      </div>

      <form className="auth-form" onSubmit={handleLogin}>
        {/* Email */}
        <div className="auth-field">
          <label className="auth-label">Email Address</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon"><Mail size={16} /></span>
            <input
              type="email"
              name="email"
              className="auth-input"
              placeholder="admin@sportsphere.com"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password */}
        <div className="auth-field">
          <label className="auth-label">Password</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon"><Lock size={16} /></span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="auth-input auth-input-pr"
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              className="auth-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Forgot */}
        <div className="auth-row">
          <label className="auth-check-label">
            <input type="checkbox" className="auth-check" disabled={isLoading} />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={`auth-btn ${isLoading ? 'auth-btn-loading' : ''}`}
        >
          {isLoading ? 'Verifying...' : 'Sign In as Admin'}
        </button>

      </form>
    </AuthLayout>
  );
};

export default AdminLogin;
