import React, { useState, useEffect } from 'react';
import { UserCheck, Eye, Check, X, Loader2, Building2, MapPin, Phone, User, Calendar, Sparkles } from 'lucide-react';

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
    <div className="space-y-8 animate-fade-in pb-16 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent)] pointer-events-none"></div>
        <div className="relative z-10">
          <span className="px-3.5 py-1.5 bg-indigo-500/10 text-indigo-400 text-xs font-black rounded-lg border border-indigo-400/20 uppercase tracking-widest flex items-center gap-1.5 w-max mb-3">
            <UserCheck size={12} /> Review Center
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Pending Approvals</h1>
          <p className="text-slate-400 text-sm mt-1.5 max-w-xl font-medium">
            Review registration applications, check representative credentials, and approve or reject hub access.
          </p>
        </div>
      </div>

      {/* Pending list container */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-500 space-y-4">
            <p className="text-sm font-semibold">{error}</p>
            <button 
              onClick={fetchPendingInstitutes} 
              className="px-5 py-2 border border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 transition-all"
            >
              Try Again
            </button>
          </div>
        ) : institutes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-350">
              <UserCheck className="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-700">No Pending Approvals</p>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">All institute registrations have been successfully reviewed.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-wider border-b border-slate-100">
                  <th className="py-4 px-6 font-bold">Institute Name</th>
                  <th className="py-4 px-6 font-bold">City</th>
                  <th className="py-4 px-6 font-bold">State</th>
                  <th className="py-4 px-6 font-bold">Registered Date</th>
                  <th className="py-4 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100 font-semibold text-slate-700">
                {institutes.map((inst) => {
                  const id = inst._id || inst.id;
                  return (
                    <tr key={id} className="hover:bg-indigo-50/20 transition-colors">
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Building2 size={18} />
                          </div>
                          <p className="font-black text-slate-800">{inst.name}</p>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 text-slate-550">{inst.city}</td>
                      <td className="py-4.5 px-6 text-slate-550">{inst.state}</td>
                      <td className="py-4.5 px-6 text-slate-500">{formatDate(inst.createdAt)}</td>
                      <td className="py-4.5 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedInstitute(inst)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleReject(id)}
                            disabled={actionLoading === id}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                            title="Reject Hub"
                          >
                            {actionLoading === id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                          </button>
                          
                          <button
                            onClick={() => handleApprove(id)}
                            disabled={actionLoading === id}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-1 active:scale-95 shadow-md shadow-indigo-500/10"
                            title="Approve Hub"
                          >
                            {actionLoading === id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            Approve
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

      {/* Premium Detail Modal */}
      {selectedInstitute && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedInstitute(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent)] pointer-events-none"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center">
                    <Building2 size={24} className="text-indigo-400" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-black rounded border border-indigo-400/20 uppercase tracking-widest block w-max">
                      Pending Registration
                    </span>
                    <h3 className="text-lg font-black mt-1 leading-tight">{selectedInstitute.name}</h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInstitute(null)}
                  className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all text-slate-300"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Highlight Location section */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                <h4 className="text-[10px] uppercase font-black text-indigo-600 tracking-wider flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
                  <MapPin size={12} /> Geographic & Address details
                </h4>
                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex items-start gap-3">
                    <span className="text-slate-400 text-[10px] w-20 shrink-0 font-bold uppercase mt-0.5">Address</span>
                    <span className="text-slate-700">{selectedInstitute.address || 'Not Provided'}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-slate-400 text-[10px] w-20 shrink-0 font-bold uppercase">City / State</span>
                    <span className="text-slate-700">{selectedInstitute.city}, {selectedInstitute.state}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information section */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                <h4 className="text-[10px] uppercase font-black text-indigo-600 tracking-wider flex items-center gap-1.5 border-b border-slate-200/50 pb-2">
                  <Phone size={12} /> Contact & Representative Details
                </h4>
                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex items-start gap-3">
                    <span className="text-slate-400 text-[10px] w-20 shrink-0 font-bold uppercase flex items-center gap-1">
                      <User size={10} /> Person
                    </span>
                    <span className="text-slate-700 font-extrabold">{selectedInstitute.contactPerson || 'Not Provided'}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-slate-400 text-[10px] w-20 shrink-0 font-bold uppercase flex items-center gap-1">
                      <Phone size={10} /> Mobile
                    </span>
                    <a href={`tel:${selectedInstitute.mobile}`} className="text-indigo-600 hover:text-indigo-800 transition-colors font-black">
                      {selectedInstitute.mobile || 'Not Provided'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Audit Details */}
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <Calendar size={12} className="text-slate-400" />
                <span>Registration Logged On:</span>
                <span className="text-slate-600 font-black">{formatDate(selectedInstitute.createdAt)}</span>
              </div>

            </div>

            {/* Bottom Actions banner */}
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/40">
              <button
                onClick={() => setSelectedInstitute(null)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all active:scale-95 bg-white"
              >
                Close Profile
              </button>
              <button
                onClick={() => {
                  handleReject(selectedInstitute._id || selectedInstitute.id);
                  setSelectedInstitute(null);
                }}
                disabled={actionLoading === (selectedInstitute._id || selectedInstitute.id)}
                className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 active:scale-95 shadow-md shadow-red-500/10 animate-pulse-once"
              >
                <X size={14} /> Reject Hub
              </button>
              <button
                onClick={() => {
                  handleApprove(selectedInstitute._id || selectedInstitute.id);
                  setSelectedInstitute(null);
                }}
                disabled={actionLoading === (selectedInstitute._id || selectedInstitute.id)}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 active:scale-95 shadow-md shadow-indigo-500/10"
              >
                <Check size={14} /> Approve Hub
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Approval;
