import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Building2, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Institutes = () => {
  const [institutes, setInstitutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  const authHeaders = {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
  };

  const fetchInstitutes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_URL}/institutes?page=${page}&limit=10&search=${encodeURIComponent(search)}&status=approved`,
        { headers: authHeaders }
      );
      if (!res.ok) throw new Error('Failed to fetch institutes');
      const data = await res.json();
      setInstitutes(data.institutes || data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutes();
  }, [page, search]);

  const fetchStudents = async (instituteId) => {
    setStudentsLoading(true);
    try {
      const res = await fetch(`${API_URL}/institutes/${instituteId}/students`, {
        headers: authHeaders,
      });
      if (!res.ok) throw new Error('Failed to fetch students');
      const data = await res.json();
      setStudents(data.students || data.data || []);
    } catch (err) {
      setStudents([]);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleRowClick = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      setStudents([]);
    } else {
      setExpandedId(id);
      fetchStudents(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Institutes</h1>
          <p className="text-text-light text-sm">View approved institutes and their students.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, city, or state..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 bg-white"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-text-dark bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-text-light px-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-text-dark bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-secondary animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-500">
            <p className="text-sm font-medium">{error}</p>
            <button onClick={fetchInstitutes} className="mt-3 text-sm text-secondary hover:underline">
              Try Again
            </button>
          </div>
        ) : institutes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-light">
            <Building2 className="w-12 h-12 mb-3 text-gray-300" />
            <p className="text-sm">No institutes found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-text-light text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="p-4 font-semibold w-8"></th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">City</th>
                  <th className="p-4 font-semibold">State</th>
                  <th className="p-4 font-semibold">Total Students</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {institutes.map((inst) => (
                  <React.Fragment key={inst._id || inst.id}>
                    <tr
                      className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                      onClick={() => handleRowClick(inst._id || inst.id)}
                    >
                      <td className="p-4 text-text-light">
                        {expandedId === (inst._id || inst.id) ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                            <Building2 size={18} className="text-secondary" />
                          </div>
                          <p className="font-semibold text-text-dark">{inst.name}</p>
                        </div>
                      </td>
                      <td className="p-4 text-text-dark">{inst.city}</td>
                      <td className="p-4 text-text-dark">{inst.state}</td>
                      <td className="p-4 text-text-dark">{inst.totalStudents ?? 0}</td>
                      <td className="p-4 text-right">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(inst._id || inst.id);
                          }}
                        >
                          {expandedId === (inst._id || inst.id) ? 'Collapse' : 'View Students'}
                        </button>
                      </td>
                    </tr>

                    {expandedId === (inst._id || inst.id) && (
                      <tr>
                        <td colSpan={6} className="bg-gray-50/70 px-8 py-4">
                          {studentsLoading ? (
                            <div className="flex items-center justify-center py-8">
                              <Loader2 className="w-6 h-6 text-secondary animate-spin" />
                            </div>
                          ) : students.length === 0 ? (
                            <p className="text-sm text-text-light text-center py-4">No students found for this institute.</p>
                          ) : (
                            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-gray-50 text-text-light text-xs uppercase tracking-wider border-b border-gray-100">
                                    <th className="p-3 font-semibold">Full Name</th>
                                    <th className="p-3 font-semibold">Admission No.</th>
                                    <th className="p-3 font-semibold">Class</th>
                                    <th className="p-3 font-semibold">DOB</th>
                                    <th className="p-3 font-semibold">Father Name</th>
                                    <th className="p-3 font-semibold">Mobile</th>
                                    <th className="p-3 font-semibold">City</th>
                                  </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-gray-100">
                                  {students.map((stu, idx) => (
                                    <tr key={stu._id || idx} className="hover:bg-blue-50/30 transition-colors">
                                      <td className="p-3 font-medium text-text-dark">{stu.fullName || stu.name}</td>
                                      <td className="p-3 text-text-dark">{stu.admissionNo}</td>
                                      <td className="p-3 text-text-dark">{stu.class}</td>
                                      <td className="p-3 text-text-dark">{stu.dob ? new Date(stu.dob).toLocaleDateString() : '-'}</td>
                                      <td className="p-3 text-text-dark">{stu.fatherName}</td>
                                      <td className="p-3 text-text-dark">{stu.mobile}</td>
                                      <td className="p-3 text-text-dark">{stu.city}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Institutes;
