import React, { useState } from 'react';
import { Activity, PlusCircle, CheckCircle, Building2, Users, TrendingUp } from 'lucide-react';

const Performance = () => {
  const [viewMode, setViewMode] = useState('student'); // 'student' or 'institute'
  const [selectedInstitute, setSelectedInstitute] = useState('');

  // Mock institute data for institute view
  const mockInstitutes = [
    { id: '1', name: 'DPS Ahmedabad' },
    { id: '2', name: 'Ryan International' },
    { id: '3', name: 'Kendriya Vidyalaya' },
  ];

  const mockInstituteStats = {
    '1': { avgScore: 82, totalStudents: 120, participationRate: '94%', topSport: 'Cricket', recentTrend: '+5.2%' },
    '2': { avgScore: 75, totalStudents: 85, participationRate: '88%', topSport: 'Football', recentTrend: '+3.1%' },
    '3': { avgScore: 69, totalStudents: 200, participationRate: '91%', topSport: 'Athletics', recentTrend: '+7.8%' },
  };

  const selectedStats = mockInstituteStats[selectedInstitute] || null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Performance Evaluation</h1>
          <p className="text-text-light text-sm">Enter Term-1 and Term-2 metrics to generate insights.</p>
        </div>
      </div>

      {/* Toggle: Student / Institute */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 inline-flex gap-1">
        <button
          onClick={() => setViewMode('student')}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            viewMode === 'student'
              ? 'bg-secondary text-white shadow-md'
              : 'text-text-light hover:bg-gray-100'
          }`}
        >
          Student
        </button>
        <button
          onClick={() => setViewMode('institute')}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            viewMode === 'institute'
              ? 'bg-secondary text-white shadow-md'
              : 'text-text-light hover:bg-gray-100'
          }`}
        >
          Institute
        </button>
      </div>

      {viewMode === 'student' ? (
        /* ===== STUDENT VIEW (existing form) ===== */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-primary mb-4">Select Student</h3>
              <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary mb-4">
                <option value="">Select a student...</option>
                <option value="1">John Doe (STU-001)</option>
                <option value="2">Sarah Smith (STU-002)</option>
              </select>
              
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-2">Student Info</h4>
                <p className="text-sm text-blue-800">Age: 16 | Class: 10A</p>
                <p className="text-sm text-blue-800">Sport: Football</p>
                <p className="text-sm text-blue-800 mt-2 font-medium">Current BMI: 22.5 (Normal)</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-primary mb-4">Term Selection</h3>
              <div className="flex gap-4">
                <button className="flex-1 py-3 rounded-xl bg-secondary text-white font-semibold flex items-center justify-center gap-2">
                  <CheckCircle size={18} /> Term 1
                </button>
                <button className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-500 font-semibold hover:bg-gray-200 transition-colors">
                   Term 2
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
              <Activity className="text-accent" /> Enter Metrics (Out of 100)
            </h3>
            
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Core Metrics */}
              {['Speed', 'Strength', 'Stamina', 'Agility', 'Flexibility', 'Accuracy', 'Endurance', 'Reaction Time'].map(metric => (
                <div key={metric}>
                  <label className="block text-sm font-medium text-text-dark mb-2">{metric}</label>
                  <input 
                    type="number" 
                    min="0" max="100"
                    className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                    placeholder={`Enter ${metric} score`}
                  />
                </div>
              ))}

              <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100">
                <h4 className="font-bold text-text-dark mb-4">Other Aspects</h4>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Attendance (%)</label>
                <input type="number" min="0" max="100" className="w-full p-3 rounded-xl border border-gray-300" placeholder="%" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Discipline (1-10)</label>
                <input type="number" min="1" max="10" className="w-full p-3 rounded-xl border border-gray-300" placeholder="/10" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-dark mb-2">Coach Remarks</label>
                <textarea rows="3" className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-secondary" placeholder="Enter observation details..."></textarea>
              </div>

              <div className="md:col-span-2 flex justify-end mt-4">
                <button type="submit" className="bg-gradient-to-r from-secondary to-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
                  <PlusCircle size={20} /> Save Performance Data
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* ===== INSTITUTE VIEW ===== */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <Building2 className="text-accent" /> Select Institute
            </h3>
            <select
              value={selectedInstitute}
              onChange={(e) => setSelectedInstitute(e.target.value)}
              className="w-full sm:w-96 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary"
            >
              <option value="">Select an institute...</option>
              {mockInstitutes.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.name}</option>
              ))}
            </select>
          </div>

          {selectedStats && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-secondary">
                      <Activity size={20} />
                    </div>
                    <p className="text-sm font-medium text-text-light">Average Score</p>
                  </div>
                  <h3 className="text-3xl font-bold text-text-dark">{selectedStats.avgScore}%</h3>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                      <Users size={20} />
                    </div>
                    <p className="text-sm font-medium text-text-light">Total Students</p>
                  </div>
                  <h3 className="text-3xl font-bold text-text-dark">{selectedStats.totalStudents}</h3>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                      <CheckCircle size={20} />
                    </div>
                    <p className="text-sm font-medium text-text-light">Participation Rate</p>
                  </div>
                  <h3 className="text-3xl font-bold text-text-dark">{selectedStats.participationRate}</h3>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                      <TrendingUp size={20} />
                    </div>
                    <p className="text-sm font-medium text-text-light">Recent Trend</p>
                  </div>
                  <h3 className="text-3xl font-bold text-green-600">{selectedStats.recentTrend}</h3>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-primary mb-4">Institute Performance Summary</h3>
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-800"><span className="font-semibold">Top Sport:</span> {selectedStats.topSport}</p>
                  <p className="text-sm text-blue-800 mt-2"><span className="font-semibold">Average Score:</span> {selectedStats.avgScore}% across all evaluated students</p>
                  <p className="text-sm text-blue-800 mt-2"><span className="font-semibold">Participation:</span> {selectedStats.participationRate} of enrolled students actively participate in sports programs</p>
                </div>
              </div>
            </div>
          )}

          {!selectedStats && selectedInstitute === '' && (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-text-light text-lg">Select an institute to view performance data</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Performance;
