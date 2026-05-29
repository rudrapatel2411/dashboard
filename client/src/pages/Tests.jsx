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

const getBMILabel = (bmi) => {
  if (bmi === "—" || !bmi) return { label: "Pending", color: "bg-slate-100 text-slate-600 border-slate-200" };
  const num = parseFloat(bmi);
  if (isNaN(num)) return { label: "Pending", color: "bg-slate-100 text-slate-600 border-slate-200" };
  if (num < 18.5) return { label: "Underweight", color: "bg-amber-50/80 text-amber-600 border-amber-200" };
  if (num >= 18.5 && num < 25) return { label: "Normal Weight", color: "bg-emerald-50/80 text-emerald-600 border-emerald-200" };
  if (num >= 25 && num < 30) return { label: "Overweight", color: "bg-orange-50/80 text-orange-600 border-orange-200" };
  return { label: "Obese", color: "bg-red-50/80 text-red-600 border-red-200" };
};

const isFieldEmpty = (val) => {
  return val === undefined || val === null || String(val).trim() === "";
};

const DRAFT_TEST_FIELDS = [
  "height",
  "weight",
  "plateTapping",
  "flamingoBalance",
  "partialCurlUp",
  "pushups",
  "sitAndReach",
  "runWalk600m",
  "run50m",
  "manualReportData"
];

const hasDraftTestData = (row) => {
  if (!row) return false;
  return row.status === "Absent" || DRAFT_TEST_FIELDS.some(field => !isFieldEmpty(row[field]));
};

