import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock, Building2, MapPin, Map } from 'lucide-react';
import axios from 'axios';
import AuthLayout from '../../components/AuthLayout';

const InstituteRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', title: '', isError: false });

  const triggerToast = (title, message, isError = false) => {
    setToast({ show: true, title, message, isError });
    setTimeout(() => setToast({ show: false, title: '', message: '', isError: false }), 4500);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = {
      instituteName: e.target.instituteName?.value,
      name: e.target.contactPerson?.value,
      contactPerson: e.target.contactPerson?.value,
      email: e.target.email?.value,
      phone: e.target.phone?.value,
      mobile: e.target.phone?.value,
      city: e.target.city?.value,
      state: e.target.state?.value,
      address: e.target.address?.value,
      password: e.target.password?.value,
    };
    const confirmPassword = e.target.confirmPassword?.value;

    if (!formData.instituteName || !formData.name || !formData.email || !formData.password || !formData.city || !formData.state) {
      triggerToast('Validation', 'Please fill in all required fields.', true);
      return;
    }
    if (formData.password !== confirmPassword) {
      triggerToast('Validation', 'Passwords do not match.', true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/institute-register', formData);
      triggerToast('Registration Submitted!', response.data.message || 'Your account is pending admin approval.');
      setTimeout(() => {
        setIsLoading(false);
        navigate('/institute/login');
      }, 3000);
    } catch (error) {
      setIsLoading(false);
      const errMsg = error.response?.data?.message || 'Registration failed. Try again later.';
      triggerToast('Registration Failed', errMsg, true);
    }
  };

  return (
    <AuthLayout
      isLoading={isLoading}
      toast={toast}
      pageTitle="Institute Registration"
      pageSubtitle="Register your institute to join SportSphere"
    >
      {/* Institute badge */}
      <div className="flex items-center justify-center mb-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white tracking-wider uppercase">
          <Building2 size={12} />
          New Institute
        </span>
      </div>

      <form className="auth-form" onSubmit={handleRegister}>
        {/* Institute Name */}
        <div className="auth-field">
          <label className="auth-label">Institute Name *</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon"><Building2 size={16} /></span>
            <input type="text" name="instituteName" className="auth-input" placeholder="Delhi Public School" disabled={isLoading} />
          </div>
        </div>

        {/* Contact Person */}
        <div className="auth-field">
          <label className="auth-label">Contact Person Name *</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon"><User size={16} /></span>
            <input type="text" name="contactPerson" className="auth-input" placeholder="Dr. Rajesh Kumar" disabled={isLoading} />
          </div>
        </div>

        {/* Email */}
        <div className="auth-field">
          <label className="auth-label">Email Address *</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon"><Mail size={16} /></span>
            <input type="email" name="email" className="auth-input" placeholder="principal@dps.edu.in" disabled={isLoading} />
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

        {/* City & State in a row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="auth-field">
            <label className="auth-label">City *</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon"><MapPin size={16} /></span>
              <input type="text" name="city" className="auth-input" placeholder="Mumbai" disabled={isLoading} />
            </div>
          </div>
          <div className="auth-field">
            <label className="auth-label">State *</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon"><Map size={16} /></span>
              <input type="text" name="state" className="auth-input" placeholder="Maharashtra" disabled={isLoading} />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="auth-field">
          <label className="auth-label">Address</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon"><MapPin size={16} /></span>
            <input type="text" name="address" className="auth-input" placeholder="Full address (optional)" disabled={isLoading} />
          </div>
        </div>

        {/* Password */}
        <div className="auth-field">
          <label className="auth-label">Password *</label>
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
          <label className="auth-label">Confirm Password *</label>
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
          {isLoading ? 'Submitting...' : 'Register Institute'}
        </button>

        <p className="auth-hint" style={{ textAlign: 'center' }}>
          After registration, your account will be reviewed by an admin. You'll be notified once approved.
        </p>

        {/* Redirect */}
        <p className="auth-redirect">
          Already registered?&nbsp;
          <Link to="/institute/login" className="auth-link">Sign in here</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default InstituteRegister;
