import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, ClipboardList, TrendingUp, Plus, FileText } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const InstituteDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [stats, setStats] = useState({ totalStudents: 0, totalClasses: 0, totalTests: 0, classSummary: [] });
  const [isLoading, setIsLoading] = useState(true);

  const authHeaders = {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/institute-portal/dashboard-summary`, { headers: authHeaders });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Students', value: stats.totalStudents, icon: <Users size={24} />, color: 'from-blue-500 to-blue-700', action: () => navigate('/institute/students') },
    { title: 'Active Classes', value: stats.totalClasses, icon: <BookOpen size={24} />, color: 'from-indigo-500 to-indigo-700', action: () => navigate('/institute/students') },
    { title: 'Tests Recorded', value: stats.totalTests, icon: <ClipboardList size={24} />, color: 'from-emerald-500 to-emerald-700', action: () => navigate('/institute/physical-tests') },
    { title: 'Physical Perf.', value: '—', icon: <TrendingUp size={24} />, color: 'from-amber-500 to-amber-700', action: () => navigate('/institute/performance') },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16 font-sans">

      {/* Header Banner */}
      <div className="gov-card p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <span className="gov-eyebrow px-3.5 py-1.5 text-xs font-black uppercase tracking-widest flex items-center gap-1.5 w-max mb-3">
            <BookOpen size={12} /> Institute Portal
          </span>
          <h1 className="gov-page-heading text-3xl md:text-4xl font-black">
            Welcome, {user.instituteName || user.name || 'Institute'}
          </h1>
          <p className="text-slate-600 text-sm mt-1.5 max-w-xl font-medium">
            Manage your students, record physical tests, and analyze athletic performance metrics.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            onClick={stat.action}
            className="gov-card p-6 flex items-center justify-between hover:border-[#b8c9d8] transition-all duration-300 cursor-pointer group"
          >
            <div>
              <p className="text-text-light text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-text-dark mt-1">
                {isLoading ? '...' : stat.value}
              </h3>
            </div>
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="gov-card p-6">
        <h3 className="text-lg font-bold text-primary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/institute/students')}
            className="flex items-center gap-3 p-4 rounded-lg border border-[#e4dccf] bg-[#fbf7ee] hover:bg-[#eaf2f8] hover:border-[#cadeeb] transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
              <Plus size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Add Students</p>
              <p className="text-xs text-slate-400 font-medium">Add students class-wise</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/institute/physical-tests')}
            className="flex items-center gap-3 p-4 rounded-lg border border-[#e4dccf] bg-[#fbf7ee] hover:bg-emerald-50 hover:border-emerald-200 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-200 transition-colors">
              <ClipboardList size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Physical Screening</p>
              <p className="text-xs text-slate-400 font-medium">Record physical test parameters</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/institute/performance')}
            className="flex items-center gap-3 p-4 rounded-lg border border-[#e4dccf] bg-[#fbf7ee] hover:bg-amber-50 hover:border-amber-200 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-200 transition-colors">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Performance</p>
              <p className="text-xs text-slate-400 font-medium">Analyze physical metrics</p>
            </div>
          </button>
        </div>
      </div>

      {/* Class-wise Breakdown */}
      {stats.classSummary && stats.classSummary.length > 0 && (
        <div className="gov-card p-6">
          <h3 className="text-lg font-bold text-primary mb-4">Class-wise Student Distribution</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {stats.classSummary.map((cls) => (
              <div
                key={cls._id}
                onClick={() => navigate(`/institute/students?class=${cls._id}`)}
                className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer"
              >
                <span className="text-2xl font-black text-slate-800">{cls.count}</span>
                <span className="text-xs font-bold text-slate-400 mt-1">Class {cls._id}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstituteDashboard;
