import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', title: '', isError: false });

  const triggerToast = (title, message, isError = false) => {
    setToast({ show: true, title, message, isError });
    setTimeout(() => setToast({ show: false, title: '', message: '', isError: false }), 4000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const username = e.target.username?.value;
    const email = e.target.email?.value;
    const phone = e.target.phone?.value;
    const password = e.target.password?.value;
    const confirmPassword = e.target.confirmPassword?.value;

    if (!username || !email || !phone || !password || !confirmPassword) {
      triggerToast('Validation', 'Please fill in all fields to register.', true);
      return;
    }
    if (password !== confirmPassword) {
      triggerToast('Validation', 'Passwords do not match.', true);
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name: username,
        email,
        phone,
        password,
      });
      triggerToast('Account Created!', 'Redirecting you to login...');
      setTimeout(() => {
        setIsLoading(false);
        navigate('/login');
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      const errMsg = error.response?.data?.message || 'Server connection failed. Try again later.';
      triggerToast('Registration Failed', errMsg, true);
    }
  };

  return (
    <AuthLayout
      isLoading={isLoading}
      toast={toast}
      pageTitle="Create Account"
      pageSubtitle="Join SportSphere and start tracking your performance"
    >
      <form className="auth-form" onSubmit={handleRegister}>
        {/* Username */}
        <div className="auth-field">
          <label className="auth-label">Username</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon"><User size={16} /></span>
            <input type="text" name="username" className="auth-input" placeholder="JohnDoe123" disabled={isLoading} />
          </div>
        </div>

        {/* Email */}
        <div className="auth-field">
          <label className="auth-label">Email Address</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon"><Mail size={16} /></span>
            <input type="email" name="email" className="auth-input" placeholder="athlete@sportsphere.com" disabled={isLoading} />
          </div>
        </div>

        {/* Phone */}
        <div className="auth-field">
          <label className="auth-label">Phone Number</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon"><Phone size={16} /></span>
            <input type="tel" name="phone" className="auth-input" placeholder="+91 98765 43210" disabled={isLoading} />
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

        {/* Confirm Password */}
        <div className="auth-field">
          <label className="auth-label">Confirm Password</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon"><Lock size={16} /></span>
            <input type="password" name="confirmPassword" className="auth-input" placeholder="••••••••" disabled={isLoading} />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={`auth-btn ${isLoading ? 'auth-btn-loading' : ''}`}
        >
          {isLoading ? 'Creating Account...' : 'Register'}
        </button>

        {/* Redirect */}
        <p className="auth-redirect">
          Already have an account?&nbsp;
          <Link to="/login" className="auth-link">Sign in here</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
