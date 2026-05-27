import React, { useState, useEffect } from 'react';
import { ClipboardList, ChevronDown, Plus, Trash2, Upload, X, Loader2, Image, Check } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const STANDARDS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const TERMS = ['TERM-1', 'TERM-2', 'HALF-YEARLY', 'ANNUAL'];
const DEFAULT_SUBJECTS = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies'];

const InstituteTestPerformance = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [examName, setExamName] = useState('');
  const [term, setTerm] = useState('');
  const [subjects, setSubjects] = useState([{ subjectName: '', marks: '', maxMarks: '100' }]);
  const [marksheetFile, setMarksheetFile] = useState(null);
  const [marksheetPreview, setMarksheetPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [toast, setToast] = useState(null);

  const authHeaders = {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json',
  };

  // Fetch students when class changes
  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
      fetchRecords();
    } else {
      setStudents([]);
      setRecords([]);
    }
  }, [selectedClass]);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/institute-portal/students?class=${selectedClass}`, { headers: authHeaders });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (err) {
      console.error('Failed to fetch students');
    }
  };

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedClass) params.append('class', selectedClass);
      if (term) params.append('term', term);
      const res = await fetch(`${API_URL}/institute-portal/test-performance?${params.toString()}`, { headers: authHeaders });
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (err) {
      console.error('Failed to fetch records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass) fetchRecords();
  }, [term]);

  const addSubjectRow = () => {
    setSubjects([...subjects, { subjectName: '', marks: '', maxMarks: '100' }]);
  };

  const removeSubjectRow = (index) => {
    if (subjects.length <= 1) return;
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateSubject = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMarksheetFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setMarksheetPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setMarksheetPreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudent || !examName || !term || !selectedClass) {
      setToast({ message: 'Please fill all required fields', isError: true });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const validSubjects = subjects.filter(s => s.subjectName && s.marks);
    if (validSubjects.length === 0) {
      setToast({ message: 'Add at least one subject with marks', isError: true });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('studentId', selectedStudent);
      formData.append('class', selectedClass);
      formData.append('examName', examName);
      formData.append('term', term);
      formData.append('subjects', JSON.stringify(validSubjects.map(s => ({
        subjectName: s.subjectName,
        marks: Number(s.marks),
        maxMarks: Number(s.maxMarks) || 100
      }))));
      
      if (marksheetFile) {
        formData.append('marksheet', marksheetFile);
      }

      const res = await fetch(`${API_URL}/institute-portal/test-performance`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        body: formData,
      });

      if (res.ok) {
        setToast({ message: 'Test performance recorded successfully!', isError: false });
        setTimeout(() => setToast(null), 3000);
        // Reset form
        setSelectedStudent('');
        setExamName('');
        setSubjects([{ subjectName: '', marks: '', maxMarks: '100' }]);
        setMarksheetFile(null);
        setMarksheetPreview(null);
        fetchRecords();
      } else {
        const errData = await res.json();
        setToast({ message: errData.message || 'Failed to save', isError: true });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (err) {
      setToast({ message: 'Network error', isError: true });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.15),transparent)] pointer-events-none"></div>
        <div className="relative z-10">
          <span className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-black rounded-lg border border-emerald-400/20 uppercase tracking-widest flex items-center gap-1.5 w-max mb-3">
            <ClipboardList size={12} /> Test Performance
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Record Test Marks</h1>
          <p className="text-slate-400 text-sm mt-1.5 max-w-xl font-medium">
            Enter student test performance data class-wise with optional marksheet photo verification.
          </p>
        </div>
      </div>

      {/* Class & Term Selector */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all cursor-pointer min-w-[160px]"
          >
            <option value="">Select Class</option>
            {STANDARDS.map(s => <option key={s} value={s}>Class {s}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all cursor-pointer min-w-[160px]"
          >
            <option value="">All Terms</option>
            {TERMS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Hide Form' : 'Add Marks'}
        </button>
      </div>

      {/* Entry Form */}
      {showForm && selectedClass && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <ClipboardList size={16} className="text-emerald-600" />
              Enter Marks — Class {selectedClass}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Student Select */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Student *</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                >
                  <option value="">Select Student</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>{s.name} ({s.studentId})</option>
                  ))}
                </select>
              </div>

              {/* Exam Name */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Exam Name *</label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  placeholder="Unit Test 1"
                />
              </div>

              {/* Term */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Term *</label>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                >
                  <option value="">Select Term</option>
                  {TERMS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Subjects Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Subjects & Marks</label>
                <button
                  type="button"
                  onClick={addSubjectRow}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                >
                  <Plus size={14} /> Add Subject
                </button>
              </div>

              <div className="space-y-2">
                {subjects.map((sub, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <input
                        list="subject-suggestions"
                        value={sub.subjectName}
                        onChange={(e) => updateSubject(index, 'subjectName', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                        placeholder="Subject Name"
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        min="0"
                        value={sub.marks}
                        onChange={(e) => updateSubject(index, 'marks', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-center"
                        placeholder="Marks"
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-400">/</span>
                    <div className="w-20">
                      <input
                        type="number"
                        min="1"
                        value={sub.maxMarks}
                        onChange={(e) => updateSubject(index, 'maxMarks', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-center"
                        placeholder="Max"
                      />
                    </div>
                    {subjects.length > 1 && (
                      <button type="button" onClick={() => removeSubjectRow(index)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <datalist id="subject-suggestions">
                {DEFAULT_SUBJECTS.map(s => <option key={s} value={s} />)}
              </datalist>
            </div>

            {/* Marksheet Upload */}
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 block">
                Marksheet Photo (Optional)
              </label>
              <div className="flex items-start gap-4">
                <label className="flex-1 border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group">
                  <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={24} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                    <p className="text-xs font-semibold text-slate-400 group-hover:text-emerald-600">
                      {marksheetFile ? marksheetFile.name : 'Click to upload marksheet image or PDF'}
                    </p>
                  </div>
                </label>
                {marksheetPreview && (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                    <img src={marksheetPreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setMarksheetFile(null); setMarksheetPreview(null); }}
                      className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-black text-sm transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {isSubmitting ? 'Saving...' : 'Save Performance'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Records */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-800">
            Recorded Performance {selectedClass ? `— Class ${selectedClass}` : ''}
          </h3>
          <span className="text-xs font-bold text-slate-400">{records.length} records</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
          </div>
        ) : !selectedClass ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-center">
            <p className="text-sm font-bold">Select a class to view records</p>
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-center">
            <ClipboardList className="w-8 h-8 text-slate-200 mb-2" />
            <p className="text-sm font-bold text-slate-500">No records found</p>
            <p className="text-xs text-slate-400 mt-1">Start by adding test marks above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-wider border-b border-slate-100">
                  <th className="py-3 px-5 font-bold">Student</th>
                  <th className="py-3 px-5 font-bold">Exam</th>
                  <th className="py-3 px-5 font-bold">Term</th>
                  <th className="py-3 px-5 font-bold">Total</th>
                  <th className="py-3 px-5 font-bold">%</th>
                  <th className="py-3 px-5 font-bold">Grade</th>
                  <th className="py-3 px-5 font-bold">Marksheet</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100 font-semibold text-slate-700">
                {records.map((rec) => (
                  <tr key={rec._id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3 px-5 font-black text-slate-800">
                      {rec.studentId?.name || 'Unknown'}
                      <br />
                      <span className="text-[10px] text-slate-400 font-mono">{rec.studentId?.studentId}</span>
                    </td>
                    <td className="py-3 px-5">{rec.examName}</td>
                    <td className="py-3 px-5">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-black">{rec.term}</span>
                    </td>
                    <td className="py-3 px-5">{rec.totalMarks}/{rec.totalMaxMarks}</td>
                    <td className="py-3 px-5 font-black">{rec.percentage}%</td>
                    <td className="py-3 px-5">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                        rec.grade === 'A+' || rec.grade === 'A' ? 'bg-green-50 text-green-700' :
                        rec.grade === 'B+' || rec.grade === 'B' ? 'bg-blue-50 text-blue-700' :
                        rec.grade === 'C' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {rec.grade}
                      </span>
                    </td>
                    <td className="py-3 px-5">
                      {rec.marksheetImageUrl ? (
                        <a href={`http://localhost:5000${rec.marksheetImageUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors">
                          <Image size={12} /> View
                        </a>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 max-w-sm w-full rounded-2xl shadow-2xl border p-4 flex items-center gap-3 animate-fade-in-up ${
          toast.isError ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          {toast.isError ? <X size={16} className="text-red-500" /> : <Check size={16} className="text-emerald-500" />}
          <p className="text-sm font-bold">{toast.message}</p>
        </div>
      )}
    </div>
  );
};

export default InstituteTestPerformance;
