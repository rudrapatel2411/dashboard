import React from 'react';
import { Activity, PlusCircle, CheckCircle } from 'lucide-react';

const Performance = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Performance Evaluation</h1>
          <p className="text-text-light text-sm">Enter Term-1 and Term-2 metrics to generate insights.</p>
        </div>
      </div>

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
    </div>
  );
};

export default Performance;
