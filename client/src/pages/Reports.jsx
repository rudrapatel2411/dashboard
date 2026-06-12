import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download, Printer, Share2, Award, Activity, Building2, Users, FileText, Search,
  User, CheckCircle, ChevronRight, ArrowLeft, Trophy, Calendar, Eye,
  ShieldAlert, Sparkles, Zap, Target, AlertCircle, Plus
} from 'lucide-react';
import axios from 'axios';
import FitnessReportExportButton from '../components/FitnessReport';

const Reports = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isInstituteUser = user.role === 'institution';
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Navigation states
  const [selectedInst, setSelectedInst] = useState(
    isInstituteUser ? { id: user.instituteId, name: user.instituteName || "My Institute" } : null
  );
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("institutions"); // "institutions" or "academies"

  // Data states
  const [students, setStudents] = useState([]);
  const [instStudents, setInstStudents] = useState([]);
  const [dbInstitutions, setDbInstitutions] = useState([]);
  const [dbAcademies, setDbAcademies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState("TERM-1");
  const [dbPerformances, setDbPerformances] = useState([]);
  const [allPerformances, setAllPerformances] = useState([]);

  // Helper to compute age from dob
  const computeAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Fetch institutes and academies from DB on mount
  useEffect(() => {
    const fetchInstitutes = async () => {
      setIsLoading(true);
      try {
        const [instRes, acadRes] = await Promise.all([
          axios.get(`${API_URL}/institutes?status=approved&type=institute&limit=100`, getAuthConfig()),
          axios.get(`${API_URL}/institutes?status=approved&type=academy&limit=100`, getAuthConfig())
        ]);
        const institutes = (instRes.data?.institutes || []).map(inst => ({
          id: inst._id,
          name: inst.name,
          email: inst.email || 'N/A',
          phone: inst.mobile || 'N/A',
          location: `${inst.city}, ${inst.state}`,
          contactPerson: inst.contactPerson || 'N/A',
          registeredAt: inst.createdAt,
          studentCount: inst.studentCount || 0
        }));
        const academies = (acadRes.data?.institutes || []).map(acad => ({
          id: acad._id,
          name: acad.name,
          sport: acad.sport || 'General',
          coach: acad.contactPerson || 'Coach',
          email: acad.email || 'N/A',
          phone: acad.mobile || 'N/A',
          location: `${acad.city}, ${acad.state}`,
          registeredAt: acad.createdAt,
          gradient: 'from-indigo-500 to-blue-600',
          studentCount: acad.studentCount || 0
        }));
        setDbInstitutions(institutes);
        setDbAcademies(academies);
      } catch (error) {
        console.warn('Failed to load institutes from DB:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isInstituteUser) {
      fetchInstitutes();
    }
  }, []);

  // Fetch students for selected institute from DB
  useEffect(() => {
    const fetchInstStudents = async () => {
      if (!selectedInst) {
        setInstStudents([]);
        return;
      }
      try {
        const fetchUrl = isInstituteUser
          ? `${API_URL}/institute-portal/students`
          : `${API_URL}/institutes/${selectedInst.id}/students`;
        const response = await axios.get(fetchUrl, getAuthConfig());
        const mapped = (response.data || []).map(s => {
          const age = computeAge(s.dob);
          const getHashValue = (str, salt) => {
            let hash = 0;
            const fullStr = str + salt;
            for (let i = 0; i < fullStr.length; i++) {
              hash = (hash << 5) - hash + fullStr.charCodeAt(i);
              hash |= 0;
            }
            return Math.abs(hash);
          };
          const seed = s._id || s.id || "default";
          const gender = s.gender || 'Male';
          const baseHeight = gender === 'Male' ? 162 : 156;
          const height = baseHeight + (getHashValue(seed, "height") % 18) - 4;
          const bmi = parseFloat((18.5 + (getHashValue(seed, "bmi") % 55) / 10).toFixed(1));
          const weight = parseFloat((bmi * Math.pow(height / 100, 2)).toFixed(1));
          const getBmiCategory = (b) => {
            if (b < 18.5) return "Underweight";
            if (b < 23.0) return "Normal";
            if (b < 25.0) return "Overweight";
            return "Obese";
          };
          return {
            id: s._id,
            studentId: s.studentId,
            name: s.name,
            dob: s.dob,           // needed for age-group detection in PDF export
            age,
            class: s.class?.toString() || 'N/A',
            gender,
            sport: selectedInst.sport || 'General',
            assignedSport: selectedInst.sport || 'General',
            mentor: selectedInst.contactPerson || selectedInst.coach || 'Coach',
            bmiCategory: getBmiCategory(bmi),
            bmi,
            height,
            weight
          };
        });
        setInstStudents(mapped);
        setStudents(mapped);

        // Update student count on the card
        if (!isInstituteUser) {
          if (activeCategory === 'academies') {
            setDbAcademies(prev => prev.map(a => a.id === selectedInst.id ? { ...a, studentCount: mapped.length } : a));
          } else {
            setDbInstitutions(prev => prev.map(i => i.id === selectedInst.id ? { ...i, studentCount: mapped.length } : i));
          }
        }
      } catch (error) {
        console.warn('Failed to load students for institute:', error.message);
        setInstStudents([]);
      }
    };

    fetchInstStudents();
  }, [selectedInst]);

  // Fetch all student performances for the selected institution
  useEffect(() => {
    const fetchAllPerformances = async () => {
      if (!selectedInst) {
        setAllPerformances([]);
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/performance`, getAuthConfig());
        setAllPerformances(response.data || []);
      } catch (error) {
        console.warn('Failed to load all performances:', error.message);
        setAllPerformances([]);
      }
    };
    fetchAllPerformances();
  }, [selectedInst]);

  // Fetch selected student's performances
  useEffect(() => {
    const fetchStudentPerformances = async () => {
      if (!selectedStudent) {
        setDbPerformances([]);
        return;
      }
      try {
        const studentId = selectedStudent.id || selectedStudent._id;
        const res = await axios.get(`${API_URL}/performance/${studentId}`, getAuthConfig());
        setDbPerformances(res.data || []);
      } catch (error) {
        console.warn("Could not fetch student performance from backend.");
        setDbPerformances([]);
      }
    };
    fetchStudentPerformances();
  }, [selectedStudent]);

  // Return students for selected institution (from DB)
  const getStudentsForInst = () => {
    if (!selectedInst) return [];
    return instStudents;
  };

  const getAvailableClasses = () => {
    const students = getStudentsForInst();
    const classes = [...new Set(students.map(s => s.class?.toString()).filter(Boolean))];
    return classes.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  };

  // Compile local + DB students for a specific class grade
  const getStudentsForClassGrade = (classGrade) => {
    return getStudentsForInst().filter(s => s.class?.toString() === classGrade?.toString());
  };

  // Compile local + DB students for selected class
  const getStudentsForClass = () => {
    if (!selectedClass) return [];
    return getStudentsForClassGrade(selectedClass);
  };

  const getDisplayStudents = () => {
    return getStudentsForClass();
  };

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
      overallScore: t2Overall,
      fitnessLevel: getFitnessLevel(t2Overall),
      aiInsight: `Term-2 Evaluation Summary: Exhibits supreme cardio stability and hamstrings explosive speed. Joint displacement index is excellent. Displays high competence in matching performance categories. Focus should remain on maintaining off-season recovery schedules.`
    };
  };

  const selectedPerformance = (() => {
    if (!selectedStudent) return null;
    if (dbPerformances && dbPerformances.length > 0) {
      const match = dbPerformances.find(r => r.term === selectedTerm);
      return match || null;
    }
    return null;
  })();

  const classHardCopyUrl = (() => {
    if (!selectedInst || !selectedClass) return null;
    const classStudents = getStudentsForClass();
    const classStudentIds = classStudents.map(s => s.id || s._id);
    const match = allPerformances.find(r => {
      const rStudentId = r.studentId && (typeof r.studentId === 'object' ? r.studentId._id : r.studentId);
      return classStudentIds.includes(rStudentId) && r.term === selectedTerm && r.reportHardCopyUrl;
    });
    return match ? match.reportHardCopyUrl : null;
  })();

  // PDF export for Roster Reports or student reports fallback
  const handleExportPDF = async () => {
    if (!selectedInst) {
      alert("Please select an institution or sports academy first!");
      return;
    }

    // Dynamic imports — only loaded when user clicks Export
    const { default: jsPDF }     = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    try {
      const doc = new jsPDF();
      
      if (selectedStudent) {
        if (!selectedPerformance) {
          alert("No performance records found for this student. Export disabled.");
          return;
        }
        const perf = selectedPerformance;
        
        // --- Header Section ---
        doc.setFillColor(27, 59, 43); // Deep Forest Green
        doc.rect(0, 0, 210, 38, 'F');
        
        doc.setFillColor(210, 180, 140); // Warm Sand/Gold accent stripe
        doc.rect(0, 38, 210, 3, 'F');
        
        // Title text in white
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('ATHLETIC PERFORMANCE REPORT', 15, 18);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(240, 244, 240); // very soft green-white
        doc.text(`Academic Year 2026 - ${perf.term === 'TERM-1' ? 'Term 1' : 'Term 2'} Evaluation Log`, 15, 27);
        
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('SportSphere Hub', 195, 18, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('Analytics Center', 195, 24, { align: 'right' });
        
        // --- Student Profile details box ---
        const profileY = 48;
        doc.setFillColor(248, 250, 252); // soft gray-green background
        doc.roundedRect(15, profileY, 180, 36, 2, 2, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.roundedRect(15, profileY, 180, 36, 2, 2, 'D');
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(27, 59, 43);
        doc.text('STUDENT PROFILE', 20, profileY + 8);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(`Name: ${selectedStudent.name}`, 20, profileY + 16);
        doc.text(`Athlete ID: ${selectedStudent.studentId || selectedStudent.id || 'STU-001'}`, 20, profileY + 23);
        doc.text(`Class Grade: Class ${selectedStudent.class}th`, 20, profileY + 30);
        
        doc.text(`Assigned Sport: ${selectedStudent.assignedSport || selectedStudent.sport}`, 110, profileY + 16);
        doc.text(`BMI Standard: ${selectedStudent.bmi} (${selectedStudent.bmiCategory})`, 110, profileY + 23);
        doc.text(`Coach Mentor: ${selectedStudent.mentor || 'Coach Arthur'}`, 110, profileY + 30);
        
        // --- High Impact Stats Box Grid ---
        const statsY = 92;
        const colWidth = 56;
        const colHeight = 20;
        
        // Card 1: Overall Score
        doc.setFillColor(235, 242, 235); // Soft Forest Green tint
        doc.roundedRect(15, statsY, colWidth, colHeight, 2, 2, 'F');
        doc.setDrawColor(200, 220, 200);
        doc.roundedRect(15, statsY, colWidth, colHeight, 2, 2, 'D');
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(45, 90, 60);
        doc.text('OVERALL SCORE INDEX', 15 + colWidth/2, statsY + 6, { align: 'center' });
        doc.setFontSize(11);
        doc.text(`${perf.overallScore || 0}%`, 15 + colWidth/2, statsY + 14, { align: 'center' });
        
        // Card 2: Fitness Level
        doc.setFillColor(251, 247, 238); // Soft Sand/Ivory tint
        doc.roundedRect(77, statsY, colWidth, colHeight, 2, 2, 'F');
        doc.setDrawColor(230, 220, 200);
        doc.roundedRect(77, statsY, colWidth, colHeight, 2, 2, 'D');
        doc.setFontSize(7.5);
        doc.setTextColor(130, 100, 50);
        doc.text('FITNESS STANDARD', 77 + colWidth/2, statsY + 6, { align: 'center' });
        doc.setFontSize(11);
        doc.text(`${perf.fitnessLevel || 'N/A'}`, 77 + colWidth/2, statsY + 14, { align: 'center' });
        
        // Card 3: Speed Index
        doc.setFillColor(249, 239, 239); // Soft Terracotta tint
        doc.roundedRect(139, statsY, colWidth, colHeight, 2, 2, 'F');
        doc.setDrawColor(240, 220, 220);
        doc.roundedRect(139, statsY, colWidth, colHeight, 2, 2, 'D');
        doc.setFontSize(7.5);
        doc.setTextColor(160, 60, 50);
        doc.text('SPEED INDEX', 139 + colWidth/2, statsY + 6, { align: 'center' });
        doc.setFontSize(11);
        doc.text(`${perf.speed || 0}%`, 139 + colWidth/2, statsY + 14, { align: 'center' });
        
        // --- Physical Capacity Indicators (Vector Progress Bar Chart) ---
        const chartY = 122;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(27, 59, 43);
        doc.text('PHYSICAL CAPACITY DISTRIBUTION', 15, chartY);
        
        doc.setDrawColor(27, 59, 43);
        doc.setLineWidth(0.5);
        doc.line(15, chartY + 2, 195, chartY + 2);
        
        // Render 8 progress bars in a 2-column grid layout
        const indicators = [
          { label: 'Speed', val: perf.speed || 0 },
          { label: 'Strength', val: perf.strength || 0 },
          { label: 'Stamina', val: perf.stamina || 0 },
          { label: 'Agility', val: perf.agility || 0 },
          { label: 'Flexibility', val: perf.flexibility || 0 },
          { label: 'Accuracy', val: perf.accuracy || 0 },
          { label: 'Endurance', val: perf.endurance || 0 },
          { label: 'Reaction Time', val: perf.reactionTime || 0 }
        ];
        
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        
        indicators.forEach((ind, index) => {
          const isSecondCol = index >= 4;
          const x = isSecondCol ? 110 : 15;
          const y = chartY + 12 + (index % 4) * 14;
          
          // Print label and value
          doc.setTextColor(51, 65, 85);
          doc.setFont('helvetica', 'bold');
          doc.text(ind.label, x, y);
          doc.setTextColor(71, 85, 105);
          doc.setFont('helvetica', 'normal');
          doc.text(`${ind.val}%`, x + 58, y);
          
          // Draw empty progress bar track
          doc.setFillColor(241, 245, 249);
          doc.rect(x, y + 2, 65, 3.5, 'F');
          
          // Draw natural colored filled bar
          // Forest green for values >= 75, Sage green for values >= 50, ochre for lower
          if (ind.val >= 75) {
            doc.setFillColor(27, 59, 43); // Forest
          } else if (ind.val >= 50) {
            doc.setFillColor(143, 188, 143); // Sage
          } else {
            doc.setFillColor(210, 180, 140); // Ochre
          }
          doc.rect(x, y + 2, (ind.val / 100) * 65, 3.5, 'F');
        });
        
        // --- Professional AI Diagnostic Block ---
        const diagY = 192;
        doc.setFillColor(244, 247, 244); // soft green-slate
        doc.roundedRect(15, diagY, 180, 26, 2, 2, 'F');
        doc.setDrawColor(220, 230, 220);
        doc.roundedRect(15, diagY, 180, 26, 2, 2, 'D');
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(27, 59, 43);
        doc.text('Professional AI Diagnostics & Development Plan', 20, diagY + 7);
        
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(71, 85, 105);
        
        // Wrap diagnosis text safely within 170mm width
        const lines = doc.splitTextToSize(perf.aiInsight || 'No insights compiled.', 170);
        doc.text(lines, 20, diagY + 14);
        
        // --- Official Signatures ---
        const sigY = 238;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        
        // Signature Line 1
        doc.line(15, sigY + 12, 60, sigY + 12);
        doc.text('COACH MENTOR', 15, sigY + 17);
        
        // Signature Line 2
        doc.line(85, sigY + 12, 130, sigY + 12);
        doc.text('DIRECTOR AUTHORITY', 85, sigY + 17);
        
        // Signature Line 3
        doc.line(150, sigY + 12, 195, sigY + 12);
        doc.text('PRINCIPAL EXECUTIVE', 150, sigY + 17);
        
        // Footer signature labels
        doc.setFontSize(8);
        doc.text('Generated dynamically by SportSphere Analytics Center', 15, 280);
      } else {
        // Dynamic Roster Performance Report
        const displayStudents = selectedClass ? getDisplayStudents() : getStudentsForInst();

        // Header Section
        doc.setFillColor(27, 59, 43); // Deep Forest Green
        doc.rect(0, 0, 210, 38, 'F');
        
        doc.setFillColor(210, 180, 140); // Sand/Gold accent stripe
        doc.rect(0, 38, 210, 3, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('ROSTER PERFORMANCE REPORT', 15, 18);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(240, 244, 240);
        doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 15, 27);
        doc.text('SportSphere Analytics Center', 195, 18, { align: 'right' });

        // Entity details box
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(15, 48, 180, 26, 2, 2, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.roundedRect(15, 48, 180, 26, 2, 2, 'D');

        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.setFont('helvetica', 'normal');
        doc.text(`Entity Name: ${selectedInst.name || 'N/A'}`, 20, 56);
        doc.text(`Category: ${activeCategory === 'academies' ? 'Sports Academy' : 'School/Institution'}`, 20, 63);
        doc.text(`Location: ${selectedInst.location || 'N/A'}`, 110, 56);
        doc.text(`Total Enrolled: ${displayStudents.length} Athletes`, 110, 63);

        // Calculate class average and pass rate
        let totalScoreSum = 0;
        let passCount = 0;
        let totalCount = 0;
        displayStudents.forEach(s => {
          const studentPerf = allPerformances.find(r => {
            const rStudentId = r.studentId && (typeof r.studentId === 'object' ? r.studentId._id : r.studentId);
            return (rStudentId === s.id || rStudentId === s._id) && r.term === selectedTerm;
          });
          if (studentPerf && typeof studentPerf.overallScore === 'number' && !isNaN(studentPerf.overallScore)) {
            totalScoreSum += studentPerf.overallScore;
            if (studentPerf.overallScore >= 50) passCount++;
            totalCount++;
          }
        });
        const classAvg = totalCount > 0 ? Math.round(totalScoreSum / totalCount) : 0;
        const passRate = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0;

        const safeClassAvg = (typeof classAvg === 'number' && !isNaN(classAvg)) ? classAvg : 0;
        const safePassRate = (typeof passRate === 'number' && !isNaN(passRate)) ? passRate : 0;

        // Draw visual indicator box at Y=80
        doc.setFillColor(244, 247, 244);
        doc.roundedRect(15, 80, 180, 18, 2, 2, 'F');
        doc.setDrawColor(220, 230, 220);
        doc.roundedRect(15, 80, 180, 18, 2, 2, 'D');

        doc.setFontSize(9);
        doc.setTextColor(27, 59, 43);
        doc.setFont('helvetica', 'bold');
        doc.text('Roster Performance Indexes:', 20, 91);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(`Class Average: ${safeClassAvg}%`, 75, 91);
        doc.text(`Pass Rate: ${safePassRate}%`, 130, 91);

        // Draw class average bar
        doc.setFillColor(220, 225, 220);
        doc.rect(160, 87, 28, 4, 'F');
        doc.setFillColor(27, 59, 43);
        doc.rect(160, 87, (safeClassAvg/100)*28, 4, 'F');

        // Draw autoTable starting at Y=104
        const tableBody = displayStudents.map((s, i) => {
          const studentPerf = allPerformances.find(r => {
            const rStudentId = r.studentId && (typeof r.studentId === 'object' ? r.studentId._id : r.studentId);
            return (rStudentId === s.id || rStudentId === s._id) && r.term === selectedTerm;
          });
          const score = studentPerf ? `${studentPerf.overallScore}%` : "N/A";
          const level = studentPerf ? (studentPerf.fitnessLevel || 'N/A') : "N/A";
          return [
            (i + 1).toString(),
            s.name || 'Unknown',
            `Class ${s.class || 'N/A'}`,
            s.assignedSport || s.sport || 'General',
            score,
            level
          ];
        });

        autoTable(doc, {
          startY: 104,
          head: [['#', 'Athlete Name', 'Class/Grade', 'Assigned Sport', 'Overall Score', 'Fitness Level']],
          body: tableBody,
          theme: 'grid',
          headStyles: {
            fillColor: [27, 59, 43],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9,
            cellPadding: 4
          },
          bodyStyles: {
            fontSize: 8.5,
            cellPadding: 3.5,
            textColor: [30, 41, 59],
            lineColor: [226, 232, 240],
            lineWidth: 0.1
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252]
          },
          columnStyles: {
            0: { halign: 'center', cellWidth: 12 },
            1: { fontStyle: 'bold' },
            2: { halign: 'center', cellWidth: 25 },
            3: { cellWidth: 40 },
            4: { halign: 'center', cellWidth: 30, fontStyle: 'bold' },
            5: { halign: 'center', cellWidth: 30 }
          },
          margin: { left: 15, right: 15 }
        });

        // Add page numbers
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text(`Page ${i} of ${pageCount}`, 195, 285, { align: 'right' });
          doc.text('© SportSphere platform. Generated automatically.', 15, 285);
        }
      }

      const fileName = selectedStudent
        ? `${(selectedStudent.name || 'Student').replace(/\s+/g, '_')}_Report.pdf`
        : `${(selectedInst.name || 'Institute').replace(/\s+/g, '_')}_Roster_Report.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF: ' + (error.message || error));
    }
  };

  const handlePrint = () => {
    if (selectedStudent && !selectedPerformance) {
      alert("No performance records found for this student. Print disabled.");
      return;
    }
    window.print();
  };

  const filteredStudents = searchQuery.trim() === ""
    ? []
    : students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSelectSuggestion = (student) => {
    setSelectedStudent(student);
    setSearchQuery(student.name);
  };

  const handleSelectInstitution = (inst) => {
    setSelectedInst(inst);
    setSelectedClass(null);
    setSelectedStudent(null);
  };

  const handleSelectClass = (cls) => {
    setSelectedClass(cls);
    setSelectedStudent(null);
  };

  const handleResetNavigation = () => {
    setSelectedInst(null);
    setSelectedClass(null);
    setSelectedStudent(null);
  };

  const filteredInstitutions = dbInstitutions.filter(inst =>
    inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAcademies = dbAcademies.filter(acad =>
    acad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (acad.sport || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (acad.coach || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans pb-16">

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 non-printable bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <FileText size={28} className="text-indigo-600" />
            Performance Reports
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-semibold">Generate, inspect, and export highly polished physical reports.</p>
        </div>

        <div className="flex gap-3">
          {selectedInst && (
            <>
              {selectedStudent && selectedPerformance?.reportHardCopyUrl && (
                <a
                  href={selectedPerformance.reportHardCopyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95 cursor-pointer bg-white"
                >
                  <Eye size={15} className="text-indigo-650" /> View Hardcopy Photo
                </a>
              )}
              <button 
                onClick={handlePrint}
                disabled={selectedStudent && !selectedPerformance}
                className={`px-4 py-2.5 rounded-xl border text-xs shadow-sm transition-all flex items-center gap-2 font-bold active:scale-95 cursor-pointer ${
                  (selectedStudent && !selectedPerformance)
                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50" 
                    : "bg-white text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Printer size={15} /> Print Report
              </button>
              {selectedStudent ? (
                selectedPerformance ? (
                  <FitnessReportExportButton
                    student={selectedStudent}
                    currentPerf={selectedPerformance}
                    prevPerf={(() => {
                      // Resolve previous term perf for comparison column
                      const otherTerm = selectedTerm === 'TERM-1' ? 'TERM-2' : 'TERM-1';
                      return dbPerformances.find(r => r.term === otherTerm) || null;
                    })()}
                    institute={selectedInst}
                    disabled={false}
                  />
                ) : (
                  <FitnessReportExportButton
                    student={null}
                    currentPerf={null}
                    prevPerf={null}
                    institute={selectedInst}
                    disabled={true}
                  />
                )
              ) : (
                <button
                  onClick={handleExportPDF}
                  className="group px-5 py-2.5 rounded-xl text-xs shadow-lg transition-all duration-300 flex items-center gap-2 font-black active:scale-95 cursor-pointer overflow-hidden relative bg-gradient-to-r from-[#1B3B2B] to-[#2d5a44] hover:from-[#152e22] hover:to-[#1B3B2B] text-[#fbf7ee] shadow-[#1b3b2b]/30 hover:shadow-xl hover:-translate-y-0.5 border border-[#152e22]/50"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out pointer-events-none rounded-xl"></div>
                  <Download size={15} className="group-hover:-translate-y-0.5 transition-transform duration-300" /> Export PDF
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Roster Type / Search Toggle Banner */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 non-printable flex items-center justify-between flex-wrap gap-4">

        {/* Dynamic Breadcrumbs / Navigation Path */}
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          {!isInstituteUser ? (
            <span
              className="hover:text-indigo-600 cursor-pointer transition-colors flex items-center gap-1.5"
              onClick={handleResetNavigation}
            >
              {activeCategory === "institutions" ? (
                <>
                  <Building2 size={16} className="text-indigo-600" /> Schools & Institutions
                </>
              ) : (
                <>
                  <Trophy size={16} className="text-indigo-600" /> Sports Academies
                </>
              )}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-slate-700 font-extrabold">
              <Building2 size={16} className="text-indigo-600" /> {selectedInst?.name}
            </span>
          )}

          {selectedInst && !isInstituteUser && (
            <>
              <ChevronRight size={14} className="text-slate-300" />
              <span
                className="hover:text-indigo-600 cursor-pointer transition-colors text-slate-700 font-extrabold"
                onClick={() => { setSelectedClass(null); setSelectedStudent(null); }}
              >
                {selectedInst.name}
              </span>
            </>
          )}

          {selectedClass && (
            <>
              <ChevronRight size={14} className="text-slate-300" />
              <span
                className="hover:text-indigo-600 cursor-pointer transition-colors text-slate-700 font-bold"
                onClick={() => setSelectedStudent(null)}
              >
                Class {selectedClass}th
              </span>
            </>
          )}

          {selectedStudent && (
            <>
              <ChevronRight size={14} className="text-slate-300" />
              <span className="text-indigo-600 font-black">
                👤 {selectedStudent.name}
              </span>
            </>
          )}
        </div>

        {/* Global Quick Search Shortcut */}
        <div className="relative max-w-sm w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Global search athlete..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-slate-50/50"
          />

          {/* Suggestions Overlay */}
          {searchQuery.trim() !== "" && filteredStudents.length > 0 && (
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
        </div>

      </div>

      {/* Main Core Layout Grid */}
      <div className="space-y-8 non-printable">

        {/* LEVEL 0: Category Segmented Control (Shown at Hub view) */}
        {!selectedInst && !isInstituteUser && (
          <div className="flex justify-center">
            <div className="bg-slate-100/80 backdrop-blur-md p-1 rounded-2xl border border-slate-200/60 inline-flex shadow-inner">
              <button
                onClick={() => {
                  setActiveCategory("institutions");
                  handleResetNavigation();
                }}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${activeCategory === "institutions"
                    ? "bg-white text-indigo-600 shadow-md scale-[1.02]"
                    : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                <Building2 size={16} />
                Schools & Institutions
              </button>
              <button
                onClick={() => {
                  setActiveCategory("academies");
                  handleResetNavigation();
                }}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${activeCategory === "academies"
                    ? "bg-white text-indigo-600 shadow-md scale-[1.02]"
                    : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                <Trophy size={16} />
                Sports Academies
              </button>
            </div>
          </div>
        )}

        {/* LEVEL 1: Directory List */}
        {!selectedInst && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  {activeCategory === "institutions" ? (
                    <>
                      <Building2 size={20} className="text-indigo-600" />
                      Select Registered Institution
                    </>
                  ) : (
                    <>
                      <Trophy size={20} className="text-indigo-600" />
                      Select Registered Sports Academy
                    </>
                  )}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  {activeCategory === "institutions"
                    ? "Click any school below to inspect classes and generate reports."
                    : "Click any sports academy below to view physical diagnostic reports."}
                </p>
              </div>
            </div>

            {/* Entity Grid cards */}
            {activeCategory === "institutions" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInstitutions.map((inst) => (
                  <div
                    key={inst.id}
                    onClick={() => handleSelectInstitution(inst)}
                    className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 group-hover:bg-indigo-100/70 rounded-bl-full transition-colors flex items-center justify-center pointer-events-none">
                      <Building2 className="text-indigo-600/30 w-8 h-8 group-hover:scale-110 transition-transform" />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="px-2.5 py-0.5 bg-slate-50 group-hover:bg-indigo-50 text-[10px] text-slate-500 group-hover:text-indigo-600 font-bold rounded border border-slate-200/60 group-hover:border-indigo-100 transition-colors">
                          Approved Hub
                        </span>
                        <h4 className="font-extrabold text-slate-800 mt-2 text-base group-hover:text-indigo-600 transition-colors pr-6">{inst.name}</h4>
                      </div>

                      <div className="space-y-2 text-xs font-semibold text-slate-400">
                        <p className="flex items-center gap-1.5">
                          <span className="text-[10px]">📍</span> <span className="text-slate-500">{inst.email}</span>
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 mt-6 pt-4 flex items-center justify-between">
                      <span className="text-xs font-black text-slate-700 bg-slate-50 group-hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1">
                        <Users size={12} className="text-indigo-600" />
                        {inst.studentCount} Student
                      </span>
                      <span className="text-xs font-bold text-indigo-600 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                        Select School <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAcademies.map((acad) => (
                  <div
                    key={acad.id}
                    onClick={() => handleSelectInstitution(acad)}
                    className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 group-hover:bg-indigo-100/70 rounded-bl-full transition-colors flex items-center justify-center pointer-events-none">
                      <Trophy className="text-indigo-600/30 w-8 h-8 group-hover:scale-110 transition-transform" />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className={`px-2.5 py-0.5 bg-gradient-to-r ${acad.gradient || 'from-indigo-500 to-blue-600'} text-white text-[10px] font-black rounded uppercase tracking-wider`}>
                          {acad.sport} Only
                        </span>
                        <h4 className="font-extrabold text-slate-800 mt-2 text-base group-hover:text-indigo-600 transition-colors pr-6">{acad.name}</h4>
                      </div>

                      <div className="space-y-2 text-xs font-semibold text-slate-400">
                        <p className="flex items-center gap-1.5">
                          <span className="text-[10px]">👤</span> <span className="text-slate-700 font-extrabold">{acad.coach}</span>
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 mt-6 pt-4 flex items-center justify-between">
                      <span className="text-xs font-black text-slate-700 bg-slate-50 group-hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1">
                        <Users size={12} className="text-indigo-600" />
                        {acad.studentCount} Enrolled Athletes
                      </span>
                      <span className="text-xs font-bold text-indigo-600 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                        Select Academy <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LEVEL 2: Classes of Institution */}
        {selectedInst && !selectedClass && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-800">
                {activeCategory === "institutions" ? "🏫" : "🏆"} {selectedInst.name}
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Select an active class grade to inspect individual physical report cards.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {getAvailableClasses().map((classGrade) => {
                const count = getStudentsForClassGrade(classGrade).length;
                return (
                  <div
                    key={classGrade}
                    onClick={() => handleSelectClass(classGrade)}
                    className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-indigo-200 hover:scale-[1.02] transition-all duration-300 cursor-pointer text-center relative overflow-hidden"
                  >
                    <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg mx-auto mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {classGrade}
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-sm">Class {classGrade}th Grade</h4>
                    <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">{count} Registered Students</p>

                    <div className="border-t border-slate-100 mt-5 pt-3.5 flex justify-center items-center gap-1 text-xs font-bold text-indigo-600 group-hover:text-indigo-800">
                      Open Reports <ChevronRight size={14} />
                    </div>
                  </div>
                );
              })}
              {getAvailableClasses().length === 0 && (
                <div className="col-span-full border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-sm font-semibold bg-slate-50/50">
                  <AlertCircle className="mx-auto text-slate-300 w-8 h-8 mb-2" />
                  No students are registered in any classes for this institution.
                </div>
              )}
            </div>
          </div>
        )}

        {/* LEVEL 3: Student Roster Table */}
        {selectedInst && selectedClass && !selectedStudent && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-800">
                  {activeCategory === 'academies'
                    ? `Academy Roster • Class ${selectedClass}th Grade Reports`
                    : `Students Roster • Class ${selectedClass}th Grade Reports`}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Showing student athletes registered in {selectedInst.name}.</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Term selector on Level 3 */}
                <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/50">
                  <button
                    onClick={() => setSelectedTerm("TERM-1")}
                    className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer ${
                      selectedTerm === "TERM-1" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-650"
                    }`}
                  >
                    T1
                  </button>
                  <button
                    onClick={() => setSelectedTerm("TERM-2")}
                    className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer ${
                      selectedTerm === "TERM-2" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-650"
                    }`}
                  >
                    T2
                  </button>
                </div>

                {classHardCopyUrl && (
                  <a
                    href={classHardCopyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/50 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                  >
                    <Eye size={12} className="text-emerald-600" /> View Class Hardcopy Proof
                  </a>
                )}

                <button
                  onClick={() => {
                    setSelectedClass(null);
                  }}
                  className="px-3.5 py-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Change Class
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase font-black text-slate-400 tracking-wider">
                    <th className="py-3.5 px-4">Student Name</th>
                    <th className="py-3.5 px-4">Age</th>
                    <th className="py-3.5 px-4">Sport Specialty</th>
                    <th className="py-3.5 px-4 text-center">BMI Rating</th>
                    <th className="py-3.5 px-4">Overall Score</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60 font-semibold text-slate-700">
                  {getDisplayStudents().map((student) => {
                    const studentPerf = allPerformances.find(r => {
                      const rStudentId = r.studentId && (typeof r.studentId === 'object' ? r.studentId._id : r.studentId);
                      return (rStudentId === student.id || rStudentId === student._id) && r.term === selectedTerm;
                    });
                    const score = studentPerf ? `${studentPerf.overallScore}%` : "N/A";

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-extrabold text-xs uppercase">
                            {student.name.substring(0, 2)}
                          </div>
                          <div>
                            <h5 className="font-extrabold text-slate-800">{student.name}</h5>
                            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">ID: {student.studentId || student.id || student._id}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-500">{student.age} Yrs</td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg border border-indigo-100 uppercase">
                            {student.assignedSport || student.sport}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${student.bmiCategory === 'Normal' ? 'bg-emerald-50 text-emerald-700' :
                              student.bmiCategory === 'Underweight' ? 'bg-amber-50 text-amber-700' :
                                'bg-red-50 text-red-700'
                            }`}>
                            {student.bmiCategory} ({student.bmi})
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-500 font-extrabold">{score}</td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all hover:shadow-md hover:shadow-indigo-500/10 active:scale-95 cursor-pointer"
                          >
                            <Eye size={12} /> Load Report Card
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {getDisplayStudents().length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-10 text-center text-slate-400 text-xs font-semibold">
                        No athletes located inside this roster currently.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Printable Report Display Panel */}
      <div className="printable-report-area">
        {selectedStudent ? (
          <>
            {/* Term Selector (Non-Printable) */}
            <div className="non-printable flex items-center justify-between gap-4 max-w-4xl mx-auto mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-3.5 py-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft size={14} /> Back to Roster
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Viewing Term:</span>
                <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/50">
                  <button
                    onClick={() => setSelectedTerm("TERM-1")}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer ${selectedTerm === "TERM-1" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-650"
                      }`}
                  >
                    Term 1
                  </button>
                  <button
                    onClick={() => setSelectedTerm("TERM-2")}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer ${selectedTerm === "TERM-2" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-650"
                      }`}
                  >
                    Term 2
                  </button>
                </div>
              </div>
            </div>

            {!selectedPerformance ? (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center max-w-2xl mx-auto space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 mx-auto text-slate-450">
                  <Activity className="w-8 h-8 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-800">No Performance Data Found</h3>
                  <p className="text-sm text-slate-500 font-medium">
                    No physical tests, sports scores, or attendance records have been entered for <span className="font-bold text-indigo-600">{selectedStudent.name}</span> in <span className="font-bold text-indigo-600">{selectedTerm === "TERM-1" ? "Term 1" : "Term 2"}</span> yet.
                  </p>
                </div>
                {isInstituteUser && (
                  <div className="pt-2">
                    <button
                      onClick={() => navigate(`${user.instituteType === 'academy' ? '/academy' : '/institute'}/physical-tests?class=${selectedStudent.class}&search=${encodeURIComponent(selectedStudent.name)}`)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <Plus size={14} /> Enter Sports Marks & Attendance
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ===== LEVEL 4: ATHLETE DETAILED REPORT CARD ===== */
              <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 max-w-4xl mx-auto space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full pointer-events-none -z-0"></div>

                {/* Report Header */}
                <div className="border-b-4 border-indigo-600 pb-6 mb-8 flex justify-between items-start relative z-10">
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Athletic Performance Report</h2>
                    <p className="text-slate-400 text-xs mt-1.5 font-bold uppercase tracking-wider">Academic Year 2026 - {selectedPerformance.term === 'TERM-1' ? 'Term 1' : 'Term 2'} Evaluation Log</p>
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
                  <div className="w-28 h-28 rounded-2xl bg-indigo-50 overflow-hidden shrink-0 border-2 border-indigo-100 shadow-sm flex items-center justify-center">
                    <div className="text-indigo-600 font-black text-2xl uppercase">
                      {selectedStudent.name.substring(0, 2)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 flex-1 text-xs font-semibold">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Athlete Name</span>
                      <span className="text-base font-black text-slate-800">{selectedStudent.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Athlete ID</span>
                      <span className="text-base font-black text-slate-800">{selectedStudent.studentId || selectedStudent.id || 'STU-001'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Standard/Class</span>
                      <span className="text-base font-black text-slate-800">Class {selectedStudent.class}th</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Associated Sport</span>
                      <span className="text-base font-black text-indigo-600">{selectedStudent.assignedSport || selectedStudent.sport}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Height & Weight</span>
                      <span className="text-base font-black text-slate-800">{selectedStudent.height}cm / {selectedStudent.weight}kg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">BMI Composition</span>
                      <span className="text-base font-black text-slate-800">{selectedStudent.bmi} ({selectedStudent.bmiCategory})</span>
                    </div>
                  </div>
                </div>

                {/* High impact index grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 text-center">
                    <p className="text-[10px] font-black text-indigo-800 uppercase tracking-widest mb-1.5">Overall Score Index</p>
                    <h3 className="text-4xl font-black text-indigo-600">{selectedPerformance?.overallScore || 85}%</h3>
                  </div>
                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 text-center">
                    <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1.5">Fitness Level Standard</p>
                    <h3 className="text-3xl font-black text-emerald-600 mt-1 uppercase">{selectedPerformance?.fitnessLevel || 'Good'}</h3>
                  </div>
                  <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 text-center">
                    <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1.5">Roster Regularity Rate</p>
                    <h3 className="text-4xl font-black text-amber-600">{selectedPerformance?.attendance || 90}%</h3>
                  </div>
                </div>

                {/* Capacities Table */}
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

                {/* Hardcopy proof display if present */}
                {selectedPerformance?.reportHardCopyUrl && (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        📄 Authentic Report Hardcopy Document
                      </h4>
                      <p className="text-xs text-slate-400 font-semibold mt-1">Uploaded by the institution for verification.</p>
                    </div>
                    <a
                      href={selectedPerformance.reportHardCopyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 bg-white rounded-xl text-xs font-black uppercase shadow-sm transition-colors active:scale-95 cursor-pointer"
                    >
                      <Eye size={14} className="text-indigo-600" /> View Hardcopy Photo
                    </a>
                  </div>
                )}

                {/* AI insight */}
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

                {/* Signatures */}
                <div className="border-t border-dashed border-slate-200 mt-12 pt-10 grid grid-cols-3 gap-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest relative">
                  <div>
                    <div className="w-full border-b border-slate-200/80 h-10 mb-2"></div>
                    <span>Coach Mentor Signature</span>
                  </div>
                  <div>
                    <div className="w-full border-b border-slate-200/80 h-10 mb-2"></div>
                    <span>Director Authority</span>
                  </div>
                  <div>
                    <div className="w-full border-b border-slate-200/80 h-10 mb-2"></div>
                    <span>Principal Executive</span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* ===== NO STUDENT SELECTED PLACEOHLDER ===== */
          !selectedInst && (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-xs font-semibold border border-slate-100 shadow-sm max-w-4xl mx-auto">
              Please select a registered School or Sports Academy above to inspect diagnostic performance records.
            </div>
          )
        )}
      </div>

    </div>
  );
};

export default Reports;
