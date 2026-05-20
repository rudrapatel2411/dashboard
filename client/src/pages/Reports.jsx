import React from 'react';
import { Download, Printer, Share2, Award, Activity } from 'lucide-react';

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Student Reports</h1>
          <p className="text-text-light text-sm">Generate and export professional graphical reports.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white text-text-dark px-4 py-2 rounded-lg border border-gray-200 text-sm shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium">
            <Share2 size={16} /> Share
          </button>
          <button className="bg-white text-text-dark px-4 py-2 rounded-lg border border-gray-200 text-sm shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium">
            <Printer size={16} /> Print
          </button>
          <button className="bg-secondary text-white px-4 py-2 rounded-lg text-sm shadow-md hover:bg-primary transition-colors flex items-center gap-2 font-medium">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-4xl mx-auto">
        {/* Report Header */}
        <div className="border-b-4 border-secondary pb-6 mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black text-primary uppercase tracking-tight">Athletic Performance Report</h2>
            <p className="text-gray-500 mt-1 font-medium">Academic Year 2025 - Term 2</p>
          </div>
          <div className="text-right">
            <div className="w-12 h-12 bg-secondary rounded-xl ml-auto mb-2 flex items-center justify-center">
              <Award className="text-white" size={24} />
            </div>
            <p className="font-bold text-primary">SportSphere Academy</p>
          </div>
        </div>

        {/* Student Profile Summary */}
        <div className="flex gap-8 mb-10">
          <div className="w-32 h-32 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border-4 border-white shadow-lg">
            <img src="https://ui-avatars.com/api/?name=John+Doe&background=2563EB&color=fff&size=200" alt="Student" />
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 flex-1">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Student Name</p>
              <p className="text-lg font-bold text-text-dark">John Doe</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Student ID</p>
              <p className="text-lg font-bold text-text-dark">STU-001</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Primary Sport</p>
              <p className="text-lg font-bold text-text-dark">Football</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">BMI & Category</p>
              <p className="text-lg font-bold text-text-dark">22.5 (Normal)</p>
            </div>
          </div>
        </div>

        {/* Grades Block */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center">
            <p className="text-sm font-bold text-green-800 uppercase tracking-widest mb-2">Overall Score</p>
            <h3 className="text-4xl font-black text-green-600">92%</h3>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
            <p className="text-sm font-bold text-blue-800 uppercase tracking-widest mb-2">Fitness Level</p>
            <h3 className="text-3xl font-black text-blue-600 mt-1">Excellent</h3>
          </div>
          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 text-center">
            <p className="text-sm font-bold text-orange-800 uppercase tracking-widest mb-2">Attendance</p>
            <h3 className="text-4xl font-black text-orange-600">98%</h3>
          </div>
        </div>

        {/* AI Insight Placeholder */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold text-text-dark mb-2 flex items-center gap-2">
            <Activity size={18} className="text-secondary" /> Performance Insights
          </h4>
          <p className="text-gray-600 italic">"Student shows excellent stamina improvement in Term 2. Outstanding endurance levels maintained during high-intensity training. Needs slight focus on flexibility to prevent future injuries."</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
