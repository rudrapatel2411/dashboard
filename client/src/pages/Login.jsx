import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Activity } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const identifier = e.target.identifier?.value;
    const password = e.target.password?.value;
    if (!identifier || !password) {
      alert("Please enter both email/number and password to login.");
      return;
    }
    // Handle login here
  };

  return (
    <div className="min-h-screen flex items-center justify-center sports-bg-overlay relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary blur-[120px] opacity-30 animate-pulse-soft"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent blur-[120px] opacity-20 animate-pulse-soft" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md p-8 glass-panel rounded-2xl shadow-2xl relative z-10 border border-white/20 animate-slide-up">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Activity size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-gray-300 mt-2">Sign in to manage sports performance</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Email or Phone Number</label>
            <input 
              type="text" 
              name="identifier"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary transition-all bg-white/50 backdrop-blur-sm"
              placeholder="Email or Phone Number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary transition-all bg-white/50 backdrop-blur-sm"
                placeholder="••••••••"
              />
              <button 
                type="button"
                className="absolute right-4 top-3.5 text-gray-600 hover:text-gray-900"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded text-secondary focus:ring-secondary" />
              <span className="text-sm text-gray-200">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-secondary hover:text-accent font-medium transition-colors">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-secondary to-accent text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            Sign In
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-300">
          Don't have an account? <Link to="/register" className="text-secondary font-bold hover:text-accent">Register Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
