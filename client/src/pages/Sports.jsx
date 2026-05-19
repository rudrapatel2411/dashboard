import React from 'react';
import { Trophy, Users, Award } from 'lucide-react';

const Sports = () => {
  const sportsCategories = [
    { name: "Cricket", students: 120, coaches: 3, medals: 15 },
    { name: "Football", students: 95, coaches: 2, medals: 12 },
    { name: "Basketball", students: 60, coaches: 2, medals: 8 },
    { name: "Volleyball", students: 45, coaches: 1, medals: 5 },
    { name: "Athletics", students: 150, coaches: 4, medals: 22 },
    { name: "Swimming", students: 80, coaches: 2, medals: 18 },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Sports Categories</h1>
        <p className="text-text-light text-sm">View and manage all available sports, teams, and assignments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sportsCategories.map((sport, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                <Trophy size={24} />
              </div>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Award size={12} /> {sport.medals} Medals
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-text-dark mb-2">{sport.name}</h3>
            
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-text-light flex items-center gap-1 mb-1"><Users size={12} /> Students</p>
                <p className="font-semibold text-text-dark">{sport.students} Active</p>
              </div>
              <div>
                <p className="text-xs text-text-light flex items-center gap-1 mb-1"><Award size={12} /> Coaches</p>
                <p className="font-semibold text-text-dark">{sport.coaches} Assigned</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sports;
