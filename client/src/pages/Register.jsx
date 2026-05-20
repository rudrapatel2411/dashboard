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
    <AuthLayout
      isLoading={isLoading}
      toast={toast}
      heroTitle={<>TRAIN LIKE A <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">CHAMPION.</span></>}
      heroSubtitle="Create your account today and gain access to elite sports metrics, scheduling tools, and team analytics."
      pageTitle="Get Started"
      pageSubtitle="Create your dedicated athlete profile"
    >
      <form className="space-y-4" onSubmit={handleRegister}>
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Username
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-slate-500">
              <User size={18} />
            </span>
            <input 
              type="text" 
              name="username"
              className="w-full pl-12 pr-4 py-2.5 rounded-xl sports-input-dark text-sm"
              placeholder="JohnDoe123"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-slate-500">
              <Mail size={18} />
            </span>
            <input 
              type="email" 
              name="email"
              className="w-full pl-12 pr-4 py-2.5 rounded-xl sports-input-dark text-sm"
              placeholder="athlete@sportsphere.com"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Phone Number
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-slate-500">
              <Phone size={18} />
            </span>
            <input 
              type="tel" 
              name="phone"
              className="w-full pl-12 pr-4 py-2.5 rounded-xl sports-input-dark text-sm"
              placeholder="e.g. +919876543210"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-slate-500">
              <Lock size={18} />
            </span>
            <input 
              type={showPassword ? "text" : "password"} 
              name="password"
              className="w-full pl-12 pr-12 py-2.5 rounded-xl sports-input-dark text-sm"
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button 
              type="button"
              className="absolute right-4 top-3 text-slate-500 hover:text-slate-300 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-slate-500">
              <Lock size={18} />
            </span>
            <input 
              type="password" 
              name="confirmPassword"
              className="w-full pl-12 pr-4 py-2.5 rounded-xl sports-input-dark text-sm"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="relative pt-4">
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2 mt-2 ${
              isLoading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none hover:scale-100' 
                : 'bg-gradient-to-r from-secondary to-accent hover:from-blue-600 hover:to-orange-500 shadow-blue-500/25'
            }`}
          >
            {isLoading ? 'Creating Profile...' : 'Register Account'}
          </button>
        </div>
      </form>

      <p className="text-slate-400 text-xs font-semibold text-center mt-4">
        Already have an account? <Link to="/login" className="text-secondary hover:text-blue-400 font-bold transition-colors ml-1">Login Here</Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
