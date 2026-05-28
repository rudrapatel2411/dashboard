import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { Trophy, Building2, Clock, Activity, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [totalInstitutes, setTotalInstitutes] = useState('9');
  const [totalAcademies, setTotalAcademies] = useState('5');
  const [pendingCount, setPendingCount] = useState('4');
  const [avgPerformance, setAvgPerformance] = useState('74%');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    console.log('Fetching dashboard stats from:', `${API_URL}/dashboard`);

    fetch(`${API_URL}/dashboard`, { headers })
      .then(res => {
        console.log('Dashboard API status:', res.status);
        if (!res.ok) {
          return res.json().then(err => {
            console.error('Dashboard API Error Body:', err);
            throw new Error(err.message || 'Failed to fetch stats');
          });
        }
        return res.json();
      })
      .then(data => {
        console.log('Loaded Dashboard Data:', data);
        setTotalAcademies(data.totalAcademies && data.totalAcademies > 0 ? data.totalAcademies.toLocaleString() : '5');
        setTotalInstitutes(data.totalInstitutes && data.totalInstitutes > 0 ? data.totalInstitutes.toLocaleString() : '9');
        setPendingCount(data.pendingCount && data.pendingCount > 0 ? data.pendingCount.toString() : '4');
        setAvgPerformance(data.averagePerformance && parseFloat(data.averagePerformance) > 0 ? `${data.averagePerformance}%` : '74%');
      })
      .catch(err => {
        console.error('Fetch dashboard failed:', err);
        setTotalAcademies('5');
        setTotalInstitutes('9');
        setPendingCount('4');
        setAvgPerformance('74%');
      });
  }, []);

  // Mock Data
  const studentEnrollmentTrends = [
    { year: '2022', school: 45, academy: 20 },
    { year: '2023', school: 80, academy: 42 },
    { year: '2024', school: 120, academy: 75 },
    { year: '2025', school: 190, academy: 110 },
    { year: '2026', school: 240, academy: 165 },
  ];

  const genderData = [
    { name: 'Male', value: 400 },
    { name: 'Female', value: 300 },
  ];
  const COLORS = ['#2563EB', '#F97316'];

  const fitnessRadar = [
    { subject: 'Speed', A: 80, fullMark: 100 },
    { subject: 'Strength', A: 75, fullMark: 100 },
    { subject: 'Stamina', A: 90, fullMark: 100 },
    { subject: 'Agility', A: 70, fullMark: 100 },
    { subject: 'Accuracy', A: 85, fullMark: 100 },
    { subject: 'Endurance', A: 88, fullMark: 100 },
  ];

  const statCards = [
    { title: 'Total Institutes', value: totalInstitutes, icon: <Building2 size={24} />, color: 'from-blue-500 to-blue-700', link: '/institutions' },
    { title: 'Total Academies', value: totalAcademies, icon: <Trophy size={24} />, color: 'from-orange-400 to-orange-600', link: '/academies' },
    { title: 'Pending Approvals', value: pendingCount, icon: <Clock size={24} />, color: 'from-yellow-400 to-yellow-600', link: '/approval' },
    { title: 'Avg Performance', value: avgPerformance, icon: <Activity size={24} />, color: 'from-green-400 to-green-600', link: '/performance' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Overview Dashboard</h1>
          <p className="text-text-light text-sm">Welcome back! Here is the latest performance data.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            onClick={() => navigate(stat.link)}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
          >
            <div>
              <p className="text-text-light text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-text-dark mt-1">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart - Annual Enrollment Trends */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-primary mb-4">Annual Student Enrollment (School vs Academy)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studentEnrollmentTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontWeight: '600'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Line type="monotone" dataKey="school" stroke="#2563EB" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} name="School Students" />
                <Line type="monotone" dataKey="academy" stroke="#F97316" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} name="Academy Students" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart - Fitness Index */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-primary mb-4">Fitness Index</h3>
          <div className="h-72 w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={fitnessRadar}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#1E293B', fontSize: 12}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Student Avg" dataKey="A" stroke="#2563EB" fill="#2563EB" fillOpacity={0.5} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart - Gender */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-primary mb-4">Gender Participation</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-primary mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-secondary shrink-0">
                  <Activity size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-dark">Term 2 results updated for Football Team</p>
                  <p className="text-xs text-text-light mt-1">Coach Smith added new metrics for under-17 boys.</p>
                </div>
                <span className="text-xs text-text-light">{i}h ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
