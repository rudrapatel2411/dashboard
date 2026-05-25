import React, { useState, useEffect } from 'react';
import { Download, Printer, Share2, Award, Activity, Building2, Users, FileText, Search, User, CheckCircle } from 'lucide-react';
import axios from 'axios';

const Reports = () => {
  const [reportType, setReportType] = useState('student'); // 'student' or 'institute'
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Baseline mock student directory
  const mockStudents = [
    { id: "stu-1", name: "Rohan Sharma", age: 15, class: "9", sport: "Football", assignedSport: "Football", mentor: "Coach Arthur", bmiCategory: "Normal", bmi: 21.2, height: 168, weight: 60 },
    { id: "stu-2", name: "Priya Patel", age: 16, class: "10", sport: "Basketball", assignedSport: "Basketball", mentor: "Coach Arthur", bmiCategory: "Normal", bmi: 20.4, height: 165, weight: 55 },
    { id: "stu-3", name: "Aarav Mehta", age: 14, class: "8", sport: "Athletics", assignedSport: "Athletics", mentor: "Coach Arthur", bmiCategory: "Underweight", bmi: 17.8, height: 160, weight: 45 },
    { id: "stu-4", name: "Sneha Reddy", age: 15, class: "9", sport: "Volleyball", assignedSport: "Volleyball", mentor: "Coach Arthur", bmiCategory: "Normal", bmi: 19.8, height: 162, weight: 52 },
    { id: "stu-12", name: "Rohan Patel", age: 14, class: "8", sport: "Athletics", assignedSport: "Athletics", mentor: "Coach Arthur", bmiCategory: "Normal", bmi: 19.1, height: 158, weight: 48 },
    { id: "stu-13", name: "Jiya Shah", age: 15, class: "9", sport: "Badminton", assignedSport: "Badminton", mentor: "Coach Arthur", bmiCategory: "Normal", bmi: 20.1, height: 163, weight: 53 },
    { id: "stu-14", name: "Manan Desai", age: 16, class: "10", sport: "Football", assignedSport: "Football", mentor: "Coach Arthur", bmiCategory: "Normal", bmi: 22.3, height: 172, weight: 66 },
    { id: "stu-5", name: "Kabir Singh", age: 16, class: "10", sport: "Cricket", assignedSport: "Cricket", mentor: "Coach Sharma", bmiCategory: "Normal", bmi: 21.8, height: 170, weight: 63 },
    { id: "stu-6", name: "Ananya Iyer", age: 17, class: "11", sport: "Swimming", assignedSport: "Swimming", mentor: "Coach Sharma", bmiCategory: "Normal", bmi: 19.5, height: 167, weight: 54 },
    { id: "stu-7", name: "Ishaan Verma", age: 15, class: "9", sport: "Football", assignedSport: "Football", mentor: "Coach Sharma", bmiCategory: "Overweight", bmi: 25.5, height: 165, weight: 69 },
    { id: "stu-30", name: "Manish Kumar", age: 16, class: "10", sport: "Cricket", assignedSport: "Cricket", mentor: "Coach Sharma", bmiCategory: "Normal", bmi: 22.1, height: 171, weight: 65 },
    { id: "stu-31", name: "Divya Teja", age: 14, class: "8", sport: "Athletics", assignedSport: "Athletics", mentor: "Coach Sharma", bmiCategory: "Normal", bmi: 18.9, height: 159, weight: 48 },
    { id: "stu-32", name: "Preeti Shenoy", age: 15, class: "9", sport: "Basketball", assignedSport: "Basketball", mentor: "Coach Sharma", bmiCategory: "Normal", bmi: 20.6, height: 164, weight: 55 },
    { id: "stu-8", name: "Aditya Roy", age: 14, class: "8", sport: "Basketball", assignedSport: "Basketball", mentor: "Coach Paul", bmiCategory: "Normal", bmi: 19.3, height: 161, weight: 50 },
    { id: "stu-9", name: "Diya Sen", age: 16, class: "10", sport: "Athletics", assignedSport: "Athletics", mentor: "Coach Paul", bmiCategory: "Normal", bmi: 20.0, height: 166, weight: 55 },
    { id: "stu-33", name: "Arjun Rampal", age: 15, class: "9", sport: "Football", assignedSport: "Football", mentor: "Coach Paul", bmiCategory: "Normal", bmi: 21.0, height: 169, weight: 60 },
    { id: "stu-34", name: "Kareena Kapoor", age: 16, class: "10", sport: "Badminton", assignedSport: "Badminton", mentor: "Coach Paul", bmiCategory: "Normal", bmi: 19.9, height: 163, weight: 53 },
    { id: "stu-35", name: "Saif Khan", age: 17, class: "11", sport: "Volleyball", assignedSport: "Volleyball", mentor: "Coach Paul", bmiCategory: "Normal", bmi: 22.8, height: 175, weight: 70 },
    { id: "stu-10", name: "Varun Dhawan", age: 15, class: "9", sport: "Cricket", assignedSport: "Cricket", mentor: "Coach Arthur", bmiCategory: "Normal", bmi: 21.5, height: 168, weight: 61 },
    { id: "stu-11", name: "Kiara Advani", age: 14, class: "8", sport: "Swimming", assignedSport: "Swimming", mentor: "Coach Arthur", bmiCategory: "Normal", bmi: 19.0, height: 160, weight: 49 },
    { id: "stu-36", name: "Siddharth Malhotra", age: 16, class: "10", sport: "Football", assignedSport: "Football", mentor: "Coach Arthur", bmiCategory: "Normal", bmi: 22.0, height: 173, weight: 66 },
    { id: "stu-37", name: "Alia Bhatt", age: 15, class: "9", sport: "Gymnastics", assignedSport: "Gymnastics", mentor: "Coach Arthur", bmiCategory: "Normal", bmi: 18.5, height: 157, weight: 46 },
    { id: "stu-38", name: "Katrina Kaif", age: 14, class: "8", sport: "Athletics", assignedSport: "Athletics", mentor: "Coach Arthur", bmiCategory: "Underweight", bmi: 18.0, height: 162, weight: 47 }
  ];

  // Fetch student roster on mount to overlay DB and Mock
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        const response = await axios.get('http://localhost:5000/api/students', { headers });
        const dbList = response.data || [];
        
        const combined = [...mockStudents];
        dbList.forEach(dbS => {
          if (!combined.some(m => m.name.toLowerCase() === dbS.name.toLowerCase())) {
            combined.push({
              id: dbS._id,
              name: dbS.name,
              age: dbS.age || 15,
              class: dbS.class?.toString() || "9",
              sport: dbS.assignedSport || "Athletics",
              assignedSport: dbS.assignedSport || "Athletics",
              mentor: dbS.coachName || "Coach Arthur",
              bmiCategory: dbS.bmiCategory || "Normal",
              bmi: dbS.bmi || 20.0,
              height: dbS.height || 165,
              weight: dbS.weight || 55
            });
          }
        });

        setStudents(combined);
        const defaultStudent = combined.find(s => s.name === "Rohan Sharma") || combined[0];
        setSelectedStudent(defaultStudent);
        setSearchQuery(defaultStudent?.name || "");
      } catch (error) {
        setStudents(mockStudents);
        setSelectedStudent(mockStudents[0]);
        setSearchQuery(mockStudents[0].name);
      }
    };

    fetchStudents();
  }, []);

  // Performance data generator (deterministic based on student details)
  const generatePerformanceData = (student) => {
    if (!student) return null;
    const getHashValue = (str, salt) => {
      let hash = 0;
      const fullStr = str + salt;
      for (let i = 0; i < fullStr.length; i++) {
        hash = (hash << 5) - hash + fullStr.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash);
    };

    const seed = student.id || student._id || "default";
    const sportName = (student.assignedSport || student.sport || "General Sports").toLowerCase();
    
    let baseSpeed = 70, baseStrength = 65, baseStamina = 70, baseAgility = 70, baseFlex = 60, baseAcc = 65, baseEnd = 68, baseReact = 70;
    
    if (sportName.includes("football")) {
      baseSpeed = 82; baseStamina = 80; baseAgility = 85; baseReact = 78;
    } else if (sportName.includes("basketball")) {
      baseStamina = 84; baseAgility = 82; baseStrength = 72; baseReact = 80;
    } else if (sportName.includes("cricket")) {
      baseAcc = 82; baseReact = 85; baseSpeed = 74; baseStrength = 70;
    } else if (sportName.includes("swimming")) {
      baseStamina = 88; baseEnd = 86; baseFlex = 78; baseStrength = 74;
    } else if (sportName.includes("badminton") || sportName.includes("tennis")) {
      baseAgility = 88; baseReact = 86; baseSpeed = 78; baseFlex = 75;
    } else if (sportName.includes("athletics") || sportName.includes("sprint")) {
      baseSpeed = 90; baseStamina = 85; baseEnd = 82; baseAgility = 80;
    } else if (sportName.includes("gymnastics")) {
      baseFlex = 92; baseAgility = 85; baseStrength = 72; baseReact = 78;
    }

    const t2Speed = Math.min(100, Math.max(40, baseSpeed + (getHashValue(seed, "t2speed") % 8)));
    const t2Strength = Math.min(100, Math.max(40, baseStrength + (getHashValue(seed, "t2str") % 8)));
    const t2Stamina = Math.min(100, Math.max(40, baseStamina + (getHashValue(seed, "t2stam") % 8)));
    const t2Agility = Math.min(100, Math.max(40, baseAgility + (getHashValue(seed, "t2ag") % 8)));
    const t2Flex = Math.min(100, Math.max(40, baseFlex + (getHashValue(seed, "t2flex") % 8)));
    const t2Acc = Math.min(100, Math.max(40, baseAcc + (getHashValue(seed, "t2acc") % 8)));
    const t2End = Math.min(100, Math.max(40, baseEnd + (getHashValue(seed, "t2end") % 8)));
    const t2React = Math.min(100, Math.max(40, baseReact + (getHashValue(seed, "t2react") % 8)));
    const t2Attendance = 88 + (getHashValue(seed, "t2att") % 12);
    const t2Discipline = 8 + (getHashValue(seed, "t2disc") % 3);
    const t2MatchPerf = 75 + (getHashValue(seed, "t2match") % 21);

    const t2Overall = Math.round((t2Speed + t2Strength + t2Stamina + t2Agility + t2Flex + t2Acc + t2End + t2React) / 8);

    const getFitnessLevel = (score) => {
      if (score >= 82) return "Excellent";
      if (score >= 72) return "Good";
      if (score >= 60) return "Average";
      return "Poor";
    };

    return {
      speed: t2Speed,
      strength: t2Strength,
      stamina: t2Stamina,
      agility: t2Agility,
      flexibility: t2Flex,
      accuracy: t2Acc,
      endurance: t2End,
      reactionTime: t2React,
      attendance: t2Attendance,
      discipline: t2Discipline,
      matchPerformance: t2MatchPerf,
      overallScore: t2Overall,
      fitnessLevel: getFitnessLevel(t2Overall),
      aiInsight: `Term-2 Evaluation Summary: Exhibits supreme cardio stability and hamstrings explosive speed. Joint displacement index is excellent. Displays high competence in matching performance categories. Focus should remain on maintaining off-season recovery schedules.`
    };
  };

  const selectedPerformance = selectedStudent ? generatePerformanceData(selectedStudent) : null;

  // Mock institute report data
  const mockInstituteReport = {
    name: 'St. Xavier\'s International School',
    city: 'Ahmedabad',
    state: 'Gujarat',
    totalStudents: 120,
    avgScore: 82,
    students: [
      { name: 'Rohan Sharma', class: '9th', sport: 'Football', score: 88 },
      { name: 'Priya Patel', class: '10th', sport: 'Basketball', score: 92 },
      { name: 'Amit Kumar', class: '11th', sport: 'Football', score: 75 },
      { name: 'Sneha Reddy', class: '9th', sport: 'Volleyball', score: 81 },
      { name: 'Jiya Shah', class: '9th', sport: 'Badminton', score: 79 },
    ],
  };

  const handleExportPDF = async () => {
    if (reportType === 'student' && !selectedStudent) {
      alert("Please select a student first!");
      return;
    }

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      if (reportType === 'student') {
        const perf = selectedPerformance || { overallScore: 85, fitnessLevel: 'Good', attendance: 92, speed: 80, strength: 75, stamina: 85, agility: 80, flexibility: 75, accuracy: 80, endurance: 85, reactionTime: 80, discipline: 9, matchPerformance: 85 };
        
        // Student Report PDF Formatting
        doc.setFontSize(22);
        doc.setTextColor(30, 41, 59);
        doc.text('Athletic Performance Report', 20, 25);
        
        doc.setFontSize(12);
        doc.setTextColor(100, 116, 139);
        doc.text('Academic Year 2026 - Term 2', 20, 35);
        
        doc.setDrawColor(79, 70, 229);
        doc.setLineWidth(1);
        doc.line(20, 40, 190, 40);
        
        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.text('Student Profile details', 20, 55);
        
        doc.setFontSize(11);
        doc.setTextColor(71, 85, 105);
        doc.text(`Name: ${selectedStudent.name}`, 20, 65);
        doc.text(`Student ID: ${selectedStudent.id || 'STU-001'}`, 20, 73);
        doc.text(`Assigned Sport: ${selectedStudent.assignedSport || selectedStudent.sport}`, 20, 81);
        doc.text(`BMI: ${selectedStudent.bmi} (${selectedStudent.bmiCategory})`, 20, 89);
        doc.text(`Class Grade: Class ${selectedStudent.class}th`, 20, 97);
        doc.text(`Coach Mentor: ${selectedStudent.mentor || 'Coach Arthur'}`, 20, 105);
        
        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.text('Performance Summary', 20, 120);
        
        doc.setFontSize(11);
        doc.setTextColor(71, 85, 105);
        doc.text(`Overall Score: ${perf.overallScore}%`, 20, 130);
        doc.text(`Fitness Level: ${perf.fitnessLevel}`, 20, 138);
        doc.text(`Attendance Rate: ${perf.attendance}%`, 20, 146);
        doc.text(`Discipline Rating: ${perf.discipline}/10`, 20, 154);
        doc.text(`Match Score: ${perf.matchPerformance}%`, 20, 162);
        
        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.text('Physical Capacity Indicators', 20, 178);
        
        doc.setFontSize(11);
        doc.text(`Speed: ${perf.speed}%`, 20, 188);
        doc.text(`Strength: ${perf.strength}%`, 20, 196);
        doc.text(`Stamina: ${perf.stamina}%`, 20, 204);
        doc.text(`Agility: ${perf.agility}%`, 20, 212);
        doc.text(`Flexibility: ${perf.flexibility}%`, 110, 188);
        doc.text(`Accuracy: ${perf.accuracy}%`, 110, 196);
        doc.text(`Endurance: ${perf.endurance}%`, 110, 204);
        doc.text(`Reaction Time: ${perf.reactionTime}%`, 110, 212);
        
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text('Generated dynamically by SportSphere Analytics Center', 20, 280);
      } else {
        // Institute Report PDF
        doc.setFontSize(22);
        doc.setTextColor(30, 41, 59);
        doc.text('Institute Performance Report', 20, 25);
        
        doc.setFontSize(12);
        doc.setTextColor(100, 116, 139);
        doc.text('Generated on: ' + new Date().toLocaleDateString('en-IN'), 20, 35);
        
        doc.setDrawColor(79, 70, 229);
        doc.setLineWidth(1);
        doc.line(20, 40, 190, 40);
        
        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.text('Institute Details', 20, 55);
        
        doc.setFontSize(11);
        doc.setTextColor(71, 85, 105);
        doc.text(`Name: ${mockInstituteReport.name}`, 20, 65);
        doc.text(`City: ${mockInstituteReport.city}`, 20, 73);
        doc.text(`State: ${mockInstituteReport.state}`, 20, 81);
        doc.text(`Total Students: ${mockInstituteReport.totalStudents}`, 20, 89);
        doc.text(`Average Score: ${mockInstituteReport.avgScore}%`, 20, 97);
        
        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.text('Students List', 20, 115);
        
        // Table header
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(79, 70, 229);
        doc.rect(20, 120, 170, 8, 'F');
        doc.text('Name', 22, 126);
        doc.text('Class', 72, 126);
        doc.text('Sport', 102, 126);
        doc.text('Score', 152, 126);
        
        // Table rows
        doc.setTextColor(71, 85, 105);
        mockInstituteReport.students.forEach((s, i) => {
          const y = 136 + (i * 10);
          if (i % 2 === 0) {
            doc.setFillColor(248, 250, 252);
            doc.rect(20, y - 6, 170, 10, 'F');
          }
          doc.text(s.name, 22, y);
          doc.text(s.class, 72, y);
          doc.text(s.sport, 102, y);
          doc.text(`${s.score}%`, 152, y);
        });
        
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text('Generated by SportSphere Academy', 20, 280);
      }
      
      const fileName = reportType === 'student' 
        ? `${selectedStudent.name.replace(/\s+/g, '_')}_Report.pdf` 
        : `${mockInstituteReport.name.replace(/\s+/g, '_')}_Report.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredStudents = searchQuery.trim() === "" 
    ? [] 
    : students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSelectSuggestion = (student) => {
    setSelectedStudent(student);
    setSearchQuery(student.name);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-6 font-sans pb-16">
      
      {/* Printable Area CSS injection */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-report-area, .printable-report-area * {
            visibility: visible;
          }
          .printable-report-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .non-printable {
            display: none !important;
          }
        }
      `}</style>

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 non-printable bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <FileText size={28} className="text-indigo-600" />
            Performance Reports
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-semibold">Generate, inspect, and export highly polished physical reports.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="bg-white text-slate-700 hover:text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 text-xs shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 font-bold active:scale-95"
          >
            <Printer size={15} /> Print Report
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs shadow-md hover:shadow-indigo-500/10 transition-all flex items-center gap-2 font-black active:scale-95"
          >
            <Download size={15} /> Export PDF
          </button>
        </div>
      </div>

      {/* Report Type Toggle Banner */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 non-printable flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="radio"
              name="reportType"
              value="student"
              checked={reportType === 'student'}
              onChange={(e) => setReportType(e.target.value)}
              className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500/30"
            />
            <span className={`text-xs font-black uppercase tracking-wider ${reportType === 'student' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
              Student Report Card
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="radio"
              name="reportType"
              value="institute"
              checked={reportType === 'institute'}
              onChange={(e) => setReportType(e.target.value)}
              className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500/30"
            />
            <span className={`text-xs font-black uppercase tracking-wider ${reportType === 'institute' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
              Institute Roster Report
            </span>
          </label>
        </div>

        {/* Dynamic Student Search Input */}
        {reportType === 'student' && (
          <div className="relative max-w-sm w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input 
              type="text"
              placeholder="Search student by name..."
              value={searchQuery}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-slate-50/50"
            />

            {/* Suggestions Overlay */}
            {showSuggestions && filteredStudents.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-100 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto divide-y divide-slate-100">
                {filteredStudents.map(s => (
                  <div 
                    key={s.id}
                    onClick={() => handleSelectSuggestion(s)}
                    className="px-4 py-2.5 hover:bg-indigo-50/60 cursor-pointer text-xs font-bold text-slate-700 flex justify-between items-center transition-colors"
                  >
                    <span>{s.name} <span className="text-[10px] text-slate-400 font-semibold">(Class {s.class}th)</span></span>
                    <span className="text-[10px] text-indigo-600 uppercase font-black">{s.assignedSport}</span>
                  </div>
                ))}
              </div>
            )}
            
            {showSuggestions && searchQuery.trim() !== "" && filteredStudents.length === 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-100 rounded-xl p-4 text-center text-xs text-slate-400 font-semibold shadow-xl z-30">
                No matching students located.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main printable report container */}
      <div className="printable-report-area">
        {reportType === 'student' ? (
          /* ===== STUDENT REPORT (Dynamic UI) ===== */
          selectedStudent ? (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 max-w-4xl mx-auto space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full pointer-events-none -z-0"></div>
              
              {/* Report Header */}
              <div className="border-b-4 border-indigo-600 pb-6 mb-8 flex justify-between items-start relative z-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Athletic Performance Report</h2>
                  <p className="text-slate-400 text-xs mt-1.5 font-bold uppercase tracking-wider">Academic Year 2026 - Term 2 Evaluation Log</p>
                </div>
                <div className="text-right">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl ml-auto mb-2 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                    <Award className="text-white" size={22} />
                  </div>
                  <p className="font-extrabold text-slate-800 text-sm">SportSphere Hub</p>
                </div>
              </div>

              {/* Student Profile Summary */}
              <div className="flex flex-col sm:flex-row gap-8 mb-10 border-b border-slate-100 pb-8">
                <div className="w-28 h-28 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border-2 border-indigo-100 shadow-sm flex items-center justify-center">
                  <div className="text-indigo-600 font-black text-2xl uppercase">
                    {selectedStudent.name.substring(0, 2)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 flex-1 text-xs font-semibold">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Student Name</span>
                    <span className="text-base font-black text-slate-800">{selectedStudent.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Student ID</span>
                    <span className="text-base font-black text-slate-800">{selectedStudent.id || 'STU-001'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Class Grade</span>
                    <span className="text-base font-black text-slate-800">Class {selectedStudent.class}th Grade</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Primary Sport</span>
                    <span className="text-base font-black text-indigo-600">{selectedStudent.assignedSport || selectedStudent.sport}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Height & Weight</span>
                    <span className="text-base font-black text-slate-800">{selectedStudent.height}cm / {selectedStudent.weight}kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">BMI & Weight Class</span>
                    <span className="text-base font-black text-slate-800">{selectedStudent.bmi} ({selectedStudent.bmiCategory})</span>
                  </div>
                </div>
              </div>

              {/* High impact grades grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 text-center">
                  <p className="text-[10px] font-black text-indigo-800 uppercase tracking-widest mb-1.5">Overall Performance Index</p>
                  <h3 className="text-4xl font-black text-indigo-600">{selectedPerformance?.overallScore || 85}%</h3>
                </div>
                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 text-center">
                  <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1.5">Fitness Standard</p>
                  <h3 className="text-3xl font-black text-emerald-600 mt-1 uppercase">{selectedPerformance?.fitnessLevel || 'Good'}</h3>
                </div>
                <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 text-center">
                  <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1.5">Regularity Attendance</p>
                  <h3 className="text-4xl font-black text-amber-600">{selectedPerformance?.attendance || 90}%</h3>
                </div>
              </div>

              {/* Dynamic Physical Indicators detail */}
              {selectedPerformance && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                    🏃‍♂️ Detailed Physical Capacities distribution
                  </h4>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-semibold">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Speed Capacity</span>
                      <span className="text-sm font-black text-slate-850">{selectedPerformance.speed}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Strength Index</span>
                      <span className="text-sm font-black text-slate-850">{selectedPerformance.strength}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Stamina reserve</span>
                      <span className="text-sm font-black text-slate-850">{selectedPerformance.stamina}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Agility Displacement</span>
                      <span className="text-sm font-black text-slate-850">{selectedPerformance.agility}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Flexibility Ratio</span>
                      <span className="text-sm font-black text-slate-850">{selectedPerformance.flexibility}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Accuracy target</span>
                      <span className="text-sm font-black text-slate-850">{selectedPerformance.accuracy}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Endurance Marker</span>
                      <span className="text-sm font-black text-slate-850">{selectedPerformance.endurance}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Reaction speed</span>
                      <span className="text-sm font-black text-slate-850">{selectedPerformance.reactionTime}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Insight Diagnostic */}
              {selectedPerformance?.aiInsight && (
                <div className="bg-gradient-to-r from-indigo-50/50 via-slate-50 to-indigo-50/20 p-6 rounded-2xl border border-indigo-100/40">
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Activity size={15} className="text-indigo-600" /> Professional AI Diagnostics & Growth Plan
                  </h4>
                  <p className="text-slate-600 italic text-xs leading-relaxed">
                    "{selectedPerformance.aiInsight}"
                  </p>
                </div>
              )}

              {/* Printable verification lines */}
              <div className="border-t border-dashed border-slate-200 mt-12 pt-10 grid grid-cols-3 gap-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest relative">
                <div>
                  <div className="w-full border-b border-slate-200/80 h-10 mb-2"></div>
                  <span>PE Coach Mentor</span>
                </div>
                <div>
                  <div className="w-full border-b border-slate-200/80 h-10 mb-2"></div>
                  <span>Academic Registrar</span>
                </div>
                <div>
                  <div className="w-full border-b border-slate-200/80 h-10 mb-2"></div>
                  <span>Principal Executive</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-450 text-xs font-semibold border border-slate-100 shadow-sm max-w-4xl mx-auto">
              Please use the search panel above to select a registered student report card.
            </div>
          )
        ) : (
          /* ===== INSTITUTE REPORT ===== */
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 max-w-4xl mx-auto space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full pointer-events-none -z-0"></div>

            {/* Report Header */}
            <div className="border-b-4 border-indigo-600 pb-6 mb-8 flex justify-between items-start relative z-10">
              <div>
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Institute Performance Report</h2>
                <p className="text-slate-400 text-xs mt-1.5 font-bold uppercase tracking-wider">Generated on: {new Date().toLocaleDateString('en-IN')}</p>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl ml-auto mb-2 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                  <Building2 className="text-white" size={22} />
                </div>
                <p className="font-extrabold text-slate-800 text-sm">SportSphere Hub</p>
              </div>
            </div>

            {/* Institute Info */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-10 text-xs font-semibold text-slate-700">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Institute Name</p>
                <p className="text-base font-extrabold text-slate-800">{mockInstituteReport.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">City</p>
                <p className="text-base font-extrabold text-slate-800">{mockInstituteReport.city}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">State</p>
                <p className="text-base font-extrabold text-slate-800">{mockInstituteReport.state}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Total Students</p>
                <p className="text-base font-extrabold text-slate-800">{mockInstituteReport.totalStudents}</p>
              </div>
            </div>

            {/* Score Summary */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 text-center">
                <p className="text-[10px] font-black text-indigo-800 uppercase tracking-widest mb-1.5">Average Performance Score</p>
                <h3 className="text-4xl font-black text-indigo-600">{mockInstituteReport.avgScore}%</h3>
              </div>
              <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 text-center">
                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1.5">Total Enrolled Athletes</p>
                <h3 className="text-4xl font-black text-emerald-600">{mockInstituteReport.totalStudents}</h3>
              </div>
            </div>

            {/* Students List Table */}
            <div className="mb-6">
              <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                <Users size={18} className="text-indigo-600" /> Active Roster Scores
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-wider border-b border-slate-100">
                      <th className="p-4 font-bold">#</th>
                      <th className="p-4 font-bold">Name</th>
                      <th className="p-4 font-bold">Class</th>
                      <th className="p-4 font-bold">Sport</th>
                      <th className="p-4 font-bold">Performance index</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {mockInstituteReport.students.map((student, index) => (
                      <tr key={index} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="p-4 text-slate-400">{index + 1}</td>
                        <td className="p-4 font-black text-slate-800">{student.name}</td>
                        <td className="p-4 text-slate-500">Class {student.class}</td>
                        <td className="p-4">
                          <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black border border-indigo-100 uppercase">
                            {student.sport}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                            student.score >= 85 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            student.score >= 70 ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                            'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {student.score}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Insight */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Activity size={15} className="text-indigo-600" /> Institute Overall evaluation diagnostics
              </h4>
              <p className="text-slate-600 italic text-xs leading-relaxed">
                "The institute shows a highly competitive overall performance benchmark with an average fitness score of {mockInstituteReport.avgScore}%. Students are actively participating in physical screening tasks with substantial structural developments across both tracking cohorts."
              </p>
            </div>

            {/* Printable verification lines */}
            <div className="border-t border-dashed border-slate-200 mt-12 pt-10 grid grid-cols-3 gap-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest relative">
              <div>
                <div className="w-full border-b border-slate-200/80 h-10 mb-2"></div>
                <span>Administrative head</span>
              </div>
              <div>
                <div className="w-full border-b border-slate-200/80 h-10 mb-2"></div>
                <span>Sports Director</span>
              </div>
              <div>
                <div className="w-full border-b border-slate-200/80 h-10 mb-2"></div>
                <span>Principal Executive</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Reports;
