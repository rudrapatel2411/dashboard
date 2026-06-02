import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Building2 } from 'lucide-react';
import axios from 'axios';
import AuthLayout from '../../components/AuthLayout';

const InstituteLogin = () => {
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
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const data = response.data;

      // Verify this is an institution account
      if (data.role !== 'institution') {
        setIsLoading(false);
        triggerToast('Access Denied', 'This portal is for institutes only. Please use the Admin login.', true);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        name: data.name,
        role: data.role,
        email: data.email,
        instituteId: data.instituteId,
        instituteName: data.instituteName,
        instituteType: data.instituteType,
        sport: data.sport
      }));
      
      const isAcademy = data.instituteType === 'academy';
      triggerToast('Success!', isAcademy ? 'Welcome! Opening Academy Dashboard...' : 'Welcome! Opening Institute Dashboard...');
      setTimeout(() => {
        setIsLoading(false);
        window.location.href = isAcademy ? '/academy/dashboard' : '/institute/dashboard';
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
      pageTitle="Institute Portal"
      pageSubtitle="Sign in to manage your students and performance data"
    >

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
              placeholder="institute@example.com"
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

        {/* Remember + Forgot */}
        <div className="auth-row">
          <label className="auth-check-label">
            <input type="checkbox" className="auth-check" disabled={isLoading} />
            <span>Remember me</span>
          </label>
          <Link to="/institute/forgot-password" className="auth-link">Forgot password?</Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={`auth-btn ${isLoading ? 'auth-btn-loading' : ''}`}
        >
          {isLoading ? 'Verifying...' : 'Sign In'}
        </button>

        {/* Register redirect */}
        <p className="auth-redirect">
          New institute?&nbsp;
          <Link to="/institute/register" className="auth-link">Register here</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default InstituteLogin;
