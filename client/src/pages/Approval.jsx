import React, { useState, useEffect } from 'react';
import { UserCheck, Eye, Check, X, Loader2, Building2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Approval = () => {
  const [institutes, setInstitutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const authHeaders = {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json',
  };

  const fetchPendingInstitutes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/institutes?status=pending`, {
        headers: authHeaders,
      });
      if (!res.ok) throw new Error('Failed to fetch pending institutes');
      const data = await res.json();
      setInstitutes(data.institutes || data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingInstitutes();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const res = await fetch(`${API_URL}/institutes/${id}/approve`, {
        method: 'PUT',
        headers: authHeaders,
      });
      if (!res.ok) throw new Error('Failed to approve institute');
      setInstitutes((prev) => prev.filter((inst) => (inst._id || inst.id) !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      const res = await fetch(`${API_URL}/institutes/${id}/reject`, {
        method: 'PUT',
        headers: authHeaders,
      });
      if (!res.ok) throw new Error('Failed to reject institute');
      setInstitutes((prev) => prev.filter((inst) => (inst._id || inst.id) !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Pending Approvals</h1>
          <p className="text-text-light text-sm">Review and approve or reject institute registrations.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-secondary animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-500">
            <p className="text-sm font-medium">{error}</p>
            <button onClick={fetchPendingInstitutes} className="mt-3 text-sm text-secondary hover:underline">
              Try Again
            </button>
          </div>
        ) : institutes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-light">
            <UserCheck className="w-12 h-12 mb-3 text-gray-300" />
            <p className="text-sm font-medium">No pending approvals</p>
            <p className="text-xs text-text-light mt-1">All institute registrations have been reviewed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-text-light text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="p-4 font-semibold">Institute Name</th>
                  <th className="p-4 font-semibold">City</th>
                  <th className="p-4 font-semibold">State</th>
                  <th className="p-4 font-semibold">Registered Date</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {institutes.map((inst) => {
                  const id = inst._id || inst.id;
                  return (
                    <tr key={id} className="hover:bg-blue-50/30 transition-colors">
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
                      <td className="p-4 text-text-dark">{formatDate(inst.createdAt)}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedInstitute(inst)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleApprove(id)}
                            disabled={actionLoading === id}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            {actionLoading === id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(id)}
                            disabled={actionLoading === id}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            {actionLoading === id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedInstitute && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedInstitute(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Building2 size={20} className="text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-primary">Institute Details</h3>
              </div>
              <button
                onClick={() => setSelectedInstitute(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-text-light"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {[
                { label: 'Name', value: selectedInstitute.name },
                { label: 'City', value: selectedInstitute.city },
                { label: 'State', value: selectedInstitute.state },
                { label: 'Address', value: selectedInstitute.address },
                { label: 'Contact Person', value: selectedInstitute.contactPerson },
                { label: 'Mobile', value: selectedInstitute.mobile },
                { label: 'Registered On', value: formatDate(selectedInstitute.createdAt) },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <span className="text-sm font-medium text-text-light w-32 shrink-0">{item.label}</span>
                  <span className="text-sm text-text-dark">{item.value || '-'}</span>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  handleApprove(selectedInstitute._id || selectedInstitute.id);
                  setSelectedInstitute(null);
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Check size={16} /> Approve
              </button>
              <button
                onClick={() => {
                  handleReject(selectedInstitute._id || selectedInstitute.id);
                  setSelectedInstitute(null);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <X size={16} /> Reject
              </button>
              <button
                onClick={() => setSelectedInstitute(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-text-dark hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approval;
