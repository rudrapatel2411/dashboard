import React, { useState, useEffect } from 'react';
import { 
  Download, Printer, Share2, Award, Activity, Building2, Users, FileText, Search, 
  User, CheckCircle, ChevronRight, ArrowLeft, Trophy, Calendar, Eye, 
  ShieldAlert, Sparkles, Zap, Target, AlertCircle
} from 'lucide-react';
import axios from 'axios';

const Reports = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState("TERM-2");

  // Rich mock data representing Sports Academies with Grade 9-10 students
  const [mockAcademies] = useState([
    {
      id: "acad-1",
      name: "Dronacharya Cricket Academy",
      sport: "Cricket",
      coach: "Coach Devendra Prasad",
      email: "contact@dronacharyacricket.in",
      phone: "+91 99887 76655",
      registeredAt: "2026-03-10",
      location: "Ahmedabad, Gujarat",
      gradient: "from-red-500 to-rose-600",
      students: [
        { 
          id: "stu-c1", 
          name: "Rohan Patel", 
          age: 15, 
          class: "9", 
          sport: "Cricket",
          assignedSport: "Cricket",
          mentor: "Coach Devendra Prasad",
          bmiCategory: "Normal",
          bmi: 20.8,
          height: 168,
          weight: 58.8
        },
        { 
          id: "stu-c2", 
          name: "Amit Mishra", 
          age: 15, 
          class: "9", 
          sport: "Cricket",
          assignedSport: "Cricket",
          mentor: "Coach Devendra Prasad",
          bmiCategory: "Normal",
          bmi: 21.3,
          height: 166,
          weight: 58.7
        },
        { 
          id: "stu-c3", 
          name: "Kabir Dev", 
          age: 16, 
          class: "10", 
          sport: "Cricket",
          assignedSport: "Cricket",
          mentor: "Coach Devendra Prasad",
          bmiCategory: "Underweight",
          bmi: 18.0,
          height: 172,
          weight: 53.2
        },
        { 
          id: "stu-c4", 
          name: "Sachin Verma", 
          age: 16, 
          class: "10", 
          sport: "Cricket",
          assignedSport: "Cricket",
          mentor: "Coach Devendra Prasad",
          bmiCategory: "Normal",
          bmi: 22.1,
          height: 170,
          weight: 63.9
        }
      ]
    },
    {
      id: "acad-2",
      name: "Golden Boot Football Academy",
      sport: "Football",
      coach: "Coach Arthur Winston",
      email: "hello@goldenbootfc.com",
      phone: "+91 91234 98765",
      registeredAt: "2026-04-15",
      location: "Mumbai, Maharashtra",
      gradient: "from-emerald-500 to-teal-600",
      students: [
        { 
          id: "stu-f1", 
          name: "Aditya Roy", 
          age: 15, 
          class: "9", 
          sport: "Football",
          assignedSport: "Football",
          mentor: "Coach Arthur Winston",
          bmiCategory: "Normal",
          bmi: 20.4,
          height: 165,
          weight: 55.5
        },
        { 
          id: "stu-f2", 
          name: "Neil Nitin", 
          age: 16, 
          class: "10", 
          sport: "Football",
          assignedSport: "Football",
          mentor: "Coach Arthur Winston",
          bmiCategory: "Normal",
          bmi: 21.8,
          height: 171,
          weight: 63.7
        },
        { 
          id: "stu-f3", 
          name: "Arjun Rampal", 
          age: 15, 
          class: "9", 
          sport: "Football",
          assignedSport: "Football",
          mentor: "Coach Arthur Winston",
          bmiCategory: "Normal",
          bmi: 21.0,
          height: 168,
          weight: 59.3
        }
      ]
    },
    {
      id: "acad-3",
      name: "Pinnacle Badminton Club",
      sport: "Badminton",
      coach: "Coach Paul Fernandes",
      email: "contact@pinnaclebadminton.org",
      phone: "+91 88776 11223",
      registeredAt: "2026-05-01",
      location: "Bangalore, Karnataka",
      gradient: "from-cyan-500 to-blue-600",
      students: [
        { 
          id: "stu-b1", 
          name: "Jiya Shah", 
          age: 15, 
          class: "9", 
          sport: "Badminton",
          assignedSport: "Badminton",
          mentor: "Coach Paul Fernandes",
          bmiCategory: "Normal",
          bmi: 19.8,
          height: 162,
          weight: 52.0
        },
        { 
          id: "stu-b2", 
          name: "Sneha Reddy", 
          age: 15, 
          class: "9", 
          sport: "Badminton",
          assignedSport: "Badminton",
          mentor: "Coach Paul Fernandes",
          bmiCategory: "Normal",
          bmi: 20.1,
          height: 163,
          weight: 53.4
        },
        { 
          id: "stu-b3", 
          name: "Kareena Kapoor", 
          age: 16, 
          class: "10", 
          sport: "Badminton",
          assignedSport: "Badminton",
          mentor: "Coach Paul Fernandes",
          bmiCategory: "Normal",
          bmi: 19.5,
          height: 164,
          weight: 52.4
        }
      ]
    },
    {
      id: "acad-4",
      name: "Apex Swimming Academy",
      sport: "Swimming",
      coach: "Coach Ranjitsinh Jadeja",
      email: "elite@apexswim.in",
      phone: "+91 76008 55443",
      registeredAt: "2026-05-12",
      location: "Hyderabad, Telangana",
      gradient: "from-blue-500 to-indigo-600",
      students: [
        { 
          id: "stu-s1", 
          name: "Priya Patel", 
          age: 16, 
          class: "10", 
          sport: "Swimming",
          assignedSport: "Swimming",
          mentor: "Coach Ranjitsinh Jadeja",
          bmiCategory: "Normal",
          bmi: 20.4,
          height: 165,
          weight: 55.5
        },
        { 
          id: "stu-s2", 
          name: "Ishaan Verma", 
          age: 15, 
          class: "9", 
          sport: "Swimming",
          assignedSport: "Swimming",
          mentor: "Coach Ranjitsinh Jadeja",
          bmiCategory: "Overweight",
          bmi: 25.5,
          height: 165,
          weight: 69.4
        },
        { 
          id: "stu-s3", 
          name: "Kiara Advani", 
          age: 15, 
          class: "9", 
          sport: "Swimming",
          assignedSport: "Swimming",
          mentor: "Coach Ranjitsinh Jadeja",
          bmiCategory: "Normal",
          bmi: 19.0,
          height: 160,
          weight: 48.6
        }
      ]
    },
    {
      id: "acad-5",
      name: "Vanguard Athletics Academy",
      sport: "Athletics",
      coach: "Coach Ramesh Kalsaria",
      email: "admin@vanguardathletics.com",
      phone: "+91 94282 33221",
      registeredAt: "2026-02-18",
      location: "Delhi NCR",
      gradient: "from-orange-500 to-amber-600",
      students: [
        { 
          id: "stu-a1", 
          name: "Rohan Sharma", 
          age: 15, 
          class: "9", 
          sport: "Athletics",
          assignedSport: "Athletics",
          mentor: "Coach Ramesh Kalsaria",
          bmiCategory: "Normal",
          bmi: 21.2,
          height: 168,
          weight: 59.8
        },
        { 
          id: "stu-a2", 
          name: "Diya Sen", 
          age: 16, 
          class: "10", 
          sport: "Athletics",
          assignedSport: "Athletics",
          mentor: "Coach Ramesh Kalsaria",
          bmiCategory: "Normal",
          bmi: 20.0,
          height: 166,
          weight: 55.1
        },
        { 
          id: "stu-a3", 
          name: "Aarav Mehta", 
          age: 15, 
          class: "9", 
          sport: "Athletics",
          assignedSport: "Athletics",
          mentor: "Coach Ramesh Kalsaria",
          bmiCategory: "Underweight",
          bmi: 17.8,
          height: 160,
          weight: 45.6
        }
      ]
    }
  ]);

  // Rich fallback mock data representing institutions and nested students
  const [mockInstitutions] = useState([
    {
      id: "inst-101",
      name: "St. Xavier's International School",
      email: "contact@stxaviers.edu",
      phone: "+91 98765 43210",
      registeredAt: "2026-04-12",
      studentCount: 7,
      students: [
        { id: "stu-1", name: "Rohan Sharma", age: 15, class: "9", sport: "Football", assignedSport: "Football", mentor: "Coach Arthur", bmiCategory: "Normal", bmi: 21.2, height: 168, weight: 60 },
        { id: "stu-2", name: "Priya Patel", age: 16, class: "10", sport: "Basketball", assignedSport: "Basketball", mentor: "Coach Arthur", bmiCategory: "Normal", bmi: 20.4, height: 165, weight: 55 },
        { id: "stu-3", name: "Aarav Mehta", age: 14, class: "8", sport: "Athletics", assignedSport: "Athletics", mentor: "Coach Arthur", bmiCategory: "Underweight", bmi: 17.8, height: 160, weight: 45 },
        { id: "stu-4", name: "Sneha Reddy", age: 15, class: "9", sport: "Volleyball", assignedSport: "Volleyball", mentor: "Coach Arthur", bmiCategory: "Normal", bmi: 19.8, height: 162, weight: 52 },
        { id: "stu-12", name: "Rohan Patel", age: 14, class: "8", sport: "Athletics", assignedSport: "Athletics", mentor: "Coach Arthur", bmiCategory: "Normal", bmi: 19.1, height: 158, weight: 48 },
        { id: "stu-13", name: "Jiya Shah", age: 15, class: "9", sport: "Badminton", assignedSport: "Badminton", mentor: "Coach Arthur", bmiCategory: "Normal", bmi: 20.1, height: 163, weight: 53 },
        { id: "stu-14", name: "Manan Desai", age: 16, class: "10", sport: "Football", assignedSport: "Football", mentor: "Coach Arthur", bmiCategory: "Normal", bmi: 22.3, height: 172, weight: 66 }
      ]
    },
    {
      id: "inst-102",
      name: "Delhi Public Sports Academy",
      email: "sports@dpsdelhi.edu",
      phone: "+91 91234 56789",
      registeredAt: "2026-05-01",
      studentCount: 6,
      students: [
        { id: "stu-5", name: "Kabir Singh", age: 16, class: "10", sport: "Cricket", assignedSport: "Cricket", mentor: "Coach Sharma", bmiCategory: "Normal", bmi: 21.8, height: 170, weight: 63 },
        { id: "stu-6", name: "Ananya Iyer", age: 17, class: "11", sport: "Swimming", assignedSport: "Swimming", mentor: "Coach Sharma", bmiCategory: "Normal", bmi: 19.5, height: 167, weight: 54 },
        { id: "stu-7", name: "Ishaan Verma", age: 15, class: "9", sport: "Football", assignedSport: "Football", mentor: "Coach Sharma", bmiCategory: "Overweight", bmi: 25.5, height: 165, weight: 69 },
        { id: "stu-30", name: "Manish Kumar", age: 16, class: "10", sport: "Cricket", assignedSport: "Cricket", mentor: "Coach Sharma", bmiCategory: "Normal", bmi: 22.1, height: 171, weight: 65 },
        { id: "stu-31", name: "Divya Teja", age: 14, class: "8", sport: "Athletics", assignedSport: "Athletics", mentor: "Coach Sharma", bmiCategory: "Normal", bmi: 18.9, height: 159, weight: 48 },
        { id: "stu-32", name: "Preeti Shenoy", age: 15, class: "9", sport: "Basketball", assignedSport: "Basketball", mentor: "Coach Sharma", bmiCategory: "Normal", bmi: 20.6, height: 164, weight: 55 }
      ]
    },
    {
      id: "inst-103",
      name: "Ryan Elite High School",
      email: "info@ryanelite.org",
      phone: "+91 88776 65544",
      registeredAt: "2026-05-18",
      studentCount: 5,
      students: [
        { id: "stu-8", name: "Aditya Roy", age: 14, class: "8", sport: "Basketball", assignedSport: "Basketball", mentor: "Coach Paul", bmiCategory: "Normal", bmi: 19.3, height: 161, weight: 50 },
        { id: "stu-9", name: "Diya Sen", age: 16, class: "10", sport: "Athletics", assignedSport: "Athletics", mentor: "Coach Paul", bmiCategory: "Normal", bmi: 20.0, height: 166, weight: 55 },
        { id: "stu-33", name: "Arjun Rampal", age: 15, class: "9", sport: "Football", assignedSport: "Football", mentor: "Coach Paul", bmiCategory: "Normal", bmi: 21.0, height: 169, weight: 60 },
        { id: "stu-34", name: "Kareena Kapoor", age: 16, class: "10", sport: "Badminton", assignedSport: "Badminton", mentor: "Coach Paul", bmiCategory: "Normal", bmi: 19.9, height: 163, weight: 53 },
        { id: "stu-35", name: "Saif Khan", age: 17, class: "11", sport: "Volleyball", assignedSport: "Volleyball", mentor: "Coach Paul", bmiCategory: "Normal", bmi: 22.8, height: 175, weight: 70 }
      ]
    },
    {
      id: "inst-104",
      name: "Oakridge International Sports Hub",
      email: "oakridge@oakridge.in",
      phone: "+91 77665 54433",
      registeredAt: "2026-05-19",
      studentCount: 5,
      students: [
        { id: "stu-10", name: "Varun Dhawan", age: 15, class: "9", sport: "Cricket", assignedSport: "Cricket", mentor: "Coach Arthur", bmiCategory: "Normal", bmi: 21.5, height: 168, weight: 61 },
        { id: "stu-11", name: "Kiara Advani", age: 14, class: "8", sport: "Swimming", assignedSport: "Swimming", mentor: "Coach Arthur", bmiCategory: "Normal", bmi: 19.0, height: 160, weight: 49 },
        { id: "stu-36", name: "Siddharth Malhotra", age: 16, class: "10", sport: "Football", assignedSport: "Football", mentor: "Coach Arthur", bmiCategory: "Normal", bmi: 22.0, height: 173, weight: 66 },
        { id: "stu-37", name: "Alia Bhatt", age: 15, class: "9", sport: "Gymnastics", assignedSport: "Gymnastics", mentor: "Coach Arthur", bmiCategory: "Normal", bmi: 18.5, height: 157, weight: 46 },
        { id: "stu-38", name: "Katrina Kaif", age: 14, class: "8", sport: "Athletics", assignedSport: "Athletics", mentor: "Coach Arthur", bmiCategory: "Underweight", bmi: 18.0, height: 162, weight: 47 }
      ]
    },
    {
      id: "inst-105",
      name: "DAV Public School, Gandhinagar",
      email: "info@davgandhinagar.org",
      phone: "+91 94567 12345",
      registeredAt: "2026-03-24",
      studentCount: 6,
      students: [
        { id: "stu-12b", name: "Rohan Patel", age: 14, class: "8", sport: "Athletics", assignedSport: "Athletics", mentor: "Coach Mehta", bmiCategory: "Normal", bmi: 19.1, height: 158, weight: 48 },
        { id: "stu-13b", name: "Jiya Shah", age: 15, class: "9", sport: "Badminton", assignedSport: "Badminton", mentor: "Coach Mehta", bmiCategory: "Normal", bmi: 20.1, height: 163, weight: 53 },
        { id: "stu-14b", name: "Manan Desai", age: 16, class: "10", sport: "Football", assignedSport: "Football", mentor: "Coach Mehta", bmiCategory: "Normal", bmi: 22.3, height: 172, weight: 66 },
        { id: "stu-39", name: "Neil Nitin", age: 15, class: "9", sport: "Volleyball", assignedSport: "Volleyball", mentor: "Coach Mehta", bmiCategory: "Normal", bmi: 20.3, height: 166, weight: 56 },
        { id: "stu-40", name: "Mukesh Ambani", age: 16, class: "10", sport: "Cricket", assignedSport: "Cricket", mentor: "Coach Mehta", bmiCategory: "Overweight", bmi: 26.2, height: 170, weight: 76 },
        { id: "stu-41", name: "Nita Shah", age: 14, class: "8", sport: "Swimming", assignedSport: "Swimming", mentor: "Coach Mehta", bmiCategory: "Normal", bmi: 18.6, height: 156, weight: 45 }
      ]
    }
  ]);

  // Fetch student roster on mount to overlay DB and Mock
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        const response = await axios.get('http://localhost:5000/api/students', { headers });
        const dbList = response.data || [];
        
        // Build flat baseline list
        const combined = [];
        mockInstitutions.forEach(i => combined.push(...i.students));
        mockAcademies.forEach(a => combined.push(...a.students));

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
      } catch (error) {
        const combined = [];
        mockInstitutions.forEach(i => combined.push(...i.students));
        mockAcademies.forEach(a => combined.push(...a.students));
        setStudents(combined);
      }
    };

    fetchStudents();
  }, []);

  // Compile all local + DB students for selected institution/academy
  const getStudentsForInst = () => {
    if (!selectedInst) return [];
    
    // Find matching mock students depending on the active category
    let mockList = [];
    if (activeCategory === 'academies') {
      const acad = mockAcademies.find(a => a.id === selectedInst.id);
      mockList = acad ? acad.students : [];
    } else {
      const inst = mockInstitutions.find(i => i.id === selectedInst.id);
      mockList = inst ? inst.students : [];
    }
    
    // Merge database students if any match the parameters
    const dbList = students.filter(s => {
      return s.instituteId === selectedInst.id || s.instituteName === selectedInst.name;
    });

    // De-duplicate by name
    const combined = [...mockList];
    dbList.forEach(dbStudent => {
      if (!combined.some(c => c.name.toLowerCase() === dbStudent.name.toLowerCase())) {
        combined.push({
          id: dbStudent.id || dbStudent._id,
          name: dbStudent.name,
          age: dbStudent.age || 15,
          class: dbStudent.class?.toString() || "9",
          sport: dbStudent.assignedSport || "Athletics",
          assignedSport: dbStudent.assignedSport || "Athletics",
          mentor: dbStudent.coachName || "Coach Mentor",
          bmiCategory: dbStudent.bmiCategory || "Normal",
          bmi: dbStudent.bmi || 20.0,
          height: dbStudent.height || 165,
          weight: dbStudent.weight || 55
        });
      }
    });

    return combined;
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
    if (activeCategory === 'academies') {
      return getStudentsForInst();
    }
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

  const handleExportPDF = async () => {
    if (!selectedInst) {
      alert("Please select an institution or sports academy first!");
      return;
    }

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      if (selectedStudent) {
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
        // Dynamic Roster Performance Report
        const displayStudents = getDisplayStudents();

        doc.setFontSize(22);
        doc.setTextColor(30, 41, 59);
        doc.text('Roster Performance Report', 20, 25);
        
        doc.setFontSize(12);
        doc.setTextColor(100, 116, 139);
        doc.text('Generated on: ' + new Date().toLocaleDateString('en-IN'), 20, 35);
        
        doc.setDrawColor(79, 70, 229);
        doc.setLineWidth(1);
        doc.line(20, 40, 190, 40);
        
        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.text('Entity Details', 20, 55);
        
        doc.setFontSize(11);
        doc.setTextColor(71, 85, 105);
        doc.text(`Name: ${selectedInst.name}`, 20, 65);
        doc.text(`Category: ${activeCategory === 'academies' ? 'Sports Academy' : 'School/Institution'}`, 20, 73);
        doc.text(`Location: ${selectedInst.location || 'N/A'}`, 20, 81);
        doc.text(`Total Enrolled: ${displayStudents.length}`, 20, 89);
        
        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.text('Active Roster Performance Index', 20, 105);
        
        // Table header
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(79, 70, 229);
        doc.rect(20, 110, 170, 8, 'F');
        doc.text('#', 22, 116);
        doc.text('Name', 32, 116);
        doc.text('Class', 82, 116);
        doc.text('Assigned Sport', 112, 116);
        doc.text('Overall Score', 162, 116);
        
        // Table rows
        doc.setTextColor(71, 85, 105);
        displayStudents.forEach((s, i) => {
          const y = 126 + (i * 10);
          if (i % 2 === 0) {
            doc.setFillColor(248, 250, 252);
            doc.rect(20, y - 6, 170, 10, 'F');
          }
          
          const tempHistory = generatePerformanceData(s);
          const score = tempHistory ? tempHistory.overallScore : 80;
          
          doc.text((i + 1).toString(), 22, y);
          doc.text(s.name, 32, y);
          doc.text(`Class ${s.class}th`, 82, y);
          doc.text(s.assignedSport || s.sport, 112, y);
          doc.text(`${score}%`, 162, y);
        });
        
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text('Generated dynamically by SportSphere Analytics Center', 20, 280);
      }
      
      const fileName = selectedStudent 
        ? `${selectedStudent.name.replace(/\s+/g, '_')}_Report.pdf` 
        : `${selectedInst.name.replace(/\s+/g, '_')}_Roster_Report.pdf`;
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
    // Determine category based on ID mapping
    const isAcademyStudent = student.id.startsWith("stu-c") || student.id.startsWith("stu-f") || student.id.startsWith("stu-b") || student.id.startsWith("stu-s") || student.id.startsWith("stu-a");
    
    if (isAcademyStudent) {
      setActiveCategory("academies");
      // Find matching academy
      let matchedAcad = mockAcademies[0];
      if (student.id.startsWith("stu-c")) matchedAcad = mockAcademies.find(a => a.id === "acad-1");
      else if (student.id.startsWith("stu-f")) matchedAcad = mockAcademies.find(a => a.id === "acad-2");
      else if (student.id.startsWith("stu-b")) matchedAcad = mockAcademies.find(a => a.id === "acad-3");
      else if (student.id.startsWith("stu-s")) matchedAcad = mockAcademies.find(a => a.id === "acad-4");
      else if (student.id.startsWith("stu-a")) matchedAcad = mockAcademies.find(a => a.id === "acad-5");
      
      setSelectedInst(matchedAcad);
      setSelectedClass(null);
    } else {
      setActiveCategory("institutions");
      // Find matching institute
      let matchedInst = mockInstitutions[0];
      if (student.id.startsWith("stu-1") || student.id.startsWith("stu-2") || student.id.startsWith("stu-3") || student.id.startsWith("stu-4")) {
        matchedInst = mockInstitutions.find(i => i.id === "inst-101");
      } else if (student.id.startsWith("stu-5") || student.id.startsWith("stu-6") || student.id.startsWith("stu-7") || student.id.startsWith("stu-30") || student.id.startsWith("stu-31") || student.id.startsWith("stu-32")) {
        matchedInst = mockInstitutions.find(i => i.id === "inst-102");
      } else if (student.id.startsWith("stu-8") || student.id.startsWith("stu-9") || student.id.startsWith("stu-33") || student.id.startsWith("stu-34") || student.id.startsWith("stu-35")) {
        matchedInst = mockInstitutions.find(i => i.id === "inst-103");
      } else if (student.id.startsWith("stu-10") || student.id.startsWith("stu-11") || student.id.startsWith("stu-36") || student.id.startsWith("stu-37") || student.id.startsWith("stu-38")) {
        matchedInst = mockInstitutions.find(i => i.id === "inst-104");
      } else {
        matchedInst = mockInstitutions.find(i => i.id === "inst-105");
      }
      setSelectedInst(matchedInst);
      setSelectedClass(student.class);
    }

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

  const filteredInstitutions = mockInstitutions.filter(inst => 
    inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAcademies = mockAcademies.filter(acad => 
    acad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acad.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acad.coach.toLowerCase().includes(searchQuery.toLowerCase())
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
              <button 
                onClick={handlePrint}
                className="bg-white text-slate-700 hover:text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 text-xs shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 font-bold active:scale-95 cursor-pointer"
              >
                <Printer size={15} /> Print Report
              </button>
              <button
                onClick={handleExportPDF}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs shadow-md hover:shadow-indigo-500/10 transition-all flex items-center gap-2 font-black active:scale-95 cursor-pointer"
              >
                <Download size={15} /> Export PDF
              </button>
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
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === "institutions"
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
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === "academies"
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
                        {inst.studentCount} Athletes
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
                        {acad.students.length} Enrolled Athletes
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
        {selectedInst && !selectedClass && activeCategory === 'institutions' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-800">
                🏫 {selectedInst.name}
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Select an active class grade to inspect individual physical report cards.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {["8", "9", "10", "11"].map((classGrade) => {
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
            </div>
          </div>
        )}

        {/* LEVEL 3: Student Roster Table */}
        {((activeCategory === 'institutions' && selectedInst && selectedClass && !selectedStudent) ||
          (activeCategory === 'academies' && selectedInst && !selectedStudent)) && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-800">
                  {activeCategory === 'academies' 
                    ? `Academy Roster • Active Reports` 
                    : `Students Roster • Class ${selectedClass}th Grade Reports`}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Showing student athletes registered in {selectedInst.name}.</p>
              </div>
              <button 
                onClick={() => {
                  if (activeCategory === 'academies') {
                    handleResetNavigation();
                  } else {
                    setSelectedClass(null);
                  }
                }}
                className="px-3.5 py-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {activeCategory === 'academies' ? "Change Academy" : "Change Class"}
              </button>
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
                    const tempHistory = generatePerformanceData(student);
                    
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-extrabold text-xs uppercase">
                            {student.name.substring(0, 2)}
                          </div>
                          <div>
                            <h5 className="font-extrabold text-slate-800">{student.name}</h5>
                            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">ID: {student.id}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-500">{student.age} Yrs</td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg border border-indigo-100 uppercase">
                            {student.assignedSport || student.sport}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            student.bmiCategory === 'Normal' ? 'bg-emerald-50 text-emerald-700' :
                            student.bmiCategory === 'Underweight' ? 'bg-amber-50 text-amber-700' :
                            'bg-red-50 text-red-700'
                          }`}>
                            {student.bmiCategory} ({student.bmi})
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-500 font-extrabold">{tempHistory?.overallScore}%</td>
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
          /* ===== LEVEL 4: ATHLETE DETAILED REPORT CARD ===== */
          <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 max-w-4xl mx-auto space-y-8 relative overflow-hidden">
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
                  <span className="text-base font-black text-slate-800">{selectedStudent.id || 'STU-001'}</span>
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
