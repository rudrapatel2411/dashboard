import React, { useState, useEffect } from 'react';
import { 
  Activity, PlusCircle, CheckCircle, ShieldAlert, Sparkles, 
  User, Award, ClipboardList, HelpCircle, BarChart3, BookOpen 
} from 'lucide-react';
import axios from 'axios';

const Performance = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedStudentInfo, setSelectedStudentInfo] = useState(null);
  
  // Historical ratings list
  const [history, setHistory] = useState([]);
  
  // Loading & UX states
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', title: '', isError: false });

  // Form states
  const [term, setTerm] = useState("TERM-1");
  const [speed, setSpeed] = useState("");
  const [strength, setStrength] = useState("");
  const [stamina, setStamina] = useState("");
  const [agility, setAgility] = useState("");
  const [flexibility, setFlexibility] = useState("");
  const [accuracy, setAccuracy] = useState("");
  const [endurance, setEndurance] = useState("");
  const [reactionTime, setReactionTime] = useState("");
  
  // Other aspects as defined in schema
  const [attendance, setAttendance] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [matchPerformance, setMatchPerformance] = useState("");

  const triggerToast = (title, message, isError = false) => {
    setToast({ show: true, title, message, isError });
    setTimeout(() => {
      setToast({ show: false, title: '', message: '', isError: false });
    }, 4500);
  };

  // Setup configuration with authorization header
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // Fetch active students roster on mount
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/students', getAuthConfig());
        setStudents(response.data);
      } catch (error) {
        triggerToast("Failed to load students", "Ensure server is online and you are logged in.", true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Fetch student info and historic ratings on selection
  useEffect(() => {
    if (!selectedStudentId) {
      setSelectedStudentInfo(null);
      setHistory([]);
      return;
    }

    const matched = students.find(s => s._id === selectedStudentId);
    setSelectedStudentInfo(matched || null);

    const fetchHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/performance/${selectedStudentId}`, getAuthConfig());
        setHistory(response.data);
      } catch (error) {
        setHistory([]);
      }
    };

    fetchHistory();
  }, [selectedStudentId, students]);

  // Handle new rating submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudentId) {
      triggerToast("Validation Alert", "Please select a student first.", true);
      return;
    }

    // Comprehensive numeric validations
    const sp = parseFloat(speed);
    const str = parseFloat(strength);
    const sta = parseFloat(stamina);
    const ag = parseFloat(agility);
    const flex = parseFloat(flexibility);
    const acc = parseFloat(accuracy);
    const end = parseFloat(endurance);
    const react = parseFloat(reactionTime);
    const att = parseFloat(attendance);
    const disc = parseFloat(discipline);
    const matchPerf = parseFloat(matchPerformance);

    if (
      [sp, str, sta, ag, flex, acc, end, react, att, matchPerf].some(val => isNaN(val) || val < 0 || val > 100)
    ) {
      triggerToast("Validation Alert", "All percentage ratings must be between 0 and 100.", true);
      return;
    }

    if (isNaN(disc) || disc < 1 || disc > 10) {
      triggerToast("Validation Alert", "Discipline rating must be between 1 and 10.", true);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        studentId: selectedStudentId,
        term: term === "TERM-1" ? "TERM-1" : "TERM-2",
        speed: sp,
        strength: str,
        stamina: sta,
        agility: ag,
        flexibility: flex,
        accuracy: acc,
        endurance: end,
        reactionTime: react,
        attendance: att,
        discipline: disc,
        matchPerformance: matchPerf
      };

      await axios.post('http://localhost:5000/api/performance', payload, getAuthConfig());
      
      triggerToast("Success!", `Performance scores for ${term} saved successfully!`, false);
      
      // Clear inputs
      setSpeed("");
      setStrength("");
      setStamina("");
      setAgility("");
      setFlexibility("");
      setAccuracy("");
      setEndurance("");
      setReactionTime("");
      setAttendance("");
      setDiscipline("");
      setMatchPerformance("");

      // Refresh student's evaluation progression list
      const response = await axios.get(`http://localhost:5000/api/performance/${selectedStudentId}`, getAuthConfig());
      setHistory(response.data);

    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to save performance score. Please check inputs.";
      triggerToast("Submission Failed", errMsg, true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Activity className="text-secondary w-8 h-8 animate-pulse" />
          Performance Evaluation
        </h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Record Term physical performance parameters, check matching schema guidelines, and log custom AI feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Selectors & Student Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Select Student Module */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-base font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              <User size={18} className="text-secondary" />
              Target Student Profile
            </h3>
            
            <select 
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/40 bg-slate-50/50 font-semibold"
              disabled={isLoading}
            >
              <option value="">-- Choose Student Roster --</option>
              {students.map(student => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.studentId})
                </option>
              ))}
            </select>

            {/* Selected Student Dashboard Preview */}
            {selectedStudentInfo ? (
              <div className="mt-6 bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3.5">
                <div className="flex items-center gap-3 border-b border-slate-200/60 pb-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-extrabold text-sm uppercase">
                    {selectedStudentInfo.name.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">{selectedStudentInfo.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Class {selectedStudentInfo.class}th • {selectedStudentInfo.age} yrs</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Assigned Sport</span>
                    <span className="font-extrabold text-slate-700 mt-0.5 inline-block">{selectedStudentInfo.assignedSport || "General Sports"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Coach Mentor</span>
                    <span className="font-extrabold text-slate-700 mt-0.5 inline-block">{selectedStudentInfo.coachName || "Coach Arthur"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">BMI Weight Category</span>
                    <span className="font-extrabold text-secondary mt-0.5 inline-block">{selectedStudentInfo.bmiCategory || "Normal"} ({selectedStudentInfo.bmi})</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Height & Weight</span>
                    <span className="font-extrabold text-slate-700 mt-0.5 inline-block">{selectedStudentInfo.height}cm / {selectedStudentInfo.weight}kg</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-xs font-semibold">
                Select a student from the dropdown menu to inspect profiles and active evaluations history.
              </div>
            )}
          </div>

          {/* Evaluation Period Selector */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-base font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-secondary" />
              Evaluation Term
            </h3>
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setTerm("TERM-1")}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  term === "TERM-1" 
                    ? 'bg-secondary text-white shadow-md shadow-blue-500/10' 
                    : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100 hover:text-slate-600'
                }`}
              >
                <CheckCircle size={14} /> Term 1
              </button>
              <button 
                type="button"
                onClick={() => setTerm("TERM-2")}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  term === "TERM-2" 
                    ? 'bg-secondary text-white shadow-md shadow-blue-500/10' 
                    : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100 hover:text-slate-600'
                }`}
              >
                <CheckCircle size={14} /> Term 2
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Entry Form & Progression Lists (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Input Form */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-secondary/5 to-transparent rounded-bl-full pointer-events-none"></div>

            <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <Sparkles className="text-secondary w-5 h-5 animate-pulse" />
              Enter Scoring Parameters (0 - 100)
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Metric Entry Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Metrics array mapper */}
                {[
                  { label: "Speed (🏃‍♂️)", state: speed, setter: setSpeed, placeholder: "0 - 100" },
                  { label: "Strength (🏋️‍♂️)", state: strength, setter: setStrength, placeholder: "0 - 100" },
                  { label: "Stamina (🫁)", state: stamina, setter: setStamina, placeholder: "0 - 100" },
                  { label: "Agility (⚡)", state: agility, setter: setAgility, placeholder: "0 - 100" },
                  { label: "Flexibility (🧘‍♂️)", state: flexibility, setter: setFlexibility, placeholder: "0 - 100" },
                  { label: "Accuracy (🎯)", state: accuracy, setter: setAccuracy, placeholder: "0 - 100" },
                  { label: "Endurance (📈)", state: endurance, setter: setEndurance, placeholder: "0 - 100" },
                  { label: "Reaction Time (⏱️)", state: reactionTime, setter: setReactionTime, placeholder: "0 - 100" },
                ].map((input, idx) => (
                  <div key={idx}>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      {input.label} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder={input.placeholder}
                      value={input.state}
                      onChange={(e) => input.setter(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/40 font-semibold text-center"
                      required
                    />
                  </div>
                ))}
              </div>

              {/* Other Schema Aspects */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-extrabold text-slate-700 text-xs uppercase tracking-wider mb-3">Other Compulsory Aspects</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Attendance (%) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g. 92"
                      value={attendance}
                      onChange={(e) => setAttendance(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/40 font-semibold text-center"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Discipline (1 - 10) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      placeholder="e.g. 9"
                      value={discipline}
                      onChange={(e) => setDiscipline(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/40 font-semibold text-center"
                      required
                    />
                  </div>

                  {/* Schema Align: matchPerformance */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Match Performance (%) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g. 85"
                      value={matchPerformance}
                      onChange={(e) => setMatchPerformance(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/40 font-semibold text-center"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Wrapper */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedStudentId}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-md ${
                    isSubmitting || !selectedStudentId
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-secondary to-primary hover:from-blue-600 hover:to-indigo-900 text-white shadow-blue-500/10 hover:shadow-xl hover:scale-[1.01]'
                  }`}
                >
                  <PlusCircle size={16} />
                  {isSubmitting ? 'Saving Metrics...' : 'Save Performance Data'}
                </button>
              </div>

            </form>
          </div>

          {/* Historical Progression Panel */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-base font-extrabold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <BarChart3 size={18} className="text-secondary" />
              Evaluation History & AI Insights
            </h3>

            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((record) => (
                  <div key={record._id} className="border border-slate-100 rounded-2xl p-5 hover:shadow-sm transition-shadow bg-slate-50/50">
                    
                    {/* Header bar */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="px-3 py-1 bg-blue-50 text-secondary text-xs font-black rounded-lg border border-blue-100">
                          {record.term}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold ml-2">
                          Logged: {new Date(record.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* Overall Fit rating */}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        record.fitnessLevel === 'Excellent' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        record.fitnessLevel === 'Good' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        record.fitnessLevel === 'Average' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-red-50 text-red-700 border border-red-100'
                      }`}>
                        {record.fitnessLevel || "Average"} Fit
                      </span>
                    </div>

                    {/* Progress grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-4 pt-3 border-t border-slate-100">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Overall Score</span>
                        <span className="font-extrabold text-slate-800 text-sm mt-0.5 inline-block">{record.overallScore || "0"}%</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Attendance Rate</span>
                        <span className="font-extrabold text-slate-800 text-sm mt-0.5 inline-block">{record.attendance || "0"}%</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Discipline Marker</span>
                        <span className="font-extrabold text-slate-800 text-sm mt-0.5 inline-block">{record.discipline || "0"}/10</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Match Score</span>
                        <span className="font-extrabold text-slate-800 text-sm mt-0.5 inline-block">{record.matchPerformance || "0"}%</span>
                      </div>
                    </div>

                    {/* AI Insights text block */}
                    {record.aiInsight && (
                      <div className="mt-3 bg-white border border-slate-100 rounded-xl p-3 text-xs text-slate-600 font-semibold leading-relaxed">
                        <span className="font-black text-secondary uppercase text-[8px] tracking-widest block mb-1.5">Auto AI Diagnostic Evaluation</span>
                        {record.aiInsight}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-xs font-semibold">
                No past evaluation entries located for this student record. Save parameters above to log first rating!
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Reusable Toast Alerts */}
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
    </div>
  );
};

export default Performance;
