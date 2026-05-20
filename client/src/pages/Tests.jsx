import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  ClipboardList, Award, Upload, Image as ImageIcon, CheckCircle, 
  Trash2, User, Activity, Sparkles, ShieldAlert, FileText, Eye, Printer, ArrowUpDown, RefreshCw, Search 
} from 'lucide-react';
import axios from 'axios';

const Tests = () => {
  // Live students fetched from backend
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("10"); // Default standard select
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', title: '', isError: false });

  // Submissions list
  const [submissions, setSubmissions] = useState([
    {
      id: "sub-101",
      studentName: "John Doe",
      studentId: "STU-001",
      age: 16,
      class: "10",
      status: "Present",
      sprintTime: 11.8,
      broadJump: 210,
      pushups: 35,
      recommendedSport: "Athletics (Sprint)",
      manualReportData: "Excellent running form. High anaerobic thresholds observed. Muscle flexibility scores were exceptional. Suitable for track events.",
      reportHardCopyUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "sub-102",
      studentName: "Sarah Smith",
      studentId: "STU-002",
      age: 15,
      class: "9",
      status: "Present",
      sprintTime: 14.5,
      broadJump: 245,
      pushups: 22,
      recommendedSport: "Basketball",
      manualReportData: "Great vertical power. Lower body explosion is superior. Average cardiovascular recovery time. Exceptional hand-eye coordination.",
      reportHardCopyUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop"
    }
  ]);

  // Row input states mapping student ID to its evaluation inputs
  const [rowInputs, setRowInputs] = useState({});

  // Connect with global DashboardLayout search context
  const outletContext = useOutletContext();
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const searchTerm = outletContext ? outletContext.searchTerm : localSearchTerm;
  const setSearchTerm = outletContext ? outletContext.setSearchTerm : setLocalSearchTerm;

  const [sortBy, setSortBy] = useState("date"); 

  // Certificate / Lightbox State
  const [activeCertificate, setActiveCertificate] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  const triggerToast = (title, message, isError = false) => {
    setToast({ show: true, title, message, isError });
    setTimeout(() => {
      setToast({ show: false, title: '', message: '', isError: false });
    }, 4500);
  };

  // Fetch active students roster from database
  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
    } catch (error) {
      triggerToast("Roster Sync Alert", "Could not fetch students from MongoDB. Using local templates.", true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on standard and search term, sorting matches starting with query first!
  const filteredStudents = students
    .filter(
      (s) => s.class === selectedClass || s.class === parseInt(selectedClass)
    )
    .filter(
      (s) => s.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const term = searchTerm.toLowerCase();
      if (!term) return 0;
      const aStarts = a.name.toLowerCase().startsWith(term);
      const bStarts = b.name.toLowerCase().startsWith(term);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });

  // Initialize row inputs for the filtered class students
  useEffect(() => {
    const newInputs = { ...rowInputs };
    filteredStudents.forEach(student => {
      if (!newInputs[student._id]) {
        newInputs[student._id] = {
          status: "Present", // "Present" or "Absent"
          sprintTime: "",
          broadJump: "",
          pushups: "",
          manualReportData: "",
          photoPreview: null
        };
      }
    });
    setRowInputs(newInputs);
  }, [students, selectedClass]);

  // Update a specific field for a student's input row
  const updateRowField = (studentId, field, value) => {
    setRowInputs(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  // Reusable recommendation rule engine
  const getRowRecommendation = (studentId) => {
    const row = rowInputs[studentId];
    if (!row) return "Enter parameters...";
    
    const sprint = parseFloat(row.sprintTime);
    const jump = parseFloat(row.broadJump);
    const strength = parseInt(row.pushups);

    if (!sprint || !jump || !strength) return "Enter parameters...";

    if (sprint < 12.5 && jump > 220) {
      return "Athletics & Long Jump";
    } else if (jump > 230 && strength > 25) {
      return "Basketball & Volleyball";
    } else if (sprint < 13.5 && strength > 30) {
      return "Football & Hockey";
    } else if (strength > 35) {
      return "Gymnastics & Wrestling";
    } else {
      return "Cricket & General Sports";
    }
  };

  // Handle image upload with size & type constraints per row
  const handleRowPhotoChange = (studentId, e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        triggerToast("Invalid format", "Only JPG, PNG, and WEBP images are allowed.", true);
        e.target.value = "";
        return;
      }

      const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxSizeBytes) {
        triggerToast("File size alert", "The maximum allowed report image size is 5MB.", true);
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        updateRowField(studentId, "photoPreview", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit test for a single student row
  const handleSubmitRow = (studentId) => {
    const matchedStu = students.find(s => s._id === studentId);
    const row = rowInputs[studentId];

    if (!matchedStu || !row) return;

    if (row.status === "Absent") {
      // Mark as Absent
      const newSub = {
        id: `sub-${Date.now()}-${studentId}`,
        studentName: matchedStu.name,
        studentId: matchedStu.studentId || studentId.substring(0, 6).toUpperCase(),
        age: matchedStu.age,
        class: matchedStu.class,
        status: "Absent",
        sprintTime: "-",
        broadJump: "-",
        pushups: "-",
        recommendedSport: "N/A (Absent)",
        manualReportData: "Student was absent on evaluation day. No test parameters were recorded.",
        reportHardCopyUrl: null
      };

      setSubmissions([newSub, ...submissions]);
      triggerToast("Logged successfully", `${matchedStu.name} logged as ABSENT.`);
      return;
    }

    // "Present" evaluation validation
    if (!row.sprintTime || !row.broadJump || !row.pushups || !row.manualReportData || !row.photoPreview) {
      triggerToast("Missing details", "Please fill sprint, jump, pushups, observations, and hard-copy photo.", true);
      return;
    }

    const newSub = {
      id: `sub-${Date.now()}-${studentId}`,
      studentName: matchedStu.name,
      studentId: matchedStu.studentId || studentId.substring(0, 6).toUpperCase(),
      age: matchedStu.age,
      class: matchedStu.class,
      status: "Present",
      sprintTime: parseFloat(row.sprintTime),
      broadJump: parseFloat(row.broadJump),
      pushups: parseInt(row.pushups),
      recommendedSport: getRowRecommendation(studentId),
      manualReportData: row.manualReportData,
      reportHardCopyUrl: row.photoPreview
    };

    setSubmissions([newSub, ...submissions]);
    triggerToast("Logged successfully", `${matchedStu.name} physical test scores recorded successfully!`);
  };

  // Delete submission
  const deleteSubmission = (id) => {
    setSubmissions(submissions.filter(s => s.id !== id));
  };

  // Sorting Logic
  const sortedSubmissions = [...submissions].sort((a, b) => {
    if (sortBy === "sprint") {
      if (a.sprintTime === "-") return 1;
      if (b.sprintTime === "-") return -1;
      return a.sprintTime - b.sprintTime; // Fastest sprint first
    }
    if (sortBy === "jump") {
      if (a.broadJump === "-") return 1;
      if (b.broadJump === "-") return -1;
      return b.broadJump - a.broadJump; // Longest jump first
    }
    return b.id.localeCompare(a.id); // Newest first
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12 font-sans">
      
      {/* Print styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
            background: none !important;
          }
          #print-certificate-area, #print-certificate-area * {
            visibility: visible;
          }
          #print-certificate-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw !important;
            max-width: 100% !important;
            height: 100vh !important;
            border: 8px double #d4af37 !important;
            margin: 0 !important;
            padding: 3rem !important;
            box-shadow: none !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            page-break-inside: avoid;
            background-color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <ClipboardList className="text-secondary w-8 h-8 animate-pulse" />
          Physical Test Evaluation
        </h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Conduct bulk physical screening, view all class students inline, and log test parameters or mark absentees.
        </p>
      </div>

      {/* Select Standard / Class Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-1">Class / Standard Roster</h3>
          <p className="text-xs text-slate-400 font-semibold">Select a school grade standard to load all registered students in that class.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Real-time search input with starts-with prioritization */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search student by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/40 font-semibold bg-slate-50 text-slate-700"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/40 font-bold bg-slate-50 text-slate-700"
            >
              <option value="8">Standard 8th</option>
              <option value="9">Standard 9th</option>
              <option value="10">Standard 10th</option>
              <option value="11">Standard 11th</option>
            </select>

            <button 
              onClick={fetchStudents}
              className="p-2.5 text-slate-500 hover:text-secondary bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-100"
              title="Refresh Student Database"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Table Roster View */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
          <span className="font-extrabold text-xs tracking-wider uppercase flex items-center gap-2">
            <User size={16} className="text-accent" />
            Class {selectedClass}th Active Student Screening Sheet
          </span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-black">
            {filteredStudents.length} ROSTER
          </span>
        </div>

        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Student Info</th>
                  <th className="py-4 px-3 text-center">Status</th>
                  <th className="py-4 px-3 text-center w-24">Sprint (s)</th>
                  <th className="py-4 px-3 text-center w-24">Jump (cm)</th>
                  <th className="py-4 px-3 text-center w-24">Pushups</th>
                  <th className="py-4 px-4 w-52">Medical Observations / Report Photo</th>
                  <th className="py-4 px-4 text-center w-40">Recommended Sport</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredStudents.map((student) => {
                  const input = rowInputs[student._id] || {
                    status: "Present",
                    sprintTime: "",
                    broadJump: "",
                    pushups: "",
                    manualReportData: "",
                    photoPreview: null
                  };

                  const isAlreadyLogged = submissions.some(sub => sub.id.includes(student._id));

                  return (
                    <tr key={student._id} className={`hover:bg-slate-50/50 transition-colors ${input.status === 'Absent' ? 'bg-red-50/10' : ''}`}>
                      
                      {/* 1. Student Name and ID */}
                      <td className="py-4 px-6">
                        <p className="font-extrabold text-slate-800">{student.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                          ID: {student.studentId || "PENDING"} • Age: {student.age}
                        </p>
                      </td>

                      {/* 2. Attendance Status Pill */}
                      <td className="py-4 px-3 text-center">
                        {isAlreadyLogged ? (
                          <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg font-black uppercase text-[9px] border border-emerald-100 shadow-sm inline-block">
                            ✅ Logged
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => updateRowField(student._id, "status", input.status === "Present" ? "Absent" : "Present")}
                            className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm transition-all ${
                              input.status === "Present" 
                                ? 'bg-blue-50 text-secondary border border-blue-100 hover:bg-blue-100' 
                                : 'bg-red-50 text-red-500 border border-red-100 hover:bg-red-100'
                            }`}
                          >
                            {input.status}
                          </button>
                        )}
                      </td>

                      {/* 3. Sprint Input */}
                      <td className="py-4 px-3 text-center">
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="e.g. 12.5"
                          value={input.sprintTime}
                          onChange={(e) => updateRowField(student._id, "sprintTime", e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-center font-bold text-slate-700 disabled:opacity-40 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-secondary/20"
                          disabled={isAlreadyLogged || input.status === "Absent"}
                        />
                      </td>

                      {/* 4. Broad Jump Input */}
                      <td className="py-4 px-3 text-center">
                        <input 
                          type="number" 
                          placeholder="e.g. 210"
                          value={input.broadJump}
                          onChange={(e) => updateRowField(student._id, "broadJump", e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-center font-bold text-slate-700 disabled:opacity-40 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-secondary/20"
                          disabled={isAlreadyLogged || input.status === "Absent"}
                        />
                      </td>

                      {/* 5. Pushups Input */}
                      <td className="py-4 px-3 text-center">
                        <input 
                          type="number" 
                          placeholder="e.g. 25"
                          value={input.pushups}
                          onChange={(e) => updateRowField(student._id, "pushups", e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-center font-bold text-slate-700 disabled:opacity-40 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-secondary/20"
                          disabled={isAlreadyLogged || input.status === "Absent"}
                        />
                      </td>

                      {/* 6. Text observations notes & Upload Photo */}
                      <td className="py-4 px-4 space-y-2">
                        <textarea
                          rows="1"
                          placeholder="Manual observations..."
                          value={input.manualReportData}
                          onChange={(e) => updateRowField(student._id, "manualReportData", e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg disabled:opacity-40 disabled:bg-slate-100 text-[10px] font-semibold focus:outline-none focus:ring-2 focus:ring-secondary/20"
                          disabled={isAlreadyLogged || input.status === "Absent"}
                        ></textarea>

                        {input.status === "Present" && !isAlreadyLogged && (
                          <div className="flex items-center gap-2">
                            {input.photoPreview ? (
                              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                                <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-1">
                                  <CheckCircle size={10} /> Photo OK
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateRowField(student._id, "photoPreview", null)}
                                  className="text-red-500 font-bold hover:underline text-[9px]"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <div className="relative overflow-hidden cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg py-1 px-2 flex items-center justify-center gap-1">
                                <Upload size={10} className="text-slate-500" />
                                <span className="text-[9px] text-slate-600 font-bold">Upload Report (Hardcopy)</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                  onChange={(e) => handleRowPhotoChange(student._id, e)}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* 7. Recommended Sport Badge */}
                      <td className="py-4 px-4 text-center">
                        <span className={`px-2 py-1 rounded-lg font-bold text-[10px] inline-block ${
                          input.status === 'Absent' ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {input.status === 'Absent' ? "Absent" : getRowRecommendation(student._id)}
                        </span>
                      </td>

                      {/* 8. Submit row actions */}
                      <td className="py-4 px-6 text-center">
                        {isAlreadyLogged ? (
                          <span className="text-[10px] text-slate-400 font-bold">Recorded</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSubmitRow(student._id)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm transition-all ${
                              input.status === "Present" 
                                ? 'bg-secondary hover:bg-blue-600 text-white shadow-blue-500/10' 
                                : 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/10'
                            }`}
                          >
                            {input.status === "Present" ? "Save Test" : "Mark Absent"}
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs font-semibold">
            No registered students currently exist in the database for Class {selectedClass}th.
          </div>
        )}
      </div>

      {/* History and Certificate Feed Area */}
      <div className="space-y-4">
        
        {/* Header & Sorting Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
            <FileText className="text-secondary w-5 h-5" />
            Evaluated Sports Selection Records ({submissions.length})
          </h3>
          
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-bold text-slate-500 self-start sm:self-auto select-none shrink-0 border border-slate-200">
            <span className="flex items-center gap-1 pl-1"><ArrowUpDown size={12} /> Sort:</span>
            <button 
              onClick={() => setSortBy("date")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                sortBy === "date" ? "bg-white text-secondary shadow-sm" : "hover:text-slate-800"
              }`}
            >
              Date
            </button>
            <button 
              onClick={() => setSortBy("sprint")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                sortBy === "sprint" ? "bg-white text-secondary shadow-sm" : "hover:text-slate-800"
              }`}
            >
              Sprint (⚡)
            </button>
            <button 
              onClick={() => setSortBy("jump")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                sortBy === "jump" ? "bg-white text-secondary shadow-sm" : "hover:text-slate-800"
              }`}
            >
              Broad Jump
            </button>
          </div>
        </div>

        {/* List layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedSubmissions.map((sub) => (
            <div key={sub.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
              
              {/* Header: Student Profile */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-secondary font-bold">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-base">{sub.studentName}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                      ID: {sub.studentId} • Class {sub.class}th • Age {sub.age}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {sub.status === "Present" && (
                    <button
                      onClick={() => setActiveCertificate(sub)}
                      title="Print Certificate / Endorsement"
                      className="text-slate-500 hover:text-secondary hover:bg-blue-50 p-2 rounded-lg transition-all"
                    >
                      <Printer size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteSubmission(sub.id)}
                    title="Delete Entry"
                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Status Badge */}
              <div className="my-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                  sub.status === 'Absent' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                }`}>
                  {sub.status === 'Absent' ? '🔴 ABSENT' : '🟢 PRESENT'}
                </span>
              </div>

              {/* Score Badges */}
              {sub.status === "Present" && (
                <div className="grid grid-cols-3 gap-3 my-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">50m Sprint</p>
                    <p className="font-extrabold text-slate-800 text-sm mt-0.5">{sub.sprintTime}s</p>
                  </div>
                  <div className="text-center border-x border-slate-200">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Broad Jump</p>
                    <p className="font-extrabold text-slate-800 text-sm mt-0.5">{sub.broadJump}cm</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Pushups</p>
                    <p className="font-extrabold text-slate-800 text-sm mt-0.5">{sub.pushups}</p>
                  </div>
                </div>
              )}

              {/* Body Content */}
              <div className="space-y-3">
                
                {/* Dynamic sport label */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Perfect Sport Selection</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg border shadow-sm ${
                      sub.status === 'Absent' ? 'bg-slate-50 text-slate-400 border-slate-150' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      <Award size={14} className={sub.status === 'Absent' ? 'text-slate-400' : 'text-emerald-500'} />
                      {sub.recommendedSport}
                    </span>
                  </div>
                </div>

                {/* Manual report data comments */}
                <div className="text-xs font-medium text-slate-600 leading-relaxed border-l-2 border-slate-200 pl-3">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Manual Health Report Notes</span>
                  {sub.manualReportData}
                </div>

                {/* Report photo view link */}
                {sub.reportHardCopyUrl && (
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Report Hard Copy Proof</span>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveCertificate(sub)}
                        className="flex items-center gap-1 bg-slate-50 text-slate-600 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border border-slate-150"
                      >
                        <Printer size={12} /> Certificate
                      </button>
                      <button
                        onClick={() => setActiveImage(sub.reportHardCopyUrl)}
                        className="flex items-center gap-1 bg-blue-50 text-secondary hover:bg-secondary hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                      >
                        <Eye size={12} /> View Hard Copy
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Reusable Toast Notifications */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-4 bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl animate-fade-in-up max-w-sm border border-slate-800 border-l-4 ${toast.isError ? 'border-red-500' : 'border-emerald-500'}`}>
          <div className={`flex items-center justify-center rounded-full p-2.5 ${toast.isError ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
            {toast.isError ? (
              <ShieldAlert size={20} className="animate-bounce" />
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            )}
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 tracking-wide">{toast.title}</h4>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveImage(null)}
        >
          <div 
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full border border-white/20 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <span className="font-extrabold text-sm tracking-wide uppercase flex items-center gap-2">
                <ImageIcon size={18} className="text-accent" /> Hard Copy Document Proof
              </span>
              <button 
                onClick={() => setActiveImage(null)}
                className="text-slate-400 hover:text-white font-black text-sm uppercase bg-white/10 hover:bg-white/25 px-2.5 py-1.5 rounded-xl transition-all"
              >
                ✕ Close
              </button>
            </div>

            <div className="bg-slate-950 aspect-video flex items-center justify-center p-4">
              <img src={activeImage} alt="Document Proof" className="max-h-[400px] w-auto object-contain rounded-xl shadow-2xl border border-white/5" />
            </div>

            <div className="p-4 bg-slate-50 text-center text-[10px] text-slate-500 font-semibold">
              Authentic Report Hardcopy Document Uploaded by Institution
            </div>
          </div>
        </div>
      )}

      {/* Printable Endorsement Certificate */}
      {activeCertificate && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveCertificate(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl relative border border-white/10 flex flex-col justify-between overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <span className="font-extrabold text-xs tracking-wider uppercase flex items-center gap-2">
                <Award size={18} className="text-accent animate-pulse" /> Official Endorsement Certificate
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-accent hover:bg-orange-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/10"
                >
                  <Printer size={14} /> Print / Save PDF
                </button>
                <button 
                  onClick={() => setActiveCertificate(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold uppercase bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-all"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-100/50">
              <div 
                id="print-certificate-area"
                className="bg-white border-[12px] border-double border-amber-800/80 p-8 md:p-12 text-center rounded-2xl relative shadow-inner overflow-hidden select-none"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-slate-100/20 border border-slate-200/40 pointer-events-none flex items-center justify-center text-slate-100/10 font-bold select-none text-[150px] scale-150">
                  ⚡
                </div>

                <div className="space-y-1.5 mb-6 relative">
                  <span className="text-[10px] font-black text-amber-600 tracking-[0.25em] uppercase">SportSphere Athletic Alliance</span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Endorsement Certificate</h2>
                  <div className="w-24 h-0.5 bg-amber-500 mx-auto mt-2"></div>
                </div>

                <div className="space-y-4 relative z-10">
                  <p className="text-xs text-slate-500 italic font-semibold">
                    This official document certifies that the named student has undergone a full physical screening evaluation.
                  </p>
                  
                  <div className="my-6">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ATHLETE IDENTIFICATION</p>
                    <h3 className="text-xl font-black text-secondary mt-1 tracking-wide">{activeCertificate.studentName}</h3>
                    <p className="text-xs font-bold text-slate-700 mt-1">
                      Standard: Class {activeCertificate.class}th • Age: {activeCertificate.age} Years • ID: {activeCertificate.studentId}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border border-slate-200/80 rounded-xl p-3 bg-slate-50/50 max-w-sm mx-auto">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">50m Sprint</p>
                      <p className="font-extrabold text-slate-800 text-sm">{activeCertificate.sprintTime}s</p>
                    </div>
                    <div className="border-x border-slate-200">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Broad Jump</p>
                      <p className="font-extrabold text-slate-800 text-sm">{activeCertificate.broadJump}cm</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Pushups</p>
                      <p className="font-extrabold text-slate-800 text-sm">{activeCertificate.pushups}</p>
                    </div>
                  </div>

                  <div className="my-6">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">OFFICIAL SPORT ENDORSEMENT</p>
                    <div className="inline-block bg-emerald-500 text-white font-black text-sm tracking-wide uppercase px-6 py-2 rounded-xl mt-1.5 shadow-md shadow-emerald-500/25">
                      {activeCertificate.recommendedSport}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12 pt-8 border-t border-slate-100 mt-8 relative">
                  <div>
                    <div className="h-6 font-signature text-amber-700 font-semibold text-sm italic select-none">
                      Dr. R. K. Patel
                    </div>
                    <div className="w-full h-px bg-slate-300 mx-auto my-1"></div>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Board Chairman</p>
                  </div>
                  <div>
                    <div className="h-6 font-signature text-secondary font-semibold text-sm italic select-none">
                      Coach Arthur
                    </div>
                    <div className="w-full h-px bg-slate-300 mx-auto my-1"></div>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Athletic Director</p>
                  </div>
                </div>

              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400 font-bold">
              Verification Code: {activeCertificate.id.toUpperCase()} • Generated Automatically
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Tests;
