import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', title: '', isError: false });

  const triggerToast = (title, message, isError = false) => {
    setToast({ show: true, title, message, isError });
    setTimeout(() => setToast({ show: false, title: '', message: '', isError: false }), 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const identifier = e.target.identifier?.value;
    const password = e.target.password?.value;
    if (!identifier || !password) {
      triggerToast('Validation', 'Please enter both email/number and password.', true);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: identifier,
        password,
      });
      const { token, id, name, role, email } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id, name, role, email }));
      triggerToast('Success!', 'Login successful! Opening Dashboard...');
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
      pageTitle="Welcome Back"
      pageSubtitle="Sign in to your SportSphere account"
    >
      <form className="auth-form" onSubmit={handleLogin}>
        {/* Email / Phone */}
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
          <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={`auth-btn ${isLoading ? 'auth-btn-loading' : ''}`}
        >
          {isLoading ? 'Verifying...' : 'Sign In'}
        </button>

        {/* Redirect */}
        <p className="auth-redirect">
          New to SportSphere?&nbsp;
          <Link to="/register" className="auth-link">Create an account</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
