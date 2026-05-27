import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  ClipboardList, Award, Upload, Image as ImageIcon, CheckCircle, 
  Trash2, User, Activity, Sparkles, ShieldAlert, FileText, Eye, Printer, ArrowUpDown, RefreshCw, Search 
} from 'lucide-react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const calculateAge = (dobString) => {
  if (!dobString) return 0;
  const dob = new Date(dobString);
  const diffMs = Date.now() - dob.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const Tests = () => {
  // Live students fetched from backend
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("10"); // Default standard select
  const [selectedTerm, setSelectedTerm] = useState("TERM-2"); // Default evaluation term
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', title: '', isError: false });

  // Submissions list
  const [submissions, setSubmissions] = useState([
    {
      id: "sub-101",
      studentName: "John Doe",
      studentId: "STU801XYZ1",
      age: 15,
      class: "9",
      status: "Present",
      ageGroup: 2,
      height: 168,
      weight: 60,
      bmi: 21.3,
      partialCurlUp: 28,
      pushups: 35,
      sitAndReach: 22.5,
      runWalk600m: "2:30",
      run50m: 7.9,
      recommendedSport: "Football, Basketball & Hockey",
      manualReportData: "Excellent running form. High anaerobic thresholds observed. Suitable for track events.",
      reportHardCopyUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "sub-102",
      studentName: "Aarav Sharma",
      studentId: "STU501XYZ0",
      age: 7,
      class: "2",
      status: "Present",
      ageGroup: 1,
      height: 122,
      weight: 23,
      bmi: 15.5,
      plateTapping: 11.5,
      flamingoBalance: 18,
      recommendedSport: "Gymnastics & Ballet (High Balance & Coordination)",
      manualReportData: "Great balance and coordination during flamingo test. Very agile for age.",
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

  // Fetch active students and existing test screenings from database
  const fetchStudentsAndSubmissions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const studentRes = await axios.get(`${API_URL}/institute-portal/students`, { headers });
      const dbStudentsData = studentRes.data || [];
      setStudents(dbStudentsData);

      const perfRes = await axios.get(`${API_URL}/performance?term=${selectedTerm}`, { headers });
      const dbPerfs = perfRes.data || [];

      // Convert DB performances to submissions format
      const loadedSubmissions = dbPerfs.map(p => {
        const student = p.studentId || {};
        return {
          id: p._id,
          studentName: student.name || "Unknown Student",
          studentId: student.studentId || p.studentId?._id?.substring(0, 6).toUpperCase(),
          age: calculateAge(student.dob),
          class: student.class?.toString(),
          status: p.status || "Present",
          ageGroup: p.ageGroup || 2,
          height: p.height || "-",
          weight: p.weight || "-",
          bmi: p.bmi || "-",
          plateTapping: p.plateTapping || null,
          flamingoBalance: p.flamingoBalance || null,
          partialCurlUp: p.partialCurlUp || null,
          pushups: p.pushups || null,
          sitAndReach: p.sitAndReach || null,
          runWalk600m: p.runWalk600m || null,
          run50m: p.run50m || null,
          recommendedSport: p.recommendedSport || "N/A",
          manualReportData: p.manualReportData || "",
          reportHardCopyUrl: p.reportHardCopyUrl || null
        };
      });

      // Combine mock + loaded submissions
      setSubmissions(prev => {
        // Keep mock templates if no db override, filter out any duplicates by ID
        const filteredPrev = prev.filter(s => s.id.startsWith('sub-') && !dbPerfs.some(dp => dp._id === s.id));
        return [...loadedSubmissions, ...filteredPrev];
      });
    } catch (error) {
      triggerToast("Roster Sync Alert", "Could not fetch data from MongoDB. Using local templates.", true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsAndSubmissions();
  }, [selectedTerm]);

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
          height: "",
          weight: "",
          plateTapping: "",
          flamingoBalance: "",
          partialCurlUp: "",
          pushups: "",
          sitAndReach: "",
          runWalk600m: "",
          run50m: "",
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
    const student = students.find(s => s._id === studentId);
    const row = rowInputs[studentId];
    if (!student || !row) return "Enter parameters...";

    const age = calculateAge(student.dob);
    const isGroup1 = age >= 5 && age <= 8;

    if (isGroup1) {
      const tapping = parseFloat(row.plateTapping);
      const flamingo = parseFloat(row.flamingoBalance);
      if (!tapping || !flamingo) return "Enter parameters...";
      
      if (tapping < 12 && flamingo > 15) {
        return "Gymnastics & Ballet (High Balance & Coordination)";
      } else {
        return "General Athletics & Coordination Drills";
      }
    } else {
      const curlup = parseInt(row.partialCurlUp);
      const pushups = parseInt(row.pushups);
      const sitReach = parseFloat(row.sitAndReach);
      const run600 = parseFloat(row.runWalk600m);
      const run50 = parseFloat(row.run50m);

      if (!curlup || !pushups || !sitReach || !run600 || !run50) return "Enter parameters...";

      if (run50 < 8.0 && run600 < 120) {
        return "Athletics (Track & Field)";
      } else if (pushups > 25 && curlup > 25) {
        return "Gymnastics, Wrestling & Combat Sports";
      } else if (sitReach > 25 && run50 < 9.0) {
        return "Badminton, Tennis & Agility Sports";
      } else if (run600 < 140) {
        return "Football, Basketball & Hockey";
      } else {
        return "Cricket, Archery & Shooting";
      }
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
  const handleSubmitRow = async (studentId) => {
    const matchedStu = students.find(s => s._id === studentId);
    const row = rowInputs[studentId];

    if (!matchedStu || !row) return;

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const age = calculateAge(matchedStu.dob);
    const isGroup1 = age >= 5 && age <= 8;

    let payload = {
      studentId: studentId,
      term: selectedTerm,
      status: row.status,
      manualReportData: row.manualReportData || "",
      reportHardCopyUrl: row.photoPreview || ""
    };

    if (row.status === "Absent") {
      // Mark as Absent
    } else {
      if (isGroup1) {
        if (!row.height || !row.weight || !row.plateTapping || !row.flamingoBalance || !row.manualReportData || !row.photoPreview) {
          triggerToast("Missing details", "Please fill height, weight, plate tapping, flamingo balance, observations, and photo proof.", true);
          return;
        }
        payload.height = parseFloat(row.height);
        payload.weight = parseFloat(row.weight);
        payload.plateTapping = parseFloat(row.plateTapping);
        payload.flamingoBalance = parseFloat(row.flamingoBalance);
      } else {
        if (!row.height || !row.weight || !row.partialCurlUp || !row.pushups || !row.sitAndReach || !row.runWalk600m || !row.run50m || !row.manualReportData || !row.photoPreview) {
          triggerToast("Missing details", "Please fill height, weight, curl-up, pushups, sit & reach, 600m run, 50m sprint, observations, and photo proof.", true);
          return;
        }
        payload.height = parseFloat(row.height);
        payload.weight = parseFloat(row.weight);
        payload.partialCurlUp = parseInt(row.partialCurlUp);
        payload.pushups = parseInt(row.pushups);
        payload.sitAndReach = parseFloat(row.sitAndReach);
        payload.runWalk600m = row.runWalk600m;
        payload.run50m = parseFloat(row.run50m);
      }
    }

    try {
      setIsLoading(true);
      const res = await axios.post(`${API_URL}/performance`, payload, { headers });
      const savedPerf = res.data;

      const newSub = {
        id: savedPerf._id,
        studentName: matchedStu.name,
        studentId: matchedStu.studentId || studentId.substring(0, 6).toUpperCase(),
        age,
        class: matchedStu.class,
        status: savedPerf.status,
        ageGroup: savedPerf.ageGroup,
        height: savedPerf.height || "-",
        weight: savedPerf.weight || "-",
        bmi: savedPerf.bmi || "-",
        plateTapping: savedPerf.plateTapping || null,
        flamingoBalance: savedPerf.flamingoBalance || null,
        partialCurlUp: savedPerf.partialCurlUp || null,
        pushups: savedPerf.pushups || null,
        sitAndReach: savedPerf.sitAndReach || null,
        runWalk600m: savedPerf.runWalk600m || null,
        run50m: savedPerf.run50m || null,
        recommendedSport: savedPerf.recommendedSport,
        manualReportData: savedPerf.manualReportData,
        reportHardCopyUrl: savedPerf.reportHardCopyUrl
      };

      setSubmissions(prev => {
        // Remove old submission for same student to avoid duplicates
        const filtered = prev.filter(s => s.id !== savedPerf._id && !s.id.includes(studentId));
        return [newSub, ...filtered];
      });

      triggerToast("Logged successfully", `${matchedStu.name} physical test scores recorded successfully!`);
    } catch (error) {
      triggerToast("Save Error", error.response?.data?.message || "Failed to save physical test scores.", true);
    } finally {
      setIsLoading(false);
    }
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

            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/40 font-bold bg-slate-50 text-slate-700"
            >
              <option value="TERM-1">Term 1</option>
              <option value="TERM-2">Term 2</option>
            </select>

            <button 
              onClick={fetchStudentsAndSubmissions}
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
                  <th className="py-4 px-6 w-1/4">Student Info</th>
                  <th className="py-4 px-3 text-center w-[12%]">Status</th>
                  <th className="py-4 px-4 w-1/2">Fitness Test Parameters & Evaluation</th>
                  <th className="py-4 px-6 text-center w-[13%]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredStudents.map((student) => {
                  const input = rowInputs[student._id] || {
                    status: "Present",
                    height: "",
                    weight: "",
                    plateTapping: "",
                    flamingoBalance: "",
                    partialCurlUp: "",
                    pushups: "",
                    sitAndReach: "",
                    runWalk600m: "",
                    run50m: "",
                    manualReportData: "",
                    photoPreview: null
                  };

                  const isAlreadyLogged = submissions.some(sub => sub.id.includes(student._id));
                  const age = calculateAge(student.dob);
                  const ageGroup = (age >= 5 && age <= 8) ? 1 : 2;

                  const heightNum = parseFloat(input.height);
                  const weightNum = parseFloat(input.weight);
                  const bmiVal = (heightNum && weightNum) ? (weightNum / ((heightNum / 100) * (heightNum / 100))).toFixed(1) : "—";

                  return (
                    <tr key={student._id} className={`hover:bg-slate-50/50 transition-colors ${input.status === 'Absent' ? 'bg-red-50/10' : ''}`}>
                      
                      {/* 1. Student Name and ID */}
                      <td className="py-4 px-6">
                        <p className="font-extrabold text-slate-800">{student.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                          ID: {student.studentId || "PENDING"} • Age: {age} Yrs ({student.gender})
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

                      {/* 3. Dynamic Test Parameter Form Column */}
                      <td className="py-4 px-4">
                        {input.status === "Absent" ? (
                          <div className="text-center text-slate-400 text-xs italic font-semibold py-4">
                            Student is marked ABSENT. No parameters needed.
                          </div>
                        ) : isAlreadyLogged ? (
                          // Render saved details
                          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                Saved Test Scores ({submissions.find(s => s.id.includes(student._id))?.ageGroup === 1 ? "Group 1: 5-8 yrs" : "Group 2: 9-18 yrs"})
                              </span>
                              <span className="text-xs font-black text-slate-700">
                                BMI: {submissions.find(s => s.id.includes(student._id))?.bmi}
                              </span>
                            </div>
                            {submissions.find(s => s.id.includes(student._id))?.ageGroup === 1 ? (
                              <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase">Height / Weight</p>
                                  <p className="font-extrabold text-slate-700 mt-0.5">
                                    {submissions.find(s => s.id.includes(student._id))?.height}cm / {submissions.find(s => s.id.includes(student._id))?.weight}kg
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase">Coordination (Plate Tap)</p>
                                  <p className="font-extrabold text-slate-700 mt-0.5">{submissions.find(s => s.id.includes(student._id))?.plateTapping}s</p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase">Balancing (Flamingo)</p>
                                  <p className="font-extrabold text-slate-700 mt-0.5">{submissions.find(s => s.id.includes(student._id))?.flamingoBalance}s</p>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center">
                                <div>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase">Height/Weight</p>
                                  <p className="font-extrabold text-slate-700 mt-0.5">
                                    {submissions.find(s => s.id.includes(student._id))?.height}cm/{submissions.find(s => s.id.includes(student._id))?.weight}kg
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase font-sans">Partial Curl-up</p>
                                  <p className="font-extrabold text-slate-700 mt-0.5">{submissions.find(s => s.id.includes(student._id))?.partialCurlUp}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">
                                    {student.gender === 'Female' ? 'Mod. Pushups' : 'Pushups'}
                                  </p>
                                  <p className="font-extrabold text-slate-700 mt-0.5">{submissions.find(s => s.id.includes(student._id))?.pushups}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase">Sit & Reach</p>
                                  <p className="font-extrabold text-slate-700 mt-0.5">{submissions.find(s => s.id.includes(student._id))?.sitAndReach}cm</p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase">600m Run</p>
                                  <p className="font-extrabold text-slate-700 mt-0.5">{submissions.find(s => s.id.includes(student._id))?.runWalk600m}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase font-sans">50m Run</p>
                                  <p className="font-extrabold text-slate-700 mt-0.5">{submissions.find(s => s.id.includes(student._id))?.run50m}s</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          // Render form inputs based on age
                          <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-4">
                            {/* Header showing age and group */}
                            <div className="flex justify-between items-center">
                              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg text-[9px] font-black uppercase tracking-wider">
                                {ageGroup === 1 ? "Group 1: 5-8 Years" : "Group 2: 9-18 Years"}
                              </span>
                              <span className="text-[10px] font-black text-slate-500">
                                Calculated BMI: <strong className="text-slate-800">{bmiVal}</strong>
                              </span>
                            </div>

                            {ageGroup === 1 ? (
                              /* Group 1 Fields */
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div>
                                  <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Height (cm) *</label>
                                  <input 
                                    type="number" 
                                    placeholder="e.g. 115"
                                    value={input.height}
                                    onChange={(e) => updateRowField(student._id, "height", e.target.value)}
                                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary/20"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Weight (kg) *</label>
                                  <input 
                                    type="number" 
                                    placeholder="e.g. 21"
                                    value={input.weight}
                                    onChange={(e) => updateRowField(student._id, "weight", e.target.value)}
                                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary/20"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 leading-none">Plate Tapping (s) *</label>
                                  <input 
                                    type="number" 
                                    step="0.1"
                                    placeholder="e.g. 14.5"
                                    value={input.plateTapping}
                                    onChange={(e) => updateRowField(student._id, "plateTapping", e.target.value)}
                                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary/20"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 leading-none">Flamingo Bal. (s) *</label>
                                  <input 
                                    type="number" 
                                    placeholder="e.g. 12"
                                    value={input.flamingoBalance}
                                    onChange={(e) => updateRowField(student._id, "flamingoBalance", e.target.value)}
                                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary/20"
                                  />
                                </div>
                              </div>
                            ) : (
                              /* Group 2 Fields */
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                  <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Height (cm) *</label>
                                    <input 
                                      type="number" 
                                      placeholder="e.g. 165"
                                      value={input.height}
                                      onChange={(e) => updateRowField(student._id, "height", e.target.value)}
                                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary/20"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Weight (kg) *</label>
                                    <input 
                                      type="number" 
                                      placeholder="e.g. 52"
                                      value={input.weight}
                                      onChange={(e) => updateRowField(student._id, "weight", e.target.value)}
                                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary/20"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 leading-none">Partial Curl-up *</label>
                                    <input 
                                      type="number" 
                                      placeholder="e.g. 20"
                                      value={input.partialCurlUp}
                                      onChange={(e) => updateRowField(student._id, "partialCurlUp", e.target.value)}
                                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary/20"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                  <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 leading-none">
                                      {student.gender === 'Female' ? 'Mod. Pushups *' : 'Pushups *'}
                                    </label>
                                    <input 
                                      type="number" 
                                      placeholder="e.g. 25"
                                      value={input.pushups}
                                      onChange={(e) => updateRowField(student._id, "pushups", e.target.value)}
                                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary/20"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 leading-none">Sit & Reach (cm) *</label>
                                    <input 
                                      type="number" 
                                      placeholder="e.g. 18"
                                      value={input.sitAndReach}
                                      onChange={(e) => updateRowField(student._id, "sitAndReach", e.target.value)}
                                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary/20"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 leading-none">600m Run/Walk *</label>
                                    <input 
                                      type="text" 
                                      placeholder="e.g. 2:45"
                                      value={input.runWalk600m}
                                      onChange={(e) => updateRowField(student._id, "runWalk600m", e.target.value)}
                                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary/20"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 leading-none">50m Run (s) *</label>
                                    <input 
                                      type="number" 
                                      step="0.01"
                                      placeholder="e.g. 8.5"
                                      value={input.run50m}
                                      onChange={(e) => updateRowField(student._id, "run50m", e.target.value)}
                                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary/20"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Medical Notes & Photo Proof */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-200/40">
                              <div className="flex-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Observations *</label>
                                <input 
                                  type="text"
                                  placeholder="Enter general health or posture observations..."
                                  value={input.manualReportData}
                                  onChange={(e) => updateRowField(student._id, "manualReportData", e.target.value)}
                                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-secondary/20"
                                />
                              </div>
                              <div className="sm:w-56 flex flex-col justify-end">
                                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Hardcopy Photo *</label>
                                {input.photoPreview ? (
                                  <div className="flex items-center justify-between bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg h-9">
                                    <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
                                      ✓ Uploaded
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => updateRowField(student._id, "photoPreview", null)}
                                      className="text-red-500 hover:text-red-700 font-extrabold text-[10px]"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ) : (
                                  <div className="relative overflow-hidden cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 rounded-lg h-9 flex items-center justify-center gap-1.5 border-dashed">
                                    <Upload size={12} className="text-slate-400" />
                                    <span className="text-[10px] text-slate-500 font-bold">Upload Report File</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                      onChange={(e) => handleRowPhotoChange(student._id, e)}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* 4. Action */}
                      <td className="py-4 px-6 text-center">
                        {isAlreadyLogged ? (
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block mb-1">Recorded</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                              submissions.find(s => s.id.includes(student._id))?.status === 'Absent' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-700'
                            }`}>
                              {submissions.find(s => s.id.includes(student._id))?.status === 'Absent' ? 'Absent' : 'Present'}
                            </span>
                          </div>
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
                <div className="my-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center text-[10px] font-black text-indigo-600 uppercase tracking-wider mb-2 pb-1.5 border-b border-slate-200/50">
                    <span>Test Parameters Summary</span>
                    <span>BMI: {sub.bmi} (Height: {sub.height}cm / Weight: {sub.weight}kg)</span>
                  </div>
                  {sub.ageGroup === 1 ? (
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Plate Tapping</p>
                        <p className="font-extrabold text-slate-800 text-sm mt-0.5">{sub.plateTapping}s</p>
                      </div>
                      <div className="border-l border-slate-200">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Flamingo Balance</p>
                        <p className="font-extrabold text-slate-800 text-sm mt-0.5">{sub.flamingoBalance}s</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-1.5 text-center">
                      <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide leading-tight">Partial Curl-up</p>
                        <p className="font-extrabold text-slate-800 text-xs mt-0.5">{sub.partialCurlUp}</p>
                      </div>
                      <div className="border-l border-slate-200">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide leading-tight">Pushups</p>
                        <p className="font-extrabold text-slate-800 text-xs mt-0.5">{sub.pushups}</p>
                      </div>
                      <div className="border-l border-slate-200">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide leading-tight">Sit & Reach</p>
                        <p className="font-extrabold text-slate-800 text-xs mt-0.5">{sub.sitAndReach}cm</p>
                      </div>
                      <div className="border-l border-slate-200">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide leading-tight">600m Run</p>
                        <p className="font-extrabold text-slate-800 text-xs mt-0.5">{sub.runWalk600m}</p>
                      </div>
                      <div className="border-l border-slate-200">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide leading-tight">50m Run</p>
                        <p className="font-extrabold text-slate-800 text-xs mt-0.5">{sub.run50m}s</p>
                      </div>
                    </div>
                  )}
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

                  <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/50 max-w-md mx-auto">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Calculated BMI: {activeCertificate.bmi}</p>
                    {activeCertificate.ageGroup === 1 ? (
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Plate Tapping</p>
                          <p className="font-extrabold text-slate-800 text-sm mt-0.5">{activeCertificate.plateTapping}s</p>
                        </div>
                        <div className="border-l border-slate-200">
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Flamingo Balance</p>
                          <p className="font-extrabold text-slate-800 text-sm mt-0.5">{activeCertificate.flamingoBalance}s</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                        <div>
                          <p className="text-[8px] font-bold text-slate-500 uppercase leading-tight">Partial Curl-up</p>
                          <p className="font-extrabold text-slate-800 mt-1">{activeCertificate.partialCurlUp}</p>
                        </div>
                        <div className="border-l border-slate-200">
                          <p className="text-[8px] font-bold text-slate-500 uppercase leading-tight">Pushups</p>
                          <p className="font-extrabold text-slate-800 mt-1">{activeCertificate.pushups}</p>
                        </div>
                        <div className="border-l border-slate-200">
                          <p className="text-[8px] font-bold text-slate-500 uppercase leading-tight">Sit & Reach</p>
                          <p className="font-extrabold text-slate-800 mt-1">{activeCertificate.sitAndReach}cm</p>
                        </div>
                        <div className="border-l border-slate-200">
                          <p className="text-[8px] font-bold text-slate-500 uppercase leading-tight">600m Run</p>
                          <p className="font-extrabold text-slate-800 mt-1">{activeCertificate.runWalk600m}</p>
                        </div>
                        <div className="border-l border-slate-200">
                          <p className="text-[8px] font-bold text-slate-500 uppercase leading-tight">50m Run</p>
                          <p className="font-extrabold text-slate-800 mt-1">{activeCertificate.run50m}s</p>
                        </div>
                      </div>
                    )}
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
