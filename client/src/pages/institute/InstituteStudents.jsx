import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Users, Plus, Search, Edit3, Trash2, X, Loader2, BookOpen, ChevronDown, Printer, Sparkles, Activity } from 'lucide-react';
import { TableSkeleton } from '../../components/Skeleton';
import Pagination from '../../components/Pagination';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const STANDARDS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const PAGE_SIZE = 10;

const InstituteStudents = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialClass = searchParams.get('class') || '';
  
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [autoId, setAutoId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fit India Requirements State
  const [printStudentIdCard, setPrintStudentIdCard] = useState(null);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [promoteSourceClass, setPromoteSourceClass] = useState('');
  const [promoteTargetClass, setPromoteTargetClass] = useState('');
  const [promoteLoading, setPromoteLoading] = useState(false);

  // Freeze background scrolling when any modal is open
  useEffect(() => {
    const mainEl = document.querySelector('main');
    const isAnyModalOpen = !!(showModal || deleteConfirm || showPromoteModal || printStudentIdCard);
    if (isAnyModalOpen) {
      if (mainEl) mainEl.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      if (mainEl) mainEl.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      if (mainEl) mainEl.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [showModal, deleteConfirm, showPromoteModal, printStudentIdCard]);


  const authHeaders = {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json',
  };

  const fetchStudents = async () => {
    setIsLoading(true);
    setLoadError('');
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
        setCurrentPage(1); // reset to first page on filter change
      } else {
        const errData = await res.json().catch(() => ({}));
        const message = errData.message || `Failed to fetch students (${res.status})`;
        setStudents([]);
        setLoadError(message);

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setTimeout(() => {
            window.location.href = '/institute/login';
          }, 900);
        }
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setLoadError('Could not connect to the server. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fix #18: Separate fetch from URL-sync to prevent double-fetch on mount
  useEffect(() => {
    fetchStudents();
  }, [selectedClass, searchTerm]);

  useEffect(() => {
    if (selectedClass) {
      setSearchParams({ class: selectedClass });
    } else {
      setSearchParams({});
    }
  }, [selectedClass]);

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

  const handleBulkPromote = async (e) => {
    e.preventDefault();
    if (!promoteSourceClass || !promoteTargetClass) {
      alert('Please select both source and target classes.');
      return;
    }
    if (promoteSourceClass === promoteTargetClass) {
      alert('Source and target classes must be different.');
      return;
    }
    
    setPromoteLoading(true);
    try {
      const res = await fetch(`${API_URL}/institute-portal/students/promote`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          sourceClass: promoteSourceClass,
          targetClass: promoteTargetClass,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Successfully promoted ${data.modifiedCount} student(s) from Class ${promoteSourceClass} to Class ${promoteTargetClass}!`);
        setShowPromoteModal(false);
        setPromoteSourceClass('');
        setPromoteTargetClass('');
        fetchStudents();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to promote students');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setPromoteLoading(false);
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

  // Pagination logic
  const totalPages = Math.ceil(students.length / PAGE_SIZE);
  const paginatedStudents = students.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-8 animate-fade-in pb-16 font-sans">
      
      {/* Print styles */}
      <style>{`
        @media print {
          #root {
            display: none !important;
          }
          body {
            background-color: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #print-modal-overlay {
            background: transparent !important;
            backdrop-filter: none !important;
            padding: 0 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
          }
          #print-modal-container {
            box-shadow: none !important;
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            width: auto !important;
            max-width: none !important;
          }
          #print-controls, #print-help-footer {
            display: none !important;
          }
          #print-id-card-area {
            padding: 0 !important;
            background: transparent !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
          }
          #print-id-card-card {
            width: 280px !important;
            height: 420px !important;
            border: 2px solid #1f5f99 !important;
            border-radius: 16px !important;
            background-color: white !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-shadow: none !important;
            position: relative !important;
            overflow: hidden !important;
            margin: 0 auto !important;
            page-break-inside: avoid !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>




      
      {/* Header Banner */}
      <div className="gov-card p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="gov-eyebrow px-3.5 py-1.5 text-xs font-black uppercase tracking-widest flex items-center gap-1.5 w-max mb-3">
              <Users size={12} /> Student Management
            </span>
            <h1 className="gov-page-heading text-3xl md:text-4xl font-black">Students</h1>
            <p className="text-slate-600 text-sm mt-1.5 font-medium">
              Manage your students grouped by class/standard.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPromoteModal(true)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-[#f3eadc] border border-[#d8cfc0] rounded-xl text-slate-700 font-bold text-sm transition-all flex items-center gap-2 active:scale-95 self-start shadow-sm"
            >
              <Sparkles size={16} className="text-amber-500 animate-pulse" /> Bulk Promote
            </button>
            <button
              onClick={openAddModal}
              className="gov-btn-primary px-5 py-2.5 font-bold text-sm transition-all flex items-center gap-2 active:scale-95 self-start shadow-sm"
            >
              <Plus size={16} /> Add Student
            </button>
          </div>

        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Class Filter */}
        <div className="relative">
          <select
            value={selectedClass}
            onChange={(e) => { setSelectedClass(e.target.value); setCurrentPage(1); }}
            className="gov-field appearance-none px-4 py-2.5 pr-10 text-sm font-bold transition-all cursor-pointer min-w-[160px]"
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
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="gov-field w-full py-2.5 pl-10 pr-4 transition-all text-sm font-semibold"
          />
        </div>

        <div className="text-xs font-bold text-slate-400 ml-auto">
          {students.length} student{students.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {loadError && (
        <div className="gov-card border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
          {loadError}
        </div>
      )}

      {/* Students Table */}
      <div className="gov-card overflow-hidden">
        {isLoading ? (
          <TableSkeleton cols={6} rows={8} />
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
            <button onClick={openAddModal} className="gov-btn-primary mt-2 px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5">
              <Plus size={14} /> Add Student
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="gov-table-head text-[10px] uppercase font-black tracking-wider">
                    <th className="py-4 px-6 font-bold">Student</th>
                    <th className="py-4 px-6 font-bold">Student ID</th>
                    <th className="py-4 px-6 font-bold">Class & Gender</th>
                    <th className="py-4 px-6 font-bold">DOB & Contact</th>
                    <th className="py-4 px-6 font-bold">Address</th>
                    <th className="py-4 px-6 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-100 font-semibold text-slate-700">
                  {paginatedStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-[#f8fbfd] transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-white font-black text-sm shadow-sm">
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
                            onClick={() => navigate(`/institute/physical-tests?class=${student.class}&search=${encodeURIComponent(student.name)}`)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                            title="Enter Sports Marks & Attendance"
                          >
                            <Activity size={14} />
                          </button>
                          <button
                            onClick={() => setPrintStudentIdCard(student)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                            title="Print ID Card"
                          >
                            <Printer size={14} />
                          </button>
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

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={students.length}
              pageSize={PAGE_SIZE}
            />
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md p-4 animate-fade-in" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-150" onClick={e => e.stopPropagation()}>
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
        </div>,
        document.body
      )}

      {/* Add/Edit Student Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md p-4 animate-fade-in" onClick={() => { setShowModal(false); setEditingStudent(null); }}>
          <div className="no-scrollbar bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-150" onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="gov-panel-title p-6 relative overflow-hidden">
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <span className="gov-eyebrow px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest">
                    {editingStudent ? 'Edit Student' : 'New Student'}
                  </span>
                  <h3 className="text-lg font-black mt-1">{editingStudent ? 'Update Student Details' : 'Register New Student'}</h3>
                </div>
                <button onClick={() => { setShowModal(false); setEditingStudent(null); }} className="p-2 bg-white border border-[#d8cfc0] hover:bg-[#f3eadc] rounded-lg transition-all text-slate-600">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <input type="hidden" name="studentId" value={editingStudent ? editingStudent.studentId : autoId} readOnly />

              {/* Personal Info */}
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

              {/* Address Info */}
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
                <button type="submit" disabled={formLoading} className="gov-btn-primary px-6 py-2.5 text-xs font-black transition-all disabled:opacity-50 flex items-center gap-1.5">
                  {formLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  {formLoading ? 'Saving...' : (editingStudent ? 'Update Student' : 'Register Student')}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
      {/* Bulk Promotion Modal */}

      {showPromoteModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md p-4 animate-fade-in" onClick={() => setShowPromoteModal(false)}>
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-150" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Sparkles className="text-amber-500 w-5 h-5 animate-pulse" /> Bulk Promote Students
              </h3>
              <button onClick={() => setShowPromoteModal(false)} className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl transition-all text-slate-500">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleBulkPromote} className="space-y-4">
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Bulk promote all students from a source class/standard to a new target class/standard in one click.
              </p>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Source Class (From) *</label>
                <select 
                  value={promoteSourceClass} 
                  onChange={(e) => setPromoteSourceClass(e.target.value)} 
                  required 
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                >
                  <option value="">Select Class</option>
                  {STANDARDS.map(s => <option key={s} value={s}>Class {s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Target Class (To) *</label>
                <select 
                  value={promoteTargetClass} 
                  onChange={(e) => setPromoteTargetClass(e.target.value)} 
                  required 
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                >
                  <option value="">Select Class</option>
                  {STANDARDS.map(s => <option key={s} value={s}>Class {s}</option>)}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowPromoteModal(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={promoteLoading} className="gov-btn-primary px-5 py-2 text-xs font-black transition-all disabled:opacity-50 flex items-center gap-1.5">
                  {promoteLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  {promoteLoading ? 'Promoting...' : 'Promote Class'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Print ID Card Modal */}
      {printStudentIdCard && createPortal(
        <div id="print-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md p-4 animate-fade-in" onClick={() => setPrintStudentIdCard(null)}>
          <div id="print-modal-container" className="gov-card max-w-sm w-full relative flex flex-col justify-between overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            
            {/* Modal Header Controls */}
            <div id="print-controls" className="px-6 py-4 gov-panel-title flex justify-between items-center border-b border-[#e2d8c9] bg-[#fbf7ee]">
              <span className="font-extrabold text-xs tracking-wider uppercase flex items-center gap-2">
                <Printer size={16} className="text-secondary animate-pulse" /> Student ID Card
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-secondary hover:bg-blue-600 text-white px-3.5 py-1.5 rounded-lg text-[10px] font-black tracking-wide uppercase transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Printer size={12} /> Print Card
                </button>
                <button 
                  onClick={() => setPrintStudentIdCard(null)}
                  className="text-slate-600 hover:text-slate-900 text-[10px] font-black uppercase bg-white hover:bg-[#f3eadc] border border-[#d8cfc0] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Print ID Card Content Container */}
            <div className="p-8 bg-slate-100 flex justify-center items-center">
              <div id="print-id-card-area">
                <div 
                  id="print-id-card-card"
                  className="w-[280px] h-[420px] bg-white rounded-2xl border-2 border-secondary shadow-lg flex flex-col justify-between relative overflow-hidden font-sans select-none"
                >

                  {/* Government Trilayer Accent Header */}
                  <div className="h-2.5 w-full flex">
                    <div className="w-1/3 bg-[#ff9933]"></div>
                    <div className="w-1/3 bg-white"></div>
                    <div className="w-1/3 bg-[#138808]"></div>
                  </div>

                  {/* ID Card Branding */}
                  <div className="text-center pt-3 px-3">
                    <h3 className="text-xs font-black tracking-wide uppercase text-slate-800 mt-0.5">National Physical Fitness</h3>
                    <span className="text-[6px] text-slate-400 font-extrabold tracking-widest uppercase block mt-0.5">SportSphere Roster ID Card</span>
                  </div>

                  {/* Profile Photo Avatar */}
                  <div className="flex flex-col items-center mt-3">
                    <div className="w-20 h-20 rounded-full bg-secondary border-4 border-slate-50 flex items-center justify-center text-white font-black text-3xl shadow-md">
                      {printStudentIdCard.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="mt-2.5 px-3 py-1 bg-blue-50 text-secondary border border-blue-100 rounded-full text-[8px] font-black uppercase tracking-widest">
                      STUDENT ATHLETE
                    </span>
                  </div>

                  {/* Student Details Grid */}
                  <div className="px-5 mt-3 space-y-1.5 text-slate-700">
                    <div className="text-center mb-1">
                      <h4 className="text-sm font-black text-slate-900 leading-tight truncate">{printStudentIdCard.name}</h4>
                      <span className="text-[9px] font-bold font-mono text-slate-400">ID: {printStudentIdCard.studentId}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-1 text-[9px] font-bold border-t border-b border-slate-100 py-1.5">
                      <div>
                        <span className="text-[7px] text-slate-400 block uppercase">Standard</span>
                        <span className="text-slate-800 font-black">Class {printStudentIdCard.class}th</span>
                      </div>
                      <div>
                        <span className="text-[7px] text-slate-400 block uppercase">Gender</span>
                        <span className="text-slate-800 font-black">{printStudentIdCard.gender}</span>
                      </div>
                      <div>
                        <span className="text-[7px] text-slate-400 block uppercase">Date of Birth</span>
                        <span className="text-slate-800 font-black">{formatDate(printStudentIdCard.dob)}</span>
                      </div>
                      <div>
                        <span className="text-[7px] text-slate-400 block uppercase">Pincode</span>
                        <span className="text-slate-800 font-black">{printStudentIdCard.pincode}</span>
                      </div>
                    </div>

                    <div className="text-center pt-0.5">
                      <span className="text-[7px] text-slate-400 block uppercase leading-none">Institution</span>
                      <span className="text-slate-800 font-black text-[9px] truncate block leading-tight">{user.instituteName || "SportSphere Alliance"}</span>
                    </div>
                  </div>

                  {/* Barcode and Signature Footer */}
                  <div className="px-5 pb-3 pt-1 border-t border-slate-50 flex items-center justify-between mt-2">
                    {/* Pseudo Barcode */}
                    <div className="flex flex-col gap-[1px] justify-center h-5 w-20 bg-white">
                      <div className="flex gap-[1px] h-full items-stretch">
                        <div className="w-[1px] bg-slate-800"></div>
                        <div className="w-[2px] bg-slate-800"></div>
                        <div className="w-[1px] bg-slate-800"></div>
                        <div className="w-[3px] bg-slate-800"></div>
                        <div className="w-[1px] bg-slate-800"></div>
                        <div className="w-[2px] bg-slate-800"></div>
                        <div className="w-[4px] bg-slate-800"></div>
                        <div className="w-[1px] bg-slate-800"></div>
                        <div className="w-[2px] bg-slate-800"></div>
                        <div className="w-[1px] bg-slate-800"></div>
                      </div>
                      <span className="text-[5px] text-slate-400 font-mono tracking-widest leading-none mt-0.5 text-center">{printStudentIdCard.studentId}</span>
                    </div>

                    {/* Principal Sign */}
                    <div className="text-center">
                      <div className="h-3 font-signature text-secondary font-semibold text-[8px] italic select-none">
                        Dr. R. K. Patel
                      </div>
                      <div className="w-16 h-[0.5px] bg-slate-300 mx-auto my-0.5"></div>
                      <span className="text-[5px] text-slate-400 font-bold block uppercase tracking-wide">Issuing Authority</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Print Help Footer info */}
            <div id="print-help-footer" className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center text-[9px] text-slate-400 font-bold">
              Verification Card • SportSphere Assessment Roster
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default InstituteStudents;

