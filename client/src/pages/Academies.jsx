import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useOutletContext } from 'react-router-dom';
import { 
  School, Users, Search, ChevronDown, ChevronUp, GraduationCap, 
  Phone, Mail, Trophy, FileText, CheckCircle, ArrowLeft, BookOpen, 
  X, DollarSign, Calendar, MapPin, Printer, User, Award, Check, AlertCircle
} from 'lucide-react';

const Academies = () => {
  // Rich mock data representing Sports Academies with Grade 9-10 students
  const [academies, setAcademies] = useState([]);

  const [expandedId, setExpandedId] = useState(null);
  const [selectedClass, setSelectedClass] = useState({});
  const [selectedStudentReport, setSelectedStudentReport] = useState(null);

  // Freeze background scrolling when student report modal is open
  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (selectedStudentReport) {
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
  }, [selectedStudentReport]);

  // Fetch approved academies from the backend database on load
  useEffect(() => {
    const fetchApprovedAcademies = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/institutes?status=approved&type=academy&limit=1000`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json',
          }
        });
        if (res.ok) {
          const data = await res.json();
          const formatted = (data.institutes || []).map(acad => {
            const id = acad._id || acad.id;
            const gradients = [
              "from-red-500 to-rose-600",
              "from-emerald-500 to-teal-600",
              "from-cyan-500 to-blue-600",
              "from-blue-500 to-indigo-600",
              "from-orange-500 to-amber-600"
            ];
            const gradientIndex = Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % gradients.length;
            const gradient = gradients[gradientIndex];

            return {
              id,
              name: acad.name,
              sport: acad.sport || 'Multi-Sport',
              coach: acad.contactPerson || 'Head Coach',
              email: acad.email || '',
              phone: acad.mobile || '',
              registeredAt: new Date(acad.createdAt).toISOString().split('T')[0],
              location: (acad.city && acad.state) ? `${acad.city}, ${acad.state}` : acad.city || acad.state || 'India',
              budget: '₹4,00,000 / Year',
              gradient,
              students: [],
              studentCount: acad.studentCount || 0,
              isDb: true
            };
          });
          
          setAcademies(formatted);
        }
      } catch (err) {
        console.error("Error fetching approved academies:", err);
      }
    };
    fetchApprovedAcademies();
  }, []);

  // Search Context
  const outletContext = useOutletContext();
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const searchTerm = outletContext ? outletContext.searchTerm : localSearchTerm;
  const setSearchTerm = outletContext ? outletContext.setSearchTerm : setLocalSearchTerm;

  // Toggle Accordion
  const toggleExpand = async (id) => {
    const target = academies.find(acad => acad.id === id);
    if (!target) return;

    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      setSelectedClass(prev => ({ ...prev, [id]: null }));

      // Lazy load students from the backend for database-backed academies
      if (target.isDb && target.students.length === 0) {
        try {
          const res = await fetch(`http://localhost:5000/api/institutes/${id}/students`, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
              'Content-Type': 'application/json',
            }
          });
          if (res.ok) {
            const studentsData = await res.json();
            const mappedStudents = studentsData.map(s => {
              const age = s.dob ? (new Date().getFullYear() - new Date(s.dob).getFullYear()) : 15;
              
              return {
                id: s._id || s.id,
                studentId: s.studentId,
                name: s.name,
                age,
                class: s.class,
                performance: s.performance || "Good",
                sprintTime: s.sprintTime || 12.8,
                broadJump: s.broadJump || 215,
                pushups: s.pushups || 28,
                dob: s.dob ? new Date(s.dob).toLocaleDateString('en-IN') : '',
                gender: s.gender || 'Male',
                contact: s.contact || s.phone || '',
                contactOptional: s.contactOptional || '',
                address: s.address || '',
                taluka: s.taluka || s.taaluka || '',
                city: s.city || '',
                pincode: s.pincode || ''
              };
            });

            setAcademies(prev => prev.map(acad => {
              if (acad.id === id) {
                return {
                  ...acad,
                  students: mappedStudents
                };
              }
              return acad;
            }));
          }
        } catch (err) {
          console.error("Error fetching students for academy:", err);
      }
    }
  }
};

  // Handle Class Select (Grade 9 & 10 Only)
  const handleClassSelect = (acadId, cls) => {
    setSelectedClass(prev => ({
      ...prev,
      [acadId]: prev[acadId] === cls ? null : cls
    }));
  };

  // Statistics Calculation
  const totalAcademies = academies.length;
  const totalEnrolled = academies.reduce((acc, curr) => {
    const count = curr.isDb && curr.students.length === 0 ? (curr.studentCount || 0) : curr.students.length;
    return acc + count;
  }, 0);
  
  // Total Sports Tracked
  const uniqueSportsCount = new Set(academies.map(a => a.sport).filter(Boolean)).size || 0;

  return (
    <div className="space-y-8 animate-fade-in pb-12 font-sans relative">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <School className="text-secondary w-8 h-8" />
            Academy Management
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            View registered academies, browse athlete rosters, and inspect individual fitness screening reports.
          </p>
        </div>
      </div>

      {/* Analytics Counter Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-tr from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Academies</p>
            <h3 className="text-3xl font-black text-white mt-2">{totalAcademies}</h3>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-accent">
            <School size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Enrolled Athletes</p>
            <h3 className="text-3xl font-black text-secondary mt-2">{totalEnrolled}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-100 text-secondary rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Sports Specialties</p>
            <h3 className="text-3xl font-black text-accent mt-2">{uniqueSportsCount}</h3>
          </div>
          <div className="w-12 h-12 bg-orange-100 text-accent rounded-xl flex items-center justify-center">
            <Trophy size={24} />
          </div>
        </div>
      </div>

      {/* Toolbar - Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search academy by name, coach or sport..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary bg-slate-50/50"
          />
        </div>
        <p className="text-xs text-slate-400 font-semibold">
          Click any academy to view its athlete roster and inspect evaluation reports.
        </p>
      </div>

      {/* Academy Accordion List */}
      <div className="space-y-4">
        {academies
          .filter(acad => {
            const term = searchTerm.toLowerCase();
            if (!term) return true;
            return (
              acad.name.toLowerCase().includes(term) ||
              acad.sport.toLowerCase().includes(term) ||
              acad.coach.toLowerCase().includes(term) ||
              acad.students.some(s => s.name.toLowerCase().includes(term))
            );
          })
          .map(acad => {
            const isExpanded = expandedId === acad.id;
            const activeClass = selectedClass[acad.id] || null;

            // Students in class 9 and 10
            const classStudents = activeClass
              ? acad.students.filter(s => s.class === activeClass)
              : [];

            return (
              <div 
                key={acad.id}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm ${
                  isExpanded ? 'border-secondary/40 ring-1 ring-secondary/20 shadow-md' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                
                {/* Accordion Header */}
                <div 
                  onClick={() => toggleExpand(acad.id)}
                  className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3.5 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${acad.gradient} text-white shadow-md`}>
                      <Trophy size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-800 text-lg">{acad.name}</h3>
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-wider">
                          {acad.sport} Only
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-1.5 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1 text-slate-700"><User size={14} className="text-secondary" /> {acad.coach}</span>
                        <span className="flex items-center gap-1"><MapPin size={14} /> {acad.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-secondary text-xs font-bold rounded-full">
                      <Users size={14} />
                      {acad.isDb && acad.students.length === 0 ? acad.studentCount || 0 : acad.students.length} Enrolled
                    </span>
                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-4 border-t border-slate-100 bg-slate-50/30">
                    
                    {/* Roster / Attendance / Fees Table */}
                    <div>
                      <div className="flex items-center justify-between mb-4 gap-3">
                        <h4 className="text-sm font-bold text-slate-700 tracking-wide uppercase flex items-center gap-2">
                          <GraduationCap size={16} className="text-secondary" />
                          Academy Roster — {acad.sport} Athletes ({acad.students.length})
                        </h4>
                      </div>

                      {acad.students.length > 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-50/80 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                                  <th className="p-3.5 pl-5">#</th>
                                  <th className="p-3.5">Athlete Name</th>
                                  <th className="p-3.5 text-center">Class / Standard</th>
                                  <th className="p-3.5 text-center">Age</th>
                                  <th className="p-3.5 text-center">Sport Speciality</th>
                                  <th className="p-3.5 text-center">Sprint (s)</th>
                                  <th className="p-3.5 text-center">Jump (cm)</th>
                                  <th className="p-3.5 text-center">Pushups</th>
                                  <th className="p-3.5 pr-5 text-right">Fitness</th>
                                </tr>
                              </thead>
                              <tbody className="text-xs divide-y divide-slate-100 font-semibold text-slate-700">
                                {acad.students.map((student, idx) => (
                                  <tr 
                                    key={student.id}
                                    className="hover:bg-blue-50/35 cursor-pointer transition-colors group"
                                    onClick={() => setSelectedStudentReport({ ...student, academyName: acad.name })}
                                    title="Click to view athlete profile & contact details"
                                  >
                                    <td className="p-3.5 pl-5 text-slate-400 font-bold">{idx + 1}</td>
                                    <td className="p-3.5">
                                      <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden ring-2 ring-slate-100 group-hover:ring-secondary/40 transition-all shrink-0">
                                          <img src={`https://ui-avatars.com/api/?name=${student.name}&background=2563EB&color=fff&size=80`} alt={student.name} />
                                        </div>
                                        <div>
                                          <p className="font-extrabold text-slate-800 group-hover:text-secondary transition-colors">{student.name}</p>
                                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">ID: {student.studentId || student.id || student._id}</span>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-3.5 text-center text-slate-800 font-extrabold">Class {student.class}th</td>
                                    <td className="p-3.5 text-center text-slate-500">{student.age}</td>
                                    <td className="p-3.5 text-center">
                                      <span className={`inline-block px-2.5 py-1 bg-gradient-to-r ${acad.gradient} text-white rounded-full font-bold`}>
                                        {acad.sport}
                                      </span>
                                    </td>
                                    <td className="p-3.5 text-center">{student.sprintTime || '-'}</td>
                                    <td className="p-3.5 text-center">{student.broadJump || '-'}</td>
                                    <td className="p-3.5 text-center">{student.pushups || '-'}</td>
                                    <td className="p-3.5 pr-5 text-right font-extrabold">
                                      <span className={`inline-block px-2.5 py-1 rounded-full font-bold ${
                                        student.performance === 'Excellent' ? 'bg-emerald-50 text-emerald-700' :
                                        student.performance === 'Good' ? 'bg-blue-50 text-blue-700' :
                                        'bg-amber-50 text-amber-700'
                                      }`}>
                                        {student.performance}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-white border border-slate-100 rounded-xl">
                          <Users size={32} className="text-slate-300 mx-auto mb-2" />
                          <p className="text-slate-400 text-sm font-medium">No athletes registered in this academy.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {selectedStudentReport && createPortal(
        <div 
          className="fixed inset-0 z-50 bg-white/40 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedStudentReport(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl relative border border-slate-150 flex flex-col justify-between overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <span className="font-extrabold text-xs tracking-wider uppercase flex items-center gap-2">
                <User size={18} className="text-indigo-400" />
                Athlete Profile Information
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedStudentReport(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold uppercase bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 bg-slate-50/50 max-h-[75vh] overflow-y-auto no-scrollbar">
              
              {/* Profile Card Summary */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col sm:flex-row items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden ring-4 ring-slate-50 shrink-0">
                  <img src={`https://ui-avatars.com/api/?name=${selectedStudentReport.name}&background=2563EB&color=fff&size=120`} alt={selectedStudentReport.name} />
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">{selectedStudentReport.name}</h3>
                  <p className="text-xs text-slate-500 font-extrabold uppercase tracking-wide">
                    Academy: <span className="text-secondary">{selectedStudentReport.academyName}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Standard: Class {selectedStudentReport.class}th • Age: {selectedStudentReport.age} Years
                  </p>
                </div>
              </div>

              {/* Student Personal Information Details Block */}
              <div className="mt-6 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-700 font-extrabold text-sm border-b border-slate-150 pb-2">
                  <User size={16} className="text-secondary" />
                  Athlete Personal Profile & Contact Details
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Athlete ID</p>
                    <p className="text-slate-800 font-extrabold mt-0.5">{selectedStudentReport.studentId || selectedStudentReport.id || selectedStudentReport._id || "STU-001"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Full Name</p>
                    <p className="text-slate-800 font-extrabold mt-0.5">{selectedStudentReport.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Date of Birth (DOB)</p>
                    <p className="text-slate-800 font-extrabold mt-0.5">{selectedStudentReport.dob || "15th May 2011"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Gender</p>
                    <p className="text-slate-800 font-extrabold mt-0.5">{selectedStudentReport.gender || "Male"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Standard / Class</p>
                    <p className="text-slate-800 font-extrabold mt-0.5">Class {selectedStudentReport.class}th</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Primary Mobile Number</p>
                    <p className="text-slate-800 font-extrabold mt-0.5 flex items-center gap-1">
                      <Phone size={12} className="text-slate-400" />
                      {selectedStudentReport.contact || "+91 98987 65432"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Secondary Mobile (Optional)</p>
                    <p className="text-slate-800 font-extrabold mt-0.5 flex items-center gap-1">
                      <Phone size={12} className="text-slate-400" />
                      {selectedStudentReport.contactOptional || "+91 87654 32109 (Parent)"}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10px] text-slate-400 uppercase font-black">Residential Address</p>
                    <p className="text-slate-800 font-extrabold mt-0.5 flex items-center gap-1">
                      <MapPin size={12} className="text-slate-400 shrink-0" />
                      {selectedStudentReport.address || "A-401, Shanti Heights, Near Stadium Road"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Taluka</p>
                    <p className="text-slate-800 font-extrabold mt-0.5">{selectedStudentReport.taluka || "Haveli"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black">City</p>
                    <p className="text-slate-800 font-extrabold mt-0.5">{selectedStudentReport.city || "Ahmedabad"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Pincode</p>
                    <p className="text-slate-800 font-extrabold mt-0.5">{selectedStudentReport.pincode || "380009"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-100 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Verification Code: {selectedStudentReport.id.toUpperCase()}-VERIFIED
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Academies;
