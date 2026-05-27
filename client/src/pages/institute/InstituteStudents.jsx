import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, Plus, Search, Edit3, Trash2, X, Loader2, BookOpen, ChevronDown } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const STANDARDS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const InstituteStudents = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialClass = searchParams.get('class') || '';
  
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [autoId, setAutoId] = useState('');

  const authHeaders = {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json',
  };

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      let url = `${API_URL}/institute-portal/students`;
      const params = new URLSearchParams();
      if (selectedClass) params.append('class', selectedClass);
      if (searchTerm) params.append('search', searchTerm);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url, { headers: authHeaders });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    if (selectedClass) {
      setSearchParams({ class: selectedClass });
    } else {
      setSearchParams({});
    }
  }, [selectedClass, searchTerm]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const generateStudentId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const prefix = 'STU';
    const random = Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${prefix}${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const form = e.target;

    const payload = {
      studentId: form.studentId.value,
      name: form.studentName.value,
      dob: form.dob.value,
      class: form.studentClass.value,
      gender: form.gender.value,
      contact: form.contact.value,
      address: form.address.value,
      taaluka: form.taaluka.value,
      city: form.city.value,
      pincode: form.pincode.value,
    };

    try {
      const url = editingStudent
        ? `${API_URL}/institute-portal/students/${editingStudent._id}`
        : `${API_URL}/institute-portal/students`;

      const res = await fetch(url, {
        method: editingStudent ? 'PUT' : 'POST',
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingStudent(null);
        fetchStudents();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to save student');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/institute-portal/students/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (res.ok) {
        setStudents(prev => prev.filter(s => s._id !== id));
        setDeleteConfirm(null);
      }
    } catch (err) {
      alert('Failed to delete student');
    }
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setAutoId(generateStudentId());
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent)] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="px-3.5 py-1.5 bg-blue-500/10 text-blue-400 text-xs font-black rounded-lg border border-blue-400/20 uppercase tracking-widest flex items-center gap-1.5 w-max mb-3">
              <Users size={12} /> Student Management
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Students</h1>
            <p className="text-slate-400 text-sm mt-1.5 font-medium">
              Manage your students grouped by class/standard.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 self-start"
          >
            <Plus size={16} /> Add Student
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Class Filter */}
        <div className="relative">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer min-w-[160px]"
          >
            <option value="">All Classes</option>
            {STANDARDS.map(s => (
              <option key={s} value={s}>Class {s}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-2.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-sm font-semibold text-slate-800"
          />
        </div>

        <div className="text-xs font-bold text-slate-400 ml-auto">
          {students.length} student{students.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
              <Users className="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-700">No Students Found</p>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                {selectedClass ? `No students in Class ${selectedClass}.` : 'Add your first student to get started.'}
              </p>
            </div>
            <button onClick={openAddModal} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-1.5">
              <Plus size={14} /> Add Student
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-wider border-b border-slate-100">
                  <th className="py-4 px-6 font-bold">Student</th>
                  <th className="py-4 px-6 font-bold">Student ID</th>
                  <th className="py-4 px-6 font-bold">Class & Gender</th>
                  <th className="py-4 px-6 font-bold">DOB & Contact</th>
                  <th className="py-4 px-6 font-bold">Address</th>
                  <th className="py-4 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100 font-semibold text-slate-700">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/10">
                          {student.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-800">{student.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 font-mono text-[11px] rounded-lg border border-slate-200/50 font-bold">
                        {student.studentId}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-black">
                          Class {student.class}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">{student.gender}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-slate-800 font-bold">{formatDate(student.dob)}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{student.contact}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div>
                        <p className="text-slate-800 font-medium truncate" title={student.address}>{student.address}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                          {student.taaluka}, {student.city} - {student.pincode}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(student)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(student._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-black text-slate-800 mb-2">Delete Student?</h3>
            <p className="text-sm text-slate-500 mb-6">This action cannot be undone. The student and their data will be permanently removed.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-black hover:bg-red-600 transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Student Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={() => { setShowModal(false); setEditingStudent(null); }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-slate-100" onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-6 text-white relative overflow-hidden rounded-t-3xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent)] pointer-events-none"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 text-[9px] font-black rounded border border-blue-400/20 uppercase tracking-widest">
                    {editingStudent ? 'Edit Student' : 'New Student'}
                  </span>
                  <h3 className="text-lg font-black mt-1">{editingStudent ? 'Update Student Details' : 'Register New Student'}</h3>
                </div>
                <button onClick={() => { setShowModal(false); setEditingStudent(null); }} className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all text-slate-300">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Hidden auto-generated Student ID — shown in table, not during registration */}
              <input type="hidden" name="studentId" value={editingStudent ? editingStudent.studentId : autoId} readOnly />

              {/* Section: Personal Info */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-px flex-1 bg-slate-100"></span>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Personal Information</p>
                  <span className="h-px flex-1 bg-slate-100"></span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name *</label>
                    <input name="studentName" defaultValue={editingStudent?.name || ''} required className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" placeholder="e.g. Rahul Sharma" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Birth *</label>
                    <input name="dob" type="date" defaultValue={editingStudent?.dob ? new Date(editingStudent.dob).toISOString().split('T')[0] : ''} required className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender *</label>
                    <select name="gender" defaultValue={editingStudent?.gender || ''} required className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Standard / Class *</label>
                    <select name="studentClass" defaultValue={editingStudent?.class || selectedClass || ''} required className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all">
                      <option value="">Select Standard</option>
                      {STANDARDS.map(s => <option key={s} value={s}>Standard {s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Number *</label>
                    <input name="contact" type="tel" defaultValue={editingStudent?.contact || ''} required maxLength={10} className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" placeholder="e.g. 9876543210" />
                  </div>
                </div>
              </div>

              {/* Section: Address Info */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-px flex-1 bg-slate-100"></span>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address Details</p>
                  <span className="h-px flex-1 bg-slate-100"></span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address *</label>
                    <input name="address" defaultValue={editingStudent?.address || ''} required className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" placeholder="House No., Street, Area" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taaluka *</label>
                    <input name="taaluka" defaultValue={editingStudent?.taaluka || ''} required className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" placeholder="e.g. Haveli" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">City *</label>
                    <input name="city" defaultValue={editingStudent?.city || ''} required className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" placeholder="e.g. Pune" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pincode *</label>
                    <input name="pincode" type="text" inputMode="numeric" maxLength={6} defaultValue={editingStudent?.pincode || ''} required className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" placeholder="e.g. 411001" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => { setShowModal(false); setEditingStudent(null); }} className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={formLoading} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-blue-200">
                  {formLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  {formLoading ? 'Saving...' : (editingStudent ? 'Update Student' : 'Register Student')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstituteStudents;