const STANDARDS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const Tests = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAcademy = user.instituteType === 'academy';

  // Live students fetched from backend
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("10"); // Default standard select
  const [selectedTerm, setSelectedTerm] = useState("TERM-2"); // Default evaluation term
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', title: '', isError: false });
  const [classPhotos, setClassPhotos] = useState({});

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
          id: `${p._id}_${student._id || ""}`,
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
          manualReportData: ""
        };
      }
    });
    setRowInputs(newInputs);
  }, [students, selectedClass]);

  // Update a specific field for a student's input row
  const updateRowField = (studentId, field, value) => {
    setRowInputs(prev => {
      const activeDraftStudent = filteredStudents.find(student => {
        const hasSavedRecord = submissions.some(sub => sub.id.includes(student._id));
        return !hasSavedRecord && hasDraftTestData(prev[student._id]);
      });

      if (activeDraftStudent && activeDraftStudent._id !== studentId) {
        return prev;
      }

      return {
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [field]: value
        }
      };
    });
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

  // Handle class image upload with size & type constraints
  const handleClassPhotoChange = (e) => {
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
        setClassPhotos(prev => ({
          ...prev,
          [selectedClass]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeClassPhoto = () => {
    setClassPhotos(prev => ({
      ...prev,
      [selectedClass]: null
    }));
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
    const classPhoto = classPhotos[selectedClass] || "";

    let payload = {
      studentId: studentId,
      term: selectedTerm,
      status: row.status,
      manualReportData: row.manualReportData || "",
      reportHardCopyUrl: classPhoto
    };

    if (row.status === "Absent") {
      // Mark as Absent
    } else {
      if (isGroup1) {
        if (
          isFieldEmpty(row.height) ||
          isFieldEmpty(row.weight) ||
          isFieldEmpty(row.plateTapping) ||
          isFieldEmpty(row.flamingoBalance) ||
          isFieldEmpty(row.manualReportData)
        ) {
          triggerToast(
            "Missing details",
            "Please fill height, weight, plate tapping, flamingo balance, and observations.",
            true
          );
          return;
        }
        payload.height = parseFloat(row.height);
        payload.weight = parseFloat(row.weight);
        payload.plateTapping = parseFloat(row.plateTapping);
        payload.flamingoBalance = parseFloat(row.flamingoBalance);
      } else {
        if (
          isFieldEmpty(row.height) ||
          isFieldEmpty(row.weight) ||
          isFieldEmpty(row.partialCurlUp) ||
          isFieldEmpty(row.pushups) ||
          isFieldEmpty(row.sitAndReach) ||
          isFieldEmpty(row.runWalk600m) ||
          isFieldEmpty(row.run50m) ||
          isFieldEmpty(row.manualReportData)
        ) {
          triggerToast(
            "Missing details",
            "Please fill height, weight, curl-up, pushups, sit & reach, 600m run, 50m sprint, and observations.",
            true
          );
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
        id: `${savedPerf._id}_${studentId}`,
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
        const filtered = prev.filter(s => !s.id.includes(savedPerf._id) && !s.id.includes(studentId));
        return [newSub, ...filtered];
      });

      triggerToast("Logged successfully", `${matchedStu.name} physical test scores recorded successfully!`);
    } catch (error) {
      triggerToast("Save Error", error.response?.data?.message || "Failed to save physical test scores.", true);
    } finally {
      setIsLoading(false);
    }
  };

  // Finalize and save/update all students in the class with hardcopy spreadsheet verification
  const handleFinalSaveAll = async () => {
    const classPhoto = classPhotos[selectedClass];
    if (!classPhoto) {
      triggerToast(
        "Missing Hardcopy Proof",
        `Please upload the Class Hardcopy Roster Proof at the top of the page before final submit.`,
        true
      );
      return;
    }

    // Check if any active student has incomplete data
    const incompleteStudents = [];
    filteredStudents.forEach(student => {
      const row = rowInputs[student._id];
      if (!row || row.status === "Absent") return;
      const age = calculateAge(student.dob);
      const isGroup1 = age >= 5 && age <= 8;
      
      if (isGroup1) {
        if (isFieldEmpty(row.height) || isFieldEmpty(row.weight) || isFieldEmpty(row.plateTapping) || isFieldEmpty(row.flamingoBalance) || isFieldEmpty(row.manualReportData)) {
          incompleteStudents.push(student.name);
        }
      } else {
        if (isFieldEmpty(row.height) || isFieldEmpty(row.weight) || isFieldEmpty(row.partialCurlUp) || isFieldEmpty(row.pushups) || isFieldEmpty(row.sitAndReach) || isFieldEmpty(row.runWalk600m) || isFieldEmpty(row.run50m) || isFieldEmpty(row.manualReportData)) {
          incompleteStudents.push(student.name);
        }
      }
    });

    if (incompleteStudents.length > 0) {
      triggerToast("Incomplete Data", `Please complete the screening data for: ${incompleteStudents.join(", ")} before final submit.`, true);
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      let successCount = 0;
      let failedCount = 0;

      const savePromises = filteredStudents.map(async (student) => {
        const studentId = student._id;
        const row = rowInputs[studentId] || {
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
          manualReportData: ""
        };

        const age = calculateAge(student.dob);
        const isGroup1 = age >= 5 && age <= 8;

        let payload = {
          studentId: studentId,
          term: selectedTerm,
          status: row.status,
          manualReportData: row.manualReportData || "",
          reportHardCopyUrl: classPhoto
        };

        if (row.status === "Absent") {
          // Mark as Absent
        } else {
          if (isGroup1) {
            payload.height = parseFloat(row.height);
            payload.weight = parseFloat(row.weight);
            payload.plateTapping = parseFloat(row.plateTapping);
            payload.flamingoBalance = parseFloat(row.flamingoBalance);
          } else {
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
          const res = await axios.post(`${API_URL}/performance`, payload, { headers });
          const savedPerf = res.data;
          const newSub = {
            id: `${savedPerf._id}_${studentId}`,
            studentName: student.name,
            studentId: student.studentId || studentId.substring(0, 6).toUpperCase(),
            age,
            class: student.class,
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
            const filtered = prev.filter(s => !s.id.includes(savedPerf._id) && !s.id.includes(studentId));
            return [newSub, ...filtered];
          });
          successCount++;
        } catch (error) {
          failedCount++;
        }
      });

      await Promise.all(savePromises);
      setIsLoading(false);

      if (successCount > 0) {
        triggerToast("Finalized & Saved", `Successfully finalized and saved class evaluation with the spreadsheet proof!`, false);
      } else if (failedCount > 0) {
        triggerToast("Save Error", "Could not save class evaluations to the database.", true);
      }
    } catch (err) {
      setIsLoading(false);
      triggerToast("Submit Error", "An error occurred during final class save.", true);
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

  const activeDraftStudentId = filteredStudents.find(student => {
    const hasSavedRecord = submissions.some(sub => sub.id.includes(student._id));
    return !hasSavedRecord && hasDraftTestData(rowInputs[student._id]);
  })?._id || null;

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
          Conduct bulk physical screening, view all {isAcademy ? 'athletes' : 'class students'} inline, and log test parameters or mark absentees.
        </p>
      </div>

      {/* Select Standard / Class Toolbar */}
      <div className="gov-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-1">{isAcademy ? 'Standard / Age Level' : 'Class / Standard'} Roster</h3>
          <p className="text-xs text-slate-400 font-semibold">Select a {isAcademy ? 'standard / age level' : 'school grade standard'} to load all registered {isAcademy ? 'athletes' : 'students'}.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Real-time search input with starts-with prioritization */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder={`Search ${isAcademy ? 'athlete' : 'student'} by name...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="gov-field w-full pl-9 pr-4 py-2 text-xs font-semibold"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="gov-field px-4 py-2.5 text-xs font-bold"
            >
              {STANDARDS.map(s => (
                <option key={s} value={s}>Standard {s}th</option>
              ))}
            </select>

            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="gov-field px-4 py-2.5 text-xs font-bold"
            >
              <option value="TERM-1">Term 1</option>
              <option value="TERM-2">Term 2</option>
            </select>

            <button 
              onClick={fetchStudentsAndSubmissions}
              className="p-2.5 text-slate-600 hover:text-secondary bg-[#fbf7ee] hover:bg-[#f3eadc] rounded-lg transition-all border border-[#d8cfc0]"
              title="Refresh Student Database"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* Class Document Upload Area */}
      <div className="gov-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <FileText size={18} className="text-secondary" />
            Class {selectedClass}th Hardcopy Roster Proof
          </h4>
          <p className="text-xs text-slate-400 font-semibold">
            Upload the physical screening spreadsheet for this entire class. Individual student records will link to this proof.
          </p>
        </div>
        
        <div className="w-full md:w-72 shrink-0">
          {classPhotos[selectedClass] ? (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl h-11 shadow-sm">
              <span className="text-xs text-emerald-700 font-black flex items-center gap-1.5">
                <CheckCircle size={16} /> Proof Uploaded
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveImage(classPhotos[selectedClass])}
                  className="text-indigo-600 hover:text-indigo-800 font-black text-xs px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={removeClassPhoto}
                  className="text-red-500 hover:text-red-700 font-black text-xs px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden cursor-pointer bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl h-11 flex items-center justify-center gap-2 border-dashed transition-all hover:border-slate-300">
              <Upload size={16} className="text-slate-400 animate-bounce" />
              <span className="text-xs text-slate-600 font-black">Upload Class Spreadsheet</span>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleClassPhotoChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Bulk Table Roster View */}
      <div className="gov-card overflow-hidden">
        <div className="px-6 py-4 gov-panel-title flex justify-between items-center">
          <span className="font-extrabold text-xs tracking-wider uppercase flex items-center gap-2">
            <User size={16} className="text-accent" />
            Class {selectedClass}th Active {isAcademy ? 'Athlete' : 'Student'} Screening Sheet
          </span>
          <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#d8cfc0] text-secondary font-black">
            {filteredStudents.length} ROSTER
          </span>
        </div>

        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1160px] text-left border-collapse table-fixed">
              <thead>
                <tr className="gov-table-head text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-4 px-5 w-[16%]">{isAcademy ? 'Athlete Info' : 'Student Info'}</th>
                  <th className="py-4 px-3 text-center w-[10%]">Status</th>
                  <th className="py-4 px-4 w-[60%]">Fitness Test Parameters & Evaluation</th>
                  <th className="py-4 px-4 text-center w-[14%]">Action</th>
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
                  const isRowLocked = Boolean(activeDraftStudentId && activeDraftStudentId !== student._id && !isAlreadyLogged);

                  const heightNum = parseFloat(input.height);
                  const weightNum = parseFloat(input.weight);
                  const bmiVal = (heightNum && weightNum) ? (weightNum / ((heightNum / 100) * (heightNum / 100))).toFixed(1) : "—";

                  const matchedSub = submissions.find(s => s.id.includes(student._id));
                  const bmiInfo = getBMILabel(bmiVal);

                  return (
                    <tr key={student._id} className={`hover:bg-slate-50/50 transition-colors ${input.status === 'Absent' ? 'bg-red-50/10' : ''} ${isRowLocked ? 'bg-slate-50/70 opacity-60' : ''}`}>
                      
                      {/* 1. Student Name and ID */}
                      <td className="py-5 px-5 align-middle">
                        <p className="font-black text-slate-800 text-base leading-tight break-words">{student.name}</p>
                        <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wide mt-1 leading-tight break-words">
                          ID: {student.studentId || "PENDING"}
                        </p>
                        <p className="text-xs text-slate-500 font-extrabold uppercase tracking-wide mt-0.5 leading-tight">
                          Age: {age} Yrs • {student.gender}
                        </p>
                      </td>

                      {/* 2. Attendance Status Pill */}
                      <td className="py-5 px-4 text-center align-middle">
                        {isAlreadyLogged ? (
                          <span className="px-3.5 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black uppercase text-xs border border-emerald-100 shadow-sm inline-block tracking-wider">
                            ✅ Logged
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => updateRowField(student._id, "status", input.status === "Present" ? "Absent" : "Present")}
                            disabled={isRowLocked || isLoading}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all border ${
                              input.status === "Present" 
                                ? 'bg-blue-50 text-secondary border-blue-100 hover:bg-blue-100/60' 
                                : 'bg-red-50 text-red-500 border-red-100 hover:bg-red-100/60'
                            } disabled:cursor-not-allowed disabled:hover:bg-slate-100`}
                          >
                            {input.status}
                          </button>
                        )}
                      </td>

                      {/* 3. Dynamic Test Parameter Form Column */}
                      <td className="py-5 px-4 align-middle">
                        {input.status === "Absent" ? (
                          <div className="text-center text-slate-400 text-sm italic font-semibold py-6 bg-slate-50 border border-slate-100 rounded-2xl">
                            {isAcademy ? 'Athlete' : 'Student'} is marked ABSENT. No parameters needed.
                          </div>
                        ) : isAlreadyLogged ? (
                          // Render saved details
                          <div className="bg-bg-card border border-[#d8cfc0] p-5 rounded-lg shadow-sm space-y-5 min-w-0 max-w-full">
                            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pb-3 border-b border-slate-100 min-w-0">
                              <span className="inline-flex w-fit max-w-full px-3.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-black uppercase tracking-wider border border-emerald-100/60 leading-tight whitespace-normal break-words">
                                Saved Test Scores ({matchedSub?.ageGroup === 1 ? "Group 1: 5-8 yrs" : "Group 2: 9-18 yrs"})
                              </span>
                              <div className="flex flex-wrap items-center gap-2 min-w-0">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">BMI:</span>
                                <span className={`inline-flex max-w-full px-3 py-1 text-sm font-black rounded-2xl border leading-tight whitespace-normal break-words ${getBMILabel(matchedSub?.bmi).color}`}>
                                  {matchedSub?.bmi} • {getBMILabel(matchedSub?.bmi).label}
                                </span>
                              </div>
                            </div>

                            {/* Scores Grid */}
                            {matchedSub?.ageGroup === 1 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="bg-slate-50/50 border border-slate-100 p-3.5 rounded-xl text-center min-w-0">
                                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-tight min-h-[26px] flex items-center justify-center">Height / Weight</p>
                                  <p className="font-black text-base text-slate-700 mt-1 leading-tight break-words">{matchedSub?.height}cm / {matchedSub?.weight}kg</p>
                                </div>
                                <div className="bg-slate-50/50 border border-slate-100 p-3.5 rounded-xl text-center min-w-0">
                                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-tight min-h-[26px] flex items-center justify-center">Plate Tap</p>
                                  <p className="font-black text-base text-slate-700 mt-1 leading-tight break-words">{matchedSub?.plateTapping}s</p>
                                </div>
                                <div className="bg-slate-50/50 border border-slate-100 p-3.5 rounded-xl text-center min-w-0">
                                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-tight min-h-[26px] flex items-center justify-center">Flamingo Bal.</p>
                                  <p className="font-black text-base text-slate-700 mt-1 leading-tight break-words">{matchedSub?.flamingoBalance}s</p>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5">
                                <div className="bg-slate-50/50 border border-slate-100 px-2.5 py-3 rounded-xl text-center min-w-0">
                                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-tight min-h-[28px] flex items-center justify-center">Ht/Wt</p>
                                  <p className="font-black text-[13px] text-slate-700 mt-1 leading-tight break-words tabular-nums">
                                    <span className="block">{matchedSub?.height}cm</span>
                                    <span className="block">{matchedSub?.weight}kg</span>
                                  </p>
                                </div>
                                <div className="bg-slate-50/50 border border-slate-100 px-2.5 py-3 rounded-xl text-center min-w-0">
                                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-tight min-h-[28px] flex items-center justify-center">Curl-up</p>
                                  <p className="font-black text-sm text-slate-700 mt-1 leading-tight break-words tabular-nums">{matchedSub?.partialCurlUp}</p>
                                </div>
                                <div className="bg-slate-50/50 border border-slate-100 px-2.5 py-3 rounded-xl text-center min-w-0">
                                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-tight min-h-[28px] flex items-center justify-center">Pushups</p>
                                  <p className="font-black text-sm text-slate-700 mt-1 leading-tight break-words tabular-nums">{matchedSub?.pushups}</p>
                                </div>
                                <div className="bg-slate-50/50 border border-slate-100 px-2.5 py-3 rounded-xl text-center min-w-0">
                                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-tight min-h-[28px] flex items-center justify-center">Sit & Reach</p>
                                  <p className="font-black text-sm text-slate-700 mt-1 leading-tight break-words tabular-nums">{matchedSub?.sitAndReach}cm</p>
                                </div>
                                <div className="bg-slate-50/50 border border-slate-100 px-2.5 py-3 rounded-xl text-center min-w-0">
                                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-tight min-h-[28px] flex items-center justify-center">600m Run</p>
                                  <p className="font-black text-sm text-slate-700 mt-1 leading-tight break-words tabular-nums">{matchedSub?.runWalk600m}</p>
                                </div>
                                <div className="bg-slate-50/50 border border-slate-100 px-2.5 py-3 rounded-xl text-center min-w-0">
                                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-tight min-h-[28px] flex items-center justify-center">50m Run</p>
                                  <p className="font-black text-sm text-slate-700 mt-1 leading-tight break-words tabular-nums">{matchedSub?.run50m}s</p>
                                </div>
                              </div>
                            )}

                            {/* Additional Info: Sport & Observations & Proof */}
                            <div className="flex flex-col sm:flex-row items-start gap-4 pt-3 border-t border-slate-100 text-sm font-semibold justify-between min-w-0">
                              <div className="text-left space-y-1 min-w-0">
                                <p className="text-xs text-slate-400 font-extrabold uppercase leading-tight">Observations & Insights</p>
                                <p className="text-slate-600 italic leading-snug break-words">"{matchedSub?.manualReportData || 'No observations recorded.'}"</p>
                                {matchedSub?.recommendedSport && (
                                  <p className="text-indigo-600 font-extrabold text-xs uppercase flex items-start gap-1 mt-1 leading-snug break-words">
                                    <Sparkles size={14} className="text-accent shrink-0 mt-0.5" />
                                    <span className="min-w-0 break-words">Recommended Sport: {matchedSub?.recommendedSport}</span>
                                  </p>
                                )}
                              </div>
                              {matchedSub?.reportHardCopyUrl && (
                                <button
                                  type="button"
                                  onClick={() => setActiveImage(matchedSub.reportHardCopyUrl)}
                                  className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs text-slate-600 font-black uppercase transition-all shadow-sm"
                                >
                                  <Eye size={14} /> View Class Proof
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          // Render form inputs based on age
                          <div className="bg-[#fbf7ee] border border-[#d8cfc0] p-5 rounded-lg space-y-6 shadow-sm min-w-0 max-w-full">
                            {isRowLocked && (
                              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-400">
                                Finish or clear the current student row first
                              </div>
                            )}
                            <fieldset disabled={isRowLocked || isLoading} className="space-y-6 disabled:opacity-60">
                            {/* Header showing age and group */}
                            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pb-3 border-b border-slate-200/40 min-w-0">
                              <span className="inline-flex w-fit max-w-full px-3.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-2xl text-xs font-black uppercase tracking-wider border border-indigo-100 leading-tight whitespace-normal break-words">
                                {ageGroup === 1 ? "Group 1: 5-8 Years" : "Group 2: 9-18 Years"}
                              </span>
                              <div className="flex flex-wrap items-center gap-2 min-w-0">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Calculated BMI:</span>
                                <span className={`inline-flex max-w-full px-3 py-1 text-xs font-black rounded-2xl border leading-tight whitespace-normal break-words ${bmiInfo.color}`}>
                                  {bmiVal} • {bmiInfo.label}
                                </span>
                              </div>
                            </div>

                            {ageGroup === 1 ? (
                              /* Group 1 Fields */
                              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                <div className="min-w-0">
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5 tracking-wide leading-tight min-h-[30px]">Height (cm) *</label>
                                  <input 
                                    type="number" 
                                    placeholder="e.g. 115"
                                    value={input.height}
                                    onChange={(e) => updateRowField(student._id, "height", e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-secondary/25 transition-all shadow-sm bg-white hover:border-slate-300"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5 tracking-wide leading-tight min-h-[30px]">Weight (kg) *</label>
                                  <input 
                                    type="number" 
                                    placeholder="e.g. 21"
                                    value={input.weight}
                                    onChange={(e) => updateRowField(student._id, "weight", e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-secondary/25 transition-all shadow-sm bg-white hover:border-slate-300"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5 tracking-wide leading-tight min-h-[30px]">Plate Tapping (s) *</label>
                                  <input 
                                    type="number" 
                                    step="0.1"
                                    placeholder="e.g. 14.5"
                                    value={input.plateTapping}
                                    onChange={(e) => updateRowField(student._id, "plateTapping", e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-secondary/25 transition-all shadow-sm bg-white hover:border-slate-300"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5 tracking-wide leading-tight min-h-[30px]">Flamingo Bal. (s) *</label>
                                  <input 
                                    type="number" 
                                    placeholder="e.g. 12"
                                    value={input.flamingoBalance}
                                    onChange={(e) => updateRowField(student._id, "flamingoBalance", e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-secondary/25 transition-all shadow-sm bg-white hover:border-slate-300"
                                  />
                                </div>
                              </div>
                            ) : (
                              /* Group 2 Fields */
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <div className="min-w-0">
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5 tracking-wide leading-tight min-h-[30px]">Height (cm) *</label>
                                    <input 
                                      type="number" 
                                      placeholder="e.g. 165"
                                      value={input.height}
                                      onChange={(e) => updateRowField(student._id, "height", e.target.value)}
                                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-secondary/25 transition-all shadow-sm bg-white hover:border-slate-300"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5 tracking-wide leading-tight min-h-[30px]">Weight (kg) *</label>
                                    <input 
                                      type="number" 
                                      placeholder="e.g. 52"
                                      value={input.weight}
                                      onChange={(e) => updateRowField(student._id, "weight", e.target.value)}
                                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-secondary/25 transition-all shadow-sm bg-white hover:border-slate-300"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5 tracking-wide leading-tight min-h-[30px]">Partial Curl-up *</label>
                                    <input 
                                      type="number" 
                                      placeholder="e.g. 20"
                                      value={input.partialCurlUp}
                                      onChange={(e) => updateRowField(student._id, "partialCurlUp", e.target.value)}
                                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-secondary/25 transition-all shadow-sm bg-white hover:border-slate-300"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                  <div className="min-w-0">
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5 tracking-wide leading-tight min-h-[30px]">
                                      {student.gender === 'Female' ? 'Mod. Pushups *' : 'Pushups *'}
                                    </label>
                                    <input 
                                      type="number" 
                                      placeholder="e.g. 25"
                                      value={input.pushups}
                                      onChange={(e) => updateRowField(student._id, "pushups", e.target.value)}
                                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-secondary/25 transition-all shadow-sm bg-white hover:border-slate-300"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5 tracking-wide leading-tight min-h-[30px]">Sit & Reach (cm) *</label>
                                    <input 
                                      type="number" 
                                      placeholder="e.g. 18"
                                      value={input.sitAndReach}
                                      onChange={(e) => updateRowField(student._id, "sitAndReach", e.target.value)}
                                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-secondary/25 transition-all shadow-sm bg-white hover:border-slate-300"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5 tracking-wide leading-tight min-h-[30px]">600m Run/Walk *</label>
                                    <input 
                                      type="text" 
                                      placeholder="e.g. 2:45"
                                      value={input.runWalk600m}
                                      onChange={(e) => updateRowField(student._id, "runWalk600m", e.target.value)}
                                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-secondary/25 transition-all shadow-sm bg-white hover:border-slate-300"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5 tracking-wide leading-tight min-h-[30px]">50m Run (s) *</label>
                                    <input 
                                      type="number" 
                                      step="0.01"
                                      placeholder="e.g. 8.5"
                                      value={input.run50m}
                                      onChange={(e) => updateRowField(student._id, "run50m", e.target.value)}
                                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-secondary/25 transition-all shadow-sm bg-white hover:border-slate-300"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Observations / Notes Only */}
                            <div className="pt-3 border-t border-slate-200/40">
                              <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5 tracking-wide leading-tight">Observations / Notes *</label>
                                <input 
                                  type="text"
                                  placeholder="Enter general health or posture observations..."
                                  value={input.manualReportData}
                                  onChange={(e) => updateRowField(student._id, "manualReportData", e.target.value)}
                                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-secondary/25 transition-all shadow-sm bg-white hover:border-slate-300"
                                />
                              </div>
                            </div>
                            </fieldset>
                          </div>
                        )}
                      </td>

                      {/* 4. Action */}
                      <td className="py-5 px-4 text-center align-middle">
                        {isAlreadyLogged ? (
                          <div className="space-y-1.5">
                            <span className="text-xs text-slate-400 font-extrabold uppercase block tracking-wider">Recorded</span>
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider inline-block border ${
                              matchedSub?.status === 'Absent' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            }`}>
                              {matchedSub?.status === 'Absent' ? 'Absent' : 'Present'}
                            </span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSubmitRow(student._id)}
                            disabled={isRowLocked || isLoading}
                            className={`min-w-[118px] px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap shadow-md transition-all active:scale-95 duration-150 ${
                              input.status === "Present" 
                                ? 'bg-secondary hover:bg-blue-600 text-white shadow-blue-500/10' 
                                : 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/10'
                            } disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100`}
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

      {/* Final Save / Class Submit Verification Card */}
      {filteredStudents.length > 0 && (
        <div className="gov-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-500" />
              Finalize Class {selectedClass}th Screening
            </h4>
            <p className="text-xs text-slate-400 font-semibold">
              Before submitting the evaluation, make sure that the spreadsheet hardcopy is uploaded and all student scores are saved.
            </p>
          </div>
          <div>
            <button
              onClick={handleFinalSaveAll}
              disabled={isLoading}
              className="gov-btn-primary w-full sm:w-auto px-6 py-3 text-xs font-black uppercase tracking-wider transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Finalizing..." : `Finalize & Save Class ${selectedClass}th`}
            </button>
          </div>
        </div>
      )}

      {/* Reusable Toast Notifications */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-4 bg-bg-card text-slate-800 px-5 py-4 rounded-lg shadow-xl animate-fade-in-up max-w-sm border border-[#d8cfc0] border-l-4 ${toast.isError ? 'border-red-500' : 'border-emerald-500'}`}>
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
            <h4 className="font-bold text-sm text-slate-900 tracking-wide">{toast.title}</h4>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">{toast.message}</p>
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
            className="gov-card overflow-hidden max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 gov-panel-title flex justify-between items-center">
              <span className="font-extrabold text-sm tracking-wide uppercase flex items-center gap-2">
                <ImageIcon size={18} className="text-accent" /> Hard Copy Document Proof
              </span>
              <button 
                onClick={() => setActiveImage(null)}
                className="text-slate-600 hover:text-slate-900 font-black text-sm uppercase bg-white hover:bg-[#f3eadc] border border-[#d8cfc0] px-2.5 py-1.5 rounded-lg transition-all"
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
            className="gov-card max-w-2xl w-full relative flex flex-col justify-between overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 gov-panel-title flex justify-between items-center">
              <span className="font-extrabold text-xs tracking-wider uppercase flex items-center gap-2">
                <Award size={18} className="text-accent animate-pulse" /> Official Endorsement Certificate
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-accent hover:bg-[#9b6412] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Printer size={14} /> Print / Save PDF
                </button>
                <button 
                  onClick={() => setActiveCertificate(null)}
                  className="text-slate-600 hover:text-slate-900 text-xs font-bold uppercase bg-white hover:bg-[#f3eadc] border border-[#d8cfc0] px-3 py-1.5 rounded-lg transition-all"
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
