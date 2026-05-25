import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Building2, Users, Search, 
  ChevronDown, ChevronUp, GraduationCap, Phone, Mail,
  Award, Printer, Eye, Activity, Sparkles, Trophy, FileText, CheckCircle,
  ArrowLeft, BookOpen, X
} from 'lucide-react';

const Institutions = () => {
  // Rich mock data representing institutions and their nested students
  const [institutions, setInstitutions] = useState([
    {
      id: "inst-101",
      name: "St. Xavier's International School",
      email: "contact@stxaviers.edu",
      phone: "+91 98765 43210",
      registeredAt: "2026-04-12",
      studentCount: 7,
      students: [
        { 
          id: "stu-1", 
          name: "Rohan Sharma", 
          age: 15, 
          class: "9", 
          sport: "Football", 
          performance: "Excellent",
          sprintTime: 11.9,
          broadJump: 228,
          pushups: 34,
          attendance: "Present",
          recommendedSport: "Football & Sprint Tracks",
          manualReportData: "Outstanding hamstring velocity and linear acceleration. Displays highly explosive lower-body power. Perfect candidate for competitive sports.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop"
        },
        { 
          id: "stu-2", 
          name: "Priya Patel", 
          age: 16, 
          class: "10", 
          sport: "Basketball", 
          performance: "Good",
          sprintTime: 13.2,
          broadJump: 235,
          pushups: 28,
          attendance: "Present",
          recommendedSport: "Basketball & Volleyball",
          manualReportData: "Great vertical jump suspension and reach capability. Fast court response cycles and excellent hand-eye coordination.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop"
        },
        { id: "stu-3", name: "Aarav Mehta", age: 14, class: "8", sport: "Athletics", performance: "Good", attendance: "Present" },
        { id: "stu-4", name: "Sneha Reddy", age: 15, class: "9", sport: "Volleyball", performance: "Average", attendance: "Absent" },
        { id: "stu-12", name: "Rohan Patel", age: 14, class: "8", sport: "Athletics", performance: "Good", attendance: "Present" },
        { 
          id: "stu-13", 
          name: "Jiya Shah", 
          age: 15, 
          class: "9", 
          sport: "Badminton", 
          performance: "Excellent",
          sprintTime: 12.8,
          broadJump: 210,
          pushups: 26,
          attendance: "Present",
          recommendedSport: "Athletics & Badminton",
          manualReportData: "Fast court movement, superior agility scores. Excellent lateral displacement velocity.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop"
        },
        { id: "stu-14", name: "Manan Desai", age: 16, class: "10", sport: "Football", performance: "Average", attendance: "Present" }
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
        { 
          id: "stu-5", 
          name: "Kabir Singh", 
          age: 16, 
          class: "10", 
          sport: "Cricket", 
          performance: "Excellent",
          sprintTime: 12.0,
          broadJump: 242,
          pushups: 35,
          attendance: "Present",
          recommendedSport: "Athletics & Cricket",
          manualReportData: "Highly cohesive dynamic reaction time. Upper muscle stamina indexes are superior. Exhibits perfect stamina levels.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop"
        },
        { 
          id: "stu-6", 
          name: "Ananya Iyer", 
          age: 17, 
          class: "11", 
          sport: "Swimming", 
          performance: "Excellent",
          sprintTime: 12.5,
          broadJump: 215,
          pushups: 30,
          attendance: "Present",
          recommendedSport: "Swimming & General Sports",
          manualReportData: "Superb breathing rhythm and lung stamina capacity. Ideal buoyancy indicators and flexibility markers.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop"
        },
        { id: "stu-7", name: "Ishaan Verma", age: 15, class: "9", sport: "Football", performance: "Average", attendance: "Absent" },
        { id: "stu-30", name: "Manish Kumar", age: 16, class: "10", sport: "Cricket", performance: "Good", attendance: "Present" },
        { id: "stu-31", name: "Divya Teja", age: 14, class: "8", sport: "Athletics", performance: "Average", attendance: "Present" },
        { id: "stu-32", name: "Preeti Shenoy", age: 15, class: "9", sport: "Basketball", performance: "Good", attendance: "Present" }
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
        { id: "stu-8", name: "Aditya Roy", age: 14, class: "8", sport: "Basketball", performance: "Good", attendance: "Present" },
        { 
          id: "stu-9", 
          name: "Diya Sen", 
          age: 16, 
          class: "10", 
          sport: "Athletics", 
          performance: "Excellent",
          sprintTime: 12.4,
          broadJump: 232,
          pushups: 27,
          attendance: "Present",
          recommendedSport: "Athletics & Long Jump",
          manualReportData: "Great core stability. Quick explosive starts observed. High levels of physical fitness and joint flexibility.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop"
        },
        { id: "stu-33", name: "Arjun Rampal", age: 15, class: "9", sport: "Football", performance: "Good", attendance: "Present" },
        { id: "stu-34", name: "Kareena Kapoor", age: 16, class: "10", sport: "Badminton", performance: "Average", attendance: "Absent" },
        { id: "stu-35", name: "Saif Khan", age: 17, class: "11", sport: "Volleyball", performance: "Good", attendance: "Present" }
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
        { id: "stu-10", name: "Varun Dhawan", age: 15, class: "9", sport: "Cricket", performance: "Good", attendance: "Present" },
        { id: "stu-11", name: "Kiara Advani", age: 14, class: "8", sport: "Swimming", performance: "Average", attendance: "Present" },
        { id: "stu-36", name: "Siddharth Malhotra", age: 16, class: "10", sport: "Football", performance: "Excellent", sprintTime: 12.1, broadJump: 240, pushups: 32, attendance: "Present", recommendedSport: "Football & Sprint", manualReportData: "Outstanding agility and speed. Perfect for field sports.", reportHardCopyUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop" },
        { id: "stu-37", name: "Alia Bhatt", age: 15, class: "9", sport: "Gymnastics", performance: "Excellent", sprintTime: 13.0, broadJump: 205, pushups: 28, attendance: "Present", recommendedSport: "Gymnastics & Athletics", manualReportData: "Exceptional flexibility and core strength.", reportHardCopyUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop" },
        { id: "stu-38", name: "Katrina Kaif", age: 14, class: "8", sport: "Athletics", performance: "Good", attendance: "Absent" }
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
        { id: "stu-12b", name: "Rohan Patel", age: 14, class: "8", sport: "Athletics", performance: "Good", attendance: "Present" },
        { 
          id: "stu-13b", 
          name: "Jiya Shah", 
          age: 15, 
          class: "9", 
          sport: "Badminton", 
          performance: "Excellent",
          sprintTime: 12.8,
          broadJump: 210,
          pushups: 26,
          attendance: "Present",
          recommendedSport: "Athletics & Badminton",
          manualReportData: "Fast court movement, superior agility scores. Excellent lateral displacement velocity.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop"
        },
        { id: "stu-14b", name: "Manan Desai", age: 16, class: "10", sport: "Football", performance: "Average", attendance: "Present" },
        { id: "stu-39", name: "Neil Nitin", age: 15, class: "9", sport: "Volleyball", performance: "Average", attendance: "Absent" },
        { id: "stu-40", name: "Mukesh Ambani", age: 16, class: "10", sport: "Cricket", performance: "Good", attendance: "Present" },
        { id: "stu-41", name: "Nita Shah", age: 14, class: "8", sport: "Swimming", performance: "Excellent", sprintTime: 13.1, broadJump: 195, pushups: 22, attendance: "Present", recommendedSport: "Swimming & Diving", manualReportData: "Excellent buoyancy and endurance.", reportHardCopyUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop" }
      ]
    },
    {
      id: "inst-106",
      name: "Lotus Valley Athletics Academy",
      email: "athletics@lotusvalley.edu",
      phone: "+91 81234 98765",
      registeredAt: "2026-04-05",
      studentCount: 5,
      students: [
        { 
          id: "stu-15", 
          name: "Arpit Gupta", 
          age: 17, 
          class: "11", 
          sport: "Cricket", 
          performance: "Excellent",
          sprintTime: 12.3,
          broadJump: 236,
          pushups: 31,
          attendance: "Present",
          recommendedSport: "Cricket & Athletics",
          manualReportData: "Strong batting stance and wrist coordination. Exceptional physical power output indexes.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop"
        },
        { id: "stu-16", name: "Meera Joshi", age: 16, class: "10", sport: "Basketball", performance: "Good", attendance: "Present" },
        { id: "stu-17", name: "Devansh Vyas", age: 15, class: "9", sport: "Athletics", performance: "Good", attendance: "Present" },
        { id: "stu-42", name: "Gautam Adani", age: 16, class: "10", sport: "Swimming", performance: "Excellent", sprintTime: 12.0, broadJump: 230, pushups: 33, attendance: "Present", recommendedSport: "Swimming & Athletics", manualReportData: "Outstanding endurance metrics.", reportHardCopyUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop" },
        { id: "stu-43", name: "Kunal Shah", age: 14, class: "8", sport: "Football", performance: "Average", attendance: "Absent" }
      ]
    },
    {
      id: "inst-107",
      name: "Silver Oak Sports High",
      email: "admin@silveroakhigh.com",
      phone: "+91 79988 66554",
      registeredAt: "2026-05-19",
      studentCount: 5,
      students: [
        { id: "stu-18", name: "Shreya Ghoshal", age: 14, class: "8", sport: "Swimming", performance: "Average", attendance: "Present" },
        { id: "stu-19", name: "Arijit Roy", age: 15, class: "9", sport: "Tennis", performance: "Good", attendance: "Present" },
        { id: "stu-44", name: "Sonu Nigam", age: 16, class: "10", sport: "Cricket", performance: "Good", attendance: "Present" },
        { id: "stu-45", name: "Sunidhi Chauhan", age: 15, class: "9", sport: "Athletics", performance: "Excellent", sprintTime: 11.5, broadJump: 248, pushups: 36, attendance: "Present", recommendedSport: "Sprint & Long Jump", manualReportData: "Fastest sprint time in school history. Explosive power.", reportHardCopyUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop" },
        { id: "stu-46", name: "Badshah Singh", age: 17, class: "11", sport: "Football", performance: "Average", attendance: "Absent" }
      ]
    },
    {
      id: "inst-108",
      name: "Shanti Asiatic School, Ahmedabad",
      email: "contact@shantiasiatic.edu.in",
      phone: "+91 90088 77665",
      registeredAt: "2026-04-20",
      studentCount: 6,
      students: [
        { 
          id: "stu-20", 
          name: "Parth Shah", 
          age: 16, 
          class: "10", 
          sport: "Volleyball", 
          performance: "Excellent",
          sprintTime: 12.6,
          broadJump: 238,
          pushups: 29,
          attendance: "Present",
          recommendedSport: "Basketball & Volleyball",
          manualReportData: "Great arm swing velocities. Lower body explosive metrics are superior. Excellent jumping response indices.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop"
        },
        { id: "stu-21", name: "Krisha Mehta", age: 15, class: "9", sport: "Football", performance: "Good", attendance: "Present" },
        { id: "stu-22", name: "Naman Pandya", age: 17, class: "11", sport: "Cricket", performance: "Average", attendance: "Present" },
        { id: "stu-47", name: "Hardik Pandya", age: 16, class: "10", sport: "Athletics", performance: "Excellent", sprintTime: 11.7, broadJump: 250, pushups: 38, attendance: "Present", recommendedSport: "Athletics & Cricket", manualReportData: "Exceptional all-round physical prowess.", reportHardCopyUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop" },
        { id: "stu-48", name: "Krunal Pandya", age: 15, class: "9", sport: "Volleyball", performance: "Average", attendance: "Absent" },
        { id: "stu-49", name: "Rashmika Mandanna", age: 14, class: "8", sport: "Badminton", performance: "Excellent", sprintTime: 13.5, broadJump: 190, pushups: 20, attendance: "Present", recommendedSport: "Badminton & Table Tennis", manualReportData: "Superior reflexes and hand-eye coordination.", reportHardCopyUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop" }
      ]
    },
    {
      id: "inst-109",
      name: "Greenwood Sports Alliance",
      email: "alliance@greenwood.in",
      phone: "+91 80011 22334",
      registeredAt: "2026-05-20",
      studentCount: 5,
      students: [
        { id: "stu-23", name: "Yashvi Patel", age: 14, class: "8", sport: "Athletics", performance: "Good", attendance: "Present" },
        { 
          id: "stu-24", 
          name: "Het Trivedi", 
          age: 16, 
          class: "10", 
          sport: "Swimming", 
          performance: "Excellent",
          sprintTime: 11.8,
          broadJump: 245,
          pushups: 33,
          attendance: "Present",
          recommendedSport: "Swimming & Sprinting",
          manualReportData: "Fastest response index recorded in standard 10th. Dynamic physical form and heart recovery factors are flawless.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop"
        },
        { id: "stu-50", name: "Vijay Deverakonda", age: 15, class: "9", sport: "Football", performance: "Good", attendance: "Present" },
        { id: "stu-51", name: "Samantha Ruth", age: 14, class: "8", sport: "Athletics", performance: "Average", attendance: "Absent" },
        { id: "stu-52", name: "Allu Arjun", age: 16, class: "10", sport: "Cricket", performance: "Excellent", sprintTime: 12.2, broadJump: 238, pushups: 30, attendance: "Present", recommendedSport: "Cricket & Athletics", manualReportData: "Strong physical endurance and reaction time.", reportHardCopyUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop" }
      ]
    }
  ]);

  const [expandedId, setExpandedId] = useState(null);
  
  // Track which class is selected inside an expanded institute
  // Format: { [instId]: "9" } or null
  const [selectedClass, setSelectedClass] = useState({});

  // Track if print sheet modal is open: { instId, className, students }
  const [printSheet, setPrintSheet] = useState(null);
  
  // Connect with global DashboardLayout search context
  const outletContext = useOutletContext();
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const searchTerm = outletContext ? outletContext.searchTerm : localSearchTerm;
  const setSearchTerm = outletContext ? outletContext.setSearchTerm : setLocalSearchTerm;

  // State for active student portfolio report modal
  const [selectedStudentReport, setSelectedStudentReport] = useState(null);

  // Toggle accordion expand/collapse
  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      // Reset class selection when switching institutes
      setSelectedClass(prev => ({ ...prev, [id]: null }));
    }
  };

  // Get unique classes for an institution
  const getClasses = (students) => {
    const classSet = new Set(students.map(s => s.class));
    return Array.from(classSet).sort((a, b) => parseInt(a) - parseInt(b));
  };

  // Count students per class
  const getClassStudentCount = (students, cls) => {
    return students.filter(s => s.class === cls).length;
  };

  // Statistics
  const totalInsts = institutions.length;
  const totalStudentsCount = institutions.reduce((acc, curr) => acc + curr.students.length, 0);
  const totalClasses = new Set(institutions.flatMap(i => i.students.map(s => s.class))).size;

  // Handle class selection
  const handleClassSelect = (instId, cls) => {
    setSelectedClass(prev => ({
      ...prev,
      [instId]: prev[instId] === cls ? null : cls
    }));
  };

  // Open print sheet modal
  const openPrintSheet = (inst, cls) => {
    const classStudents = inst.students.filter(s => s.class === cls);
    setPrintSheet({
      instId: inst.id,
      instName: inst.name,
      instEmail: inst.email,
      instPhone: inst.phone,
      className: cls,
      students: classStudents
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 font-sans">
      
      {/* Print styles for class sheet */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
            background: none !important;
          }
          #print-class-sheet, #print-class-sheet * {
            visibility: visible;
          }
          #print-class-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw !important;
            max-width: 100% !important;
            padding: 1.5rem !important;
            background-color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          #print-athlete-card, #print-athlete-card * {
            visibility: visible;
          }
          #print-athlete-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw !important;
            max-width: 100% !important;
            height: 100vh !important;
            border: 8px double #d4af37 !important;
            padding: 3rem !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            background-color: white !important;
            page-break-inside: avoid;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Building2 className="text-secondary w-8 h-8" />
            Institution Management
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            View registered schools, browse class-wise student rosters, and inspect individual evaluation reports.
          </p>
        </div>
      </div>

      {/* Analytics Counter Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-tr from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Institutions</p>
            <h3 className="text-3xl font-black text-white mt-2">{totalInsts}</h3>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-accent">
            <Building2 size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Enrolled Students</p>
            <h3 className="text-3xl font-black text-secondary mt-2">{totalStudentsCount}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-100 text-secondary rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Standards</p>
            <h3 className="text-3xl font-black text-accent mt-2">{totalClasses}</h3>
          </div>
          <div className="w-12 h-12 bg-orange-100 text-accent rounded-xl flex items-center justify-center">
            <BookOpen size={24} />
          </div>
        </div>
      </div>

      {/* Toolbar - Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search institutions by name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary bg-slate-50/50"
          />
        </div>
        <p className="text-xs text-slate-400 font-semibold">
          Click any institution to view its classes → select a class to see students
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {institutions
          .filter(inst => {
            const term = searchTerm.toLowerCase();
            if (!term) return true;
            if (inst.name.toLowerCase().includes(term)) return true;
            return inst.students.some(s => s.name.toLowerCase().includes(term));
          })
          .sort((a, b) => {
            const term = searchTerm.toLowerCase();
            if (!term) return 0;
            const aStarts = a.name.toLowerCase().startsWith(term);
            const bStarts = b.name.toLowerCase().startsWith(term);
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
            return 0;
          })
          .map((inst) => {
            const isExpanded = expandedId === inst.id;
            const classes = getClasses(inst.students);
            const activeClass = selectedClass[inst.id] || null;

            // Students filtered by selected class
            const classStudents = activeClass 
              ? inst.students.filter(s => s.class === activeClass)
              : [];

            return (
              <div 
                key={inst.id} 
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm ${
                  isExpanded ? 'border-secondary/40 ring-1 ring-secondary/20 shadow-md' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                
                {/* Accordion Trigger Header */}
                <div 
                  onClick={() => toggleExpand(inst.id)}
                  className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3.5 rounded-xl flex items-center justify-center shrink-0 bg-blue-50 text-secondary">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-lg">{inst.name}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-1.5 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1"><Mail size={14} /> {inst.email}</span>
                        <span className="flex items-center gap-1"><Phone size={14} /> {inst.phone}</span>
                        <span className="text-slate-400">Reg: {inst.registeredAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side info */}
                  <div className="flex items-center gap-4 self-end md:self-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-secondary text-xs font-bold rounded-full">
                      <Users size={14} />
                      {inst.students.length} Students
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-full">
                      <BookOpen size={14} />
                      {classes.length} Classes
                    </span>
                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>

                {/* Collapsible Panel — Class Cards */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/30">
                    
                    {/* Class Cards Grid */}
                    {!activeClass && (
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 tracking-wide uppercase flex items-center gap-2 mb-4 mt-2">
                          <BookOpen size={16} className="text-secondary" />
                          Select a Class to View Students
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {classes.map(cls => {
                            const count = getClassStudentCount(inst.students, cls);
                            return (
                              <button
                                key={cls}
                                onClick={() => handleClassSelect(inst.id, cls)}
                                className="group bg-white border border-slate-200 rounded-xl p-4 text-center hover:border-secondary hover:shadow-md hover:bg-blue-50/40 transition-all duration-200 cursor-pointer"
                              >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-blue-400 text-white flex items-center justify-center text-lg font-black mx-auto mb-2.5 shadow-md shadow-blue-500/15 group-hover:scale-110 transition-transform">
                                  {cls}
                                </div>
                                <p className="font-extrabold text-slate-800 text-sm">Class {cls}th</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                                  {count} {count === 1 ? 'Student' : 'Students'}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Student Table for Selected Class */}
                    {activeClass && (
                      <div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 mt-2 gap-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleClassSelect(inst.id, null)}
                              className="flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
                            >
                              <ArrowLeft size={14} /> Back to Classes
                            </button>
                            <h4 className="text-sm font-bold text-slate-700 tracking-wide uppercase flex items-center gap-2">
                              <GraduationCap size={16} className="text-secondary" />
                              Class {activeClass}th Students ({classStudents.length})
                            </h4>
                          </div>
                          <button
                            onClick={() => openPrintSheet(inst, activeClass)}
                            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-slate-900/15 hover:scale-[1.02]"
                          >
                            <Printer size={14} />
                            Print Class Sheet (Hardcopy)
                          </button>
                        </div>

                        {classStudents.length > 0 ? (
                          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-slate-50/80 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                                    <th className="p-3.5 pl-5">#</th>
                                    <th className="p-3.5">Student Name</th>
                                    <th className="p-3.5">Age</th>
                                    <th className="p-3.5">Sport</th>
                                    <th className="p-3.5 text-center">Sprint (s)</th>
                                    <th className="p-3.5 text-center">Jump (cm)</th>
                                    <th className="p-3.5 text-center">Pushups</th>
                                    <th className="p-3.5 text-center">Attendance</th>
                                    <th className="p-3.5 pr-5 text-right">Fitness</th>
                                  </tr>
                                </thead>
                                <tbody className="text-xs divide-y divide-slate-100 font-semibold text-slate-700">
                                  {classStudents.map((student, idx) => (
                                    <tr 
                                      key={student.id} 
                                      className={`hover:bg-blue-50/35 cursor-pointer transition-colors group ${
                                        student.attendance === 'Absent' ? 'bg-red-50/20' : ''
                                      }`}
                                      onClick={() => setSelectedStudentReport({ ...student, schoolName: inst.name })}
                                      title="Click to view athletic screening portfolio"
                                    >
                                      <td className="p-3.5 pl-5 text-slate-400 font-bold">{idx + 1}</td>
                                      <td className="p-3.5">
                                        <div className="flex items-center gap-2.5">
                                          <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden ring-2 ring-slate-100 group-hover:ring-secondary/40 transition-all shrink-0">
                                            <img src={`https://ui-avatars.com/api/?name=${student.name}&background=2563EB&color=fff&size=80`} alt={student.name} />
                                          </div>
                                          <div>
                                            <p className="font-extrabold text-slate-800 group-hover:text-secondary transition-colors">{student.name}</p>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="p-3.5 text-slate-500">{student.age}</td>
                                      <td className="p-3.5">
                                        <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-bold">
                                          {student.sport}
                                        </span>
                                      </td>
                                      <td className="p-3.5 text-center">{student.sprintTime || '-'}</td>
                                      <td className="p-3.5 text-center">{student.broadJump || '-'}</td>
                                      <td className="p-3.5 text-center">{student.pushups || '-'}</td>
                                      <td className="p-3.5 text-center">
                                        <span className={`inline-block px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                                          student.attendance === 'Absent' 
                                            ? 'bg-red-50 text-red-600 border border-red-100' 
                                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                        }`}>
                                          {student.attendance || 'Present'}
                                        </span>
                                      </td>
                                      <td className="p-3.5 pr-5 text-right">
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
                            <p className="text-slate-400 text-sm font-medium">No students in this class.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })}
      </div>

      {/* ═══════════════ PRINT CLASS SHEET MODAL ═══════════════ */}
      {printSheet && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setPrintSheet(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl relative border border-white/10 flex flex-col overflow-hidden max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
              <span className="font-extrabold text-xs tracking-wider uppercase flex items-center gap-2">
                <FileText size={18} className="text-accent" />
                Class {printSheet.className}th — Hardcopy Sheet
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-accent hover:bg-orange-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/10"
                >
                  <Printer size={14} /> Print Sheet
                </button>
                <button 
                  onClick={() => setPrintSheet(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold uppercase bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-all"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Printable Sheet Content */}
            <div className="p-6 overflow-y-auto" id="print-class-sheet">
              
              {/* Sheet Header */}
              <div className="text-center mb-6 pb-4 border-b-2 border-slate-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center font-bold text-lg text-white shadow-lg">
                    S
                  </div>
                  <span className="font-black text-lg tracking-wide uppercase text-slate-800">
                    Sport<span className="text-accent">Sphere</span>
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase mt-2">
                  Physical Test Evaluation Sheet
                </h2>
                <p className="text-sm font-bold text-slate-600 mt-2">{printSheet.instName}</p>
                <div className="flex items-center justify-center gap-6 mt-2 text-xs text-slate-500 font-semibold">
                  <span>Class: {printSheet.className}th Standard</span>
                  <span>•</span>
                  <span>Total Students: {printSheet.students.length}</span>
                  <span>•</span>
                  <span>Date: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>

              {/* Sheet Table */}
              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-3 border-r border-slate-600 text-center w-10">#</th>
                      <th className="p-3 border-r border-slate-600">Student Name</th>
                      <th className="p-3 border-r border-slate-600 text-center w-14">Age</th>
                      <th className="p-3 border-r border-slate-600 text-center">Sport</th>
                      <th className="p-3 border-r border-slate-600 text-center w-20">Sprint (s)</th>
                      <th className="p-3 border-r border-slate-600 text-center w-20">Jump (cm)</th>
                      <th className="p-3 border-r border-slate-600 text-center w-20">Pushups</th>
                      <th className="p-3 border-r border-slate-600 text-center w-24">Attendance</th>
                      <th className="p-3 text-center w-24">Fitness</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-slate-700">
                    {printSheet.students.map((student, idx) => (
                      <tr key={student.id} className={`border-t border-slate-200 ${student.attendance === 'Absent' ? 'bg-red-50/40' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                        <td className="p-3 border-r border-slate-200 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="p-3 border-r border-slate-200">
                          <span className="font-extrabold text-slate-800">{student.name}</span>
                        </td>
                        <td className="p-3 border-r border-slate-200 text-center">{student.age}</td>
                        <td className="p-3 border-r border-slate-200 text-center">{student.sport}</td>
                        <td className="p-3 border-r border-slate-200 text-center font-bold">
                          {student.attendance === 'Absent' ? '-' : (student.sprintTime || '-')}
                        </td>
                        <td className="p-3 border-r border-slate-200 text-center font-bold">
                          {student.attendance === 'Absent' ? '-' : (student.broadJump || '-')}
                        </td>
                        <td className="p-3 border-r border-slate-200 text-center font-bold">
                          {student.attendance === 'Absent' ? '-' : (student.pushups || '-')}
                        </td>
                        <td className="p-3 border-r border-slate-200 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded font-black text-[10px] uppercase ${
                            student.attendance === 'Absent' 
                              ? 'bg-red-100 text-red-600' 
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {student.attendance || 'Present'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                            student.performance === 'Excellent' ? 'bg-emerald-100 text-emerald-700' :
                            student.performance === 'Good' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {student.performance}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Row */}
              <div className="mt-4 grid grid-cols-3 gap-4 text-xs font-bold text-slate-600">
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-1">Present</p>
                  <p className="text-lg font-black text-emerald-700">
                    {printSheet.students.filter(s => s.attendance !== 'Absent').length}
                  </p>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-red-600 uppercase tracking-wider mb-1">Absent</p>
                  <p className="text-lg font-black text-red-600">
                    {printSheet.students.filter(s => s.attendance === 'Absent').length}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-blue-600 uppercase tracking-wider mb-1">Total</p>
                  <p className="text-lg font-black text-blue-700">
                    {printSheet.students.length}
                  </p>
                </div>
              </div>

              {/* Footer Signatures */}
              <div className="grid grid-cols-3 gap-8 pt-10 mt-8 border-t border-slate-200">
                <div className="text-center">
                  <div className="w-full h-px bg-slate-300 mb-1.5"></div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Class Teacher</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-px bg-slate-300 mb-1.5"></div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Physical Education Coach</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-px bg-slate-300 mb-1.5"></div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Principal</p>
                </div>
              </div>

              <p className="text-center text-[8px] text-slate-300 font-bold uppercase tracking-widest mt-6">
                Generated by SportSphere Athletic Alliance • {new Date().toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ STUDENT REPORT MODAL (preserved) ═══════════════ */}
      {selectedStudentReport && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedStudentReport(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl relative border border-white/10 flex flex-col justify-between overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <span className="font-extrabold text-xs tracking-wider uppercase flex items-center gap-2">
                <Trophy size={18} className="text-accent animate-pulse" />
                Physical Screening Portfolio
              </span>
              <div className="flex gap-2">
                {selectedStudentReport.sprintTime && (
                  <button
                    onClick={() => window.print()}
                    className="bg-accent hover:bg-orange-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/10"
                  >
                    <Printer size={14} /> Print Certificate
                  </button>
                )}
                <button 
                  onClick={() => setSelectedStudentReport(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold uppercase bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-all"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 bg-slate-50/50 max-h-[75vh] overflow-y-auto">
              
              {/* Profile Card Summary */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col sm:flex-row items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden ring-4 ring-slate-50 shrink-0">
                  <img src={`https://ui-avatars.com/api/?name=${selectedStudentReport.name}&background=2563EB&color=fff&size=120`} alt={selectedStudentReport.name} />
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">{selectedStudentReport.name}</h3>
                  <p className="text-xs text-slate-500 font-extrabold uppercase tracking-wide">
                    School: <span className="text-secondary">{selectedStudentReport.schoolName}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Standard: Class {selectedStudentReport.class}th • Age: {selectedStudentReport.age} Years • Registered Sport: {selectedStudentReport.sport}
                  </p>
                  {/* Attendance badge */}
                  <span className={`inline-block px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider mt-1 ${
                    selectedStudentReport.attendance === 'Absent'
                      ? 'bg-red-50 text-red-600 border border-red-100'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  }`}>
                    {selectedStudentReport.attendance === 'Absent' ? '🔴 Absent' : '🟢 Present'}
                  </span>
                </div>
              </div>

              {selectedStudentReport.sprintTime ? (
                <div id="print-athlete-card" className="mt-6 space-y-6">
                  
                  {/* Printing Header Overlay */}
                  <div className="hidden print:block text-center pb-4 border-b border-slate-200">
                    <span className="text-[10px] font-black text-amber-600 tracking-[0.2em] uppercase">SportSphere Athletic Alliance</span>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase mt-1">Official Screening Certificate</h2>
                    <p className="text-[9px] text-slate-500 mt-0.5">School: {selectedStudentReport.schoolName}</p>
                  </div>

                  {/* Print Card Body */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-700 font-extrabold text-sm border-b border-slate-150 pb-2">
                      <Activity size={16} className="text-secondary" />
                      Physical Assessment Parameters
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Sprint Panel */}
                      <div className="bg-white border border-slate-100 rounded-xl p-4 text-center shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-8 h-8 bg-blue-50 rounded-bl-full flex items-center justify-center text-[10px] font-bold text-secondary">
                          ⚡
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">50m Sprint</p>
                        <p className="font-extrabold text-slate-800 text-lg mt-1">{selectedStudentReport.sprintTime}s</p>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                          <div 
                            className="bg-secondary h-full rounded-full" 
                            style={{ width: `${Math.min(100, Math.max(10, (15 - selectedStudentReport.sprintTime) * 20))}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Jump Panel */}
                      <div className="bg-white border border-slate-100 rounded-xl p-4 text-center shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-50 rounded-bl-full flex items-center justify-center text-[10px] font-bold text-emerald-600">
                          📏
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Broad Jump</p>
                        <p className="font-extrabold text-slate-800 text-lg mt-1">{selectedStudentReport.broadJump}cm</p>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full" 
                            style={{ width: `${Math.min(100, (selectedStudentReport.broadJump / 300) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Pushups Panel */}
                      <div className="bg-white border border-slate-100 rounded-xl p-4 text-center shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-8 h-8 bg-amber-50 rounded-bl-full flex items-center justify-center text-[10px] font-bold text-amber-600">
                          💪
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Pushups</p>
                        <p className="font-extrabold text-slate-800 text-lg mt-1">{selectedStudentReport.pushups}</p>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                          <div 
                            className="bg-amber-500 h-full rounded-full" 
                            style={{ width: `${Math.min(100, (selectedStudentReport.pushups / 50) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sport Endorsement details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-700 font-extrabold text-sm border-b border-slate-150 pb-2">
                      <Award size={16} className="text-secondary" />
                      AI Sport Recommendation Endorsement
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white font-black text-xs tracking-wider uppercase rounded-xl shadow-md shadow-emerald-500/25">
                        <Trophy size={14} className="text-amber-300" />
                        {selectedStudentReport.recommendedSport}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">Recommended automatically by SportSphere</span>
                    </div>
                  </div>

                  {/* Manual Observations */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-700 font-extrabold text-sm border-b border-slate-150 pb-2">
                      <FileText size={16} className="text-secondary" />
                      Manual Screening Remarks & Observations
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold italic bg-slate-100 p-3 rounded-xl border border-slate-200 border-l-4 border-l-secondary">
                      "{selectedStudentReport.manualReportData}"
                    </p>
                  </div>

                  {/* Hardcopy Proof link */}
                  {selectedStudentReport.reportHardCopyUrl && (
                    <div className="space-y-3 print:hidden">
                      <div className="flex items-center gap-2 text-slate-700 font-extrabold text-sm border-b border-slate-150 pb-2">
                        <Eye size={16} className="text-secondary" />
                        Report Hardcopy Verification Proof
                      </div>
                      <div className="border border-slate-200 rounded-2xl overflow-hidden aspect-video bg-slate-900 flex items-center justify-center max-w-sm">
                        <img 
                          src={selectedStudentReport.reportHardCopyUrl} 
                          alt="Physical Screening Document" 
                          className="h-full w-auto object-cover hover:scale-105 transition-transform" 
                        />
                      </div>
                    </div>
                  )}

                  {/* Print Signatures */}
                  <div className="hidden print:grid grid-cols-2 gap-12 pt-8 border-t border-slate-200 mt-12">
                    <div className="text-center">
                      <p className="h-6 font-signature text-amber-700 italic font-bold">Coach Arthur</p>
                      <div className="w-full h-px bg-slate-350 mt-1"></div>
                      <span className="text-[8px] font-bold text-slate-400 uppercase mt-1 block">Athletic Director</span>
                    </div>
                    <div className="text-center">
                      <p className="h-6 font-signature text-secondary italic font-bold">Board Office</p>
                      <div className="w-full h-px bg-slate-350 mt-1"></div>
                      <span className="text-[8px] font-bold text-slate-400 uppercase mt-1 block">SportSphere Alliance Representative</span>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="mt-8 py-12 text-center bg-white border border-slate-100 rounded-2xl">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-4 border border-slate-100 animate-bounce">
                    <Activity size={32} />
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-base">Test Not Yet Conducted</h4>
                  <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto mt-2 leading-relaxed">
                    {selectedStudentReport.name} has not undergone physical test screening yet in the current session.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => setSelectedStudentReport(null)}
                      className="bg-secondary hover:bg-blue-600 text-white font-black text-xs uppercase px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/10 tracking-wide transition-all"
                    >
                      Go to Physical Tests Sheet
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-100 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Verification Code: {selectedStudentReport.id.toUpperCase()}-VERIFIED
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Institutions;
