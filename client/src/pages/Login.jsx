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
    setTimeout(() => {
      setToast({ show: false, title: '', message: '', isError: false });
    }, 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const identifier = e.target.identifier?.value;
    const password = e.target.password?.value;
    if (!identifier || !password) {
      triggerToast("Validation Alert", "Please enter both email/number and password to login.", true);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: identifier, // Handled as email or phone by the backend
        password
      });

      const { token, id, name, role, email } = response.data;
      
      // Save credentials in localStorage for route protection
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id, name, role, email }));

      triggerToast("Success!", "Login successful! Opening Dashboard...");
      setTimeout(() => {
        setIsLoading(false);
        // Force refresh so that react router reads the new authentication state instantly
        window.location.href = '/dashboard';
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      const errMsg = error.response?.data?.message || "Invalid credentials or server offline.";
      triggerToast("Login Failed", errMsg, true);
    }
  };

  return (
    <AuthLayout
      isLoading={isLoading}
      toast={toast}
      heroTitle={<>LIMITS ARE JUST <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">AN ILLUSION.</span></>}
      heroSubtitle="Track your progress, analyze performance, and conquer your athletic potential with SportSphere."
      pageTitle="Welcome Back"
      pageSubtitle="Please sign in to your athlete profile"
    >
      <form className="space-y-5" onSubmit={handleLogin}>
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Email or Mobile Number
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
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Password
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-slate-500">
              <Lock size={18} />
            </span>
            <input 
              type={showPassword ? "text" : "password"} 
              name="password"
              className="w-full pl-12 pr-12 py-3 rounded-xl sports-input-dark text-sm"
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button 
              type="button"
              className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-400">
            <input type="checkbox" className="w-4 h-4 rounded text-secondary focus:ring-secondary border-slate-700 bg-slate-900" disabled={isLoading} />
            <span>Remember session</span>
          </label>
          <Link to="/forgot-password" className="text-secondary hover:text-blue-400 font-bold transition-colors">
            Forgot Password?
          </Link>
        </div>

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
            {isLoading ? 'Verifying Profile...' : 'Sign In'}
          </button>
        </div>
      </form>

      <p className="text-slate-400 text-xs font-semibold text-center mt-4">
        New to SportSphere? <Link to="/register" className="text-accent font-bold hover:underline transition-colors ml-1">Register Here</Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
