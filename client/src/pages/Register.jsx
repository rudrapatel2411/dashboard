import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Trophy } from 'lucide-react';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    const username = e.target.username?.value;
    const email = e.target.email?.value;
    const phone = e.target.phone?.value;
    const password = e.target.password?.value;
    const confirmPassword = e.target.confirmPassword?.value;

    if (!username || !email || !phone || !password || !confirmPassword) {
      alert("Please fill in all the details to create an account.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Proceed with registration
  };

  return (
    <div className="min-h-screen flex items-center justify-center sports-bg-overlay relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent blur-[120px] opacity-30 animate-pulse-soft"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary blur-[120px] opacity-20 animate-pulse-soft" style={{ animationDelay: '1.5s' }}></div>

      <div className="w-full max-w-md p-8 glass-panel rounded-2xl shadow-2xl relative z-10 border border-white/20 my-8 animate-slide-up">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Trophy size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-gray-300 mt-2">Join SportSync Management</p>
        </div>

        <form className="space-y-5" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Username</label>
            <input 
              type="text" 
              name="username"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary transition-all bg-white/50"
              placeholder="johndoe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
            <input 
              type="email" 
              name="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary transition-all bg-white/50"
              placeholder="admin@sportsync.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary transition-all bg-white/50"
              placeholder="+1 234 567 8900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary transition-all bg-white/50"
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
          
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary transition-all bg-white/50"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent to-secondary text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 mt-4">
            Register
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-300">
          Already have an account? <Link to="/login" className="text-secondary font-bold hover:text-accent">Login Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
