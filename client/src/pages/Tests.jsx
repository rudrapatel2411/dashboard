import React, { useState } from 'react';
import { ClipboardList, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockTests = [
  { id: 1, name: '100m Sprint', date: '2026-03-15', institute: 'DPS Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', participants: 45, avgScore: 78 },
  { id: 2, name: 'Long Jump', date: '2026-03-20', institute: 'Ryan International', city: 'Bhavnagar', state: 'Gujarat', participants: 38, avgScore: 72 },
  { id: 3, name: 'Shot Put', date: '2026-04-01', institute: 'Kendriya Vidyalaya', city: 'Surat', state: 'Gujarat', participants: 52, avgScore: 65 },
];

const filterOptions = {
  city: ['Ahmedabad', 'Bhavnagar', 'Surat', 'Rajkot', 'Vadodara'],
  state: ['Gujarat', 'Maharashtra', 'Rajasthan', 'Delhi', 'Karnataka'],
  class: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
  institute: ['DPS Ahmedabad', 'Ryan International', 'Kendriya Vidyalaya', 'St. Xavier\'s', 'DAV Public School'],
};

const Tests = () => {
  const [filterType, setFilterType] = useState('city');
  const [groupA, setGroupA] = useState('');
  const [groupB, setGroupB] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [comparisonData, setComparisonData] = useState(null);

  const handleCompare = () => {
    if (!groupA || !groupB) return;
    setComparisonData([
      { test: '100m Sprint', [groupA]: 78, [groupB]: 72 },
      { test: 'Long Jump', [groupA]: 65, [groupB]: 80 },
      { test: 'Shot Put', [groupA]: 70, [groupB]: 68 },
      { test: 'High Jump', [groupA]: 82, [groupB]: 75 },
      { test: '200m Dash', [groupA]: 88, [groupB]: 84 },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Section 1 — Test List */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Tests</h1>
          <p className="text-text-light text-sm">View test results, scores, and compare performance across groups.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
          <ClipboardList size={18} className="text-secondary" />
          <h2 className="text-sm font-semibold text-text-dark">Test Records</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-text-light text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-semibold">Test Name</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Institute</th>
                <th className="p-4 font-semibold">City</th>
                <th className="p-4 font-semibold">State</th>
                <th className="p-4 font-semibold">Participants</th>
                <th className="p-4 font-semibold">Avg Score</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {mockTests.map((test) => (
                <tr key={test.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-text-dark">{test.name}</p>
                  </td>
                  <td className="p-4 text-text-dark">{new Date(test.date).toLocaleDateString()}</td>
                  <td className="p-4 text-text-dark">{test.institute}</td>
                  <td className="p-4 text-text-dark">{test.city}</td>
                  <td className="p-4 text-text-dark">{test.state}</td>
                  <td className="p-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {test.participants}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      test.avgScore >= 75 ? 'bg-green-100 text-green-700' :
                      test.avgScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {test.avgScore}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2 — Comparison Tool */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
          <BarChart3 size={18} className="text-secondary" />
          <h2 className="text-sm font-semibold text-text-dark">Performance Comparison Tool</h2>
        </div>

        <div className="p-6 space-y-5">
          {/* Filter Type */}
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">Compare By</label>
            <div className="flex flex-wrap gap-3">
              {['city', 'state', 'class', 'institute'].map((type) => (
                <label
                  key={type}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm cursor-pointer transition-colors ${
                    filterType === type
                      ? 'border-secondary bg-secondary/10 text-secondary font-medium'
                      : 'border-gray-200 text-text-dark hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="filterType"
                    value={type}
                    checked={filterType === type}
                    onChange={(e) => { setFilterType(e.target.value); setGroupA(''); setGroupB(''); setComparisonData(null); }}
                    className="sr-only"
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)} vs {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Groups + Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Group A</label>
              <select
                value={groupA}
                onChange={(e) => setGroupA(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-text-dark bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
              >
                <option value="">Select {filterType}</option>
                {filterOptions[filterType].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Group B</label>
              <select
                value={groupB}
                onChange={(e) => setGroupB(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-text-dark bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
              >
                <option value="">Select {filterType}</option>
                {filterOptions[filterType].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Date From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-text-dark bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Date To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-text-dark bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
              />
            </div>
          </div>

          <button
            onClick={handleCompare}
            disabled={!groupA || !groupB}
            className="bg-secondary text-white px-6 py-2 rounded-lg text-sm shadow-md hover:bg-primary transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Compare
          </button>

          {/* Chart */}
          {comparisonData && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="test" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={groupA} fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey={groupB} fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tests;
