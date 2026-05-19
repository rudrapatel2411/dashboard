import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';

const Students = () => {
  const [students] = useState([
    { id: 1, studentId: "STU-001", name: "John Doe", age: 16, sport: "Football", class: "10A", level: "Excellent" },
    { id: 2, studentId: "STU-002", name: "Sarah Smith", age: 15, sport: "Basketball", class: "9B", level: "Good" },
    { id: 3, studentId: "STU-003", name: "Mike Johnson", age: 17, sport: "Cricket", class: "11C", level: "Average" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Student Management</h1>
          <p className="text-text-light text-sm">Manage student profiles, assign sports, and view details.</p>
        </div>
        <button className="bg-secondary text-white px-4 py-2 rounded-lg text-sm shadow-md hover:bg-primary transition-colors flex items-center gap-2 font-medium">
          <Plus size={18} /> Add New Student
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 bg-white"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-text-dark bg-white hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-text-light text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-semibold">Student</th>
                <th className="p-4 font-semibold">ID & Class</th>
                <th className="p-4 font-semibold">Sport</th>
                <th className="p-4 font-semibold">Fitness Level</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        <img src={`https://ui-avatars.com/api/?name=${student.name}&background=random`} alt={student.name} />
                      </div>
                      <div>
                        <p className="font-semibold text-text-dark">{student.name}</p>
                        <p className="text-xs text-text-light">Age: {student.age}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-text-dark">{student.studentId}</p>
                    <p className="text-xs text-text-light">Class {student.class}</p>
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {student.sport}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      student.level === 'Excellent' ? 'bg-green-100 text-green-700' :
                      student.level === 'Good' ? 'bg-blue-100 text-blue-700' :
                      student.level === 'Average' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {student.level}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;
