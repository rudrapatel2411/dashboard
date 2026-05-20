import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Building2, Users, Search, Filter, CheckCircle2, Clock, 
  ChevronDown, ChevronUp, GraduationCap, Phone, Mail, Check, X, ShieldAlert,
  Award, Printer, Eye, Activity, Sparkles, Trophy, FileText, CheckCircle
} from 'lucide-react';

const Institutions = () => {
  // Rich mock data representing institutions and their nested students
  const [institutions, setInstitutions] = useState([
    {
      id: "inst-101",
      name: "St. Xavier's International School",
      email: "contact@stxaviers.edu",
      phone: "+91 98765 43210",
      status: "approved",
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
          recommendedSport: "Basketball & Volleyball",
          manualReportData: "Great vertical jump suspension and reach capability. Fast court response cycles and excellent hand-eye coordination.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop"
        },
        { id: "stu-3", name: "Aarav Mehta", age: 14, class: "8", sport: "Athletics", performance: "Good" },
        { id: "stu-4", name: "Sneha Reddy", age: 15, class: "9", sport: "Volleyball", performance: "Average" },
        { id: "stu-12", name: "Rohan Patel", age: 14, class: "8", sport: "Athletics", performance: "Good" },
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
          recommendedSport: "Athletics & Badminton",
          manualReportData: "Fast court movement, superior agility scores. Excellent lateral displacement velocity.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop"
        },
        { id: "stu-14", name: "Manan Desai", age: 16, class: "10", sport: "Football", performance: "Average" }
      ]
    },
    {
      id: "inst-102",
      name: "Delhi Public Sports Academy",
      email: "sports@dpsdelhi.edu",
      phone: "+91 91234 56789",
      status: "approved",
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
          recommendedSport: "Swimming & General Sports",
          manualReportData: "Superb breathing rhythm and lung stamina capacity. Ideal buoyancy indicators and flexibility markers.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop"
        },
        { id: "stu-7", name: "Ishaan Verma", age: 15, class: "9", sport: "Football", performance: "Average" },
        { id: "stu-30", name: "Manish Kumar", age: 16, class: "10", sport: "Cricket", performance: "Good" },
        { id: "stu-31", name: "Divya Teja", age: 14, class: "8", sport: "Athletics", performance: "Average" },
        { id: "stu-32", name: "Preeti Shenoy", age: 15, class: "9", sport: "Basketball", performance: "Good" }
      ]
    },
    {
      id: "inst-103",
      name: "Ryan Elite High School",
      email: "info@ryanelite.org",
      phone: "+91 88776 65544",
      status: "pending",
      registeredAt: "2026-05-18",
      studentCount: 5,
      students: [
        { id: "stu-8", name: "Aditya Roy", age: 14, class: "8", sport: "Basketball", performance: "Good" },
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
          recommendedSport: "Athletics & Long Jump",
          manualReportData: "Great core stability. Quick explosive starts observed. High levels of physical fitness and joint flexibility.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop"
        },
        { id: "stu-33", name: "Arjun Rampal", age: 15, class: "9", sport: "Football", performance: "Good" },
        { id: "stu-34", name: "Kareena Kapoor", age: 16, class: "10", sport: "Badminton", performance: "Average" },
        { id: "stu-35", name: "Saif Khan", age: 17, class: "11", sport: "Volleyball", performance: "Good" }
      ]
    },
    {
      id: "inst-104",
      name: "Oakridge International Sports Hub",
      email: "oakridge@oakridge.in",
      phone: "+91 77665 54433",
      status: "pending",
      registeredAt: "2026-05-19",
      studentCount: 5,
      students: [
        { id: "stu-10", name: "Varun Dhawan", age: 15, class: "9", sport: "Cricket", performance: "Good" },
        { id: "stu-11", name: "Kiara Advani", age: 14, class: "8", sport: "Swimming", performance: "Average" },
        { id: "stu-36", name: "Siddharth Malhotra", age: 16, class: "10", sport: "Football", performance: "Excellent" },
        { id: "stu-37", name: "Alia Bhatt", age: 15, class: "9", sport: "Gymnastics", performance: "Excellent" },
        { id: "stu-38", name: "Katrina Kaif", age: 14, class: "8", sport: "Athletics", performance: "Good" }
      ]
    },
    {
      id: "inst-105",
      name: "DAV Public School, Gandhinagar",
      email: "info@davgandhinagar.org",
      phone: "+91 94567 12345",
      status: "approved",
      registeredAt: "2026-03-24",
      studentCount: 6,
      students: [
        { id: "stu-12", name: "Rohan Patel", age: 14, class: "8", sport: "Athletics", performance: "Good" },
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
          recommendedSport: "Athletics & Badminton",
          manualReportData: "Fast court movement, superior agility scores. Excellent lateral displacement velocity.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop"
        },
        { id: "stu-14", name: "Manan Desai", age: 16, class: "10", sport: "Football", performance: "Average" },
        { id: "stu-39", name: "Neil Nitin", age: 15, class: "9", sport: "Volleyball", performance: "Average" },
        { id: "stu-40", name: "Mukesh Ambani", age: 16, class: "10", sport: "Cricket", performance: "Good" },
        { id: "stu-41", name: "Nita Shah", age: 14, class: "8", sport: "Swimming", performance: "Excellent" }
      ]
    },
    {
      id: "inst-106",
      name: "Lotus Valley Athletics Academy",
      email: "athletics@lotusvalley.edu",
      phone: "+91 81234 98765",
      status: "approved",
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
          recommendedSport: "Cricket & Athletics",
          manualReportData: "Strong batting stance and wrist coordination. Exceptional physical power output indexes.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop"
        },
        { id: "stu-16", name: "Meera Joshi", age: 16, class: "10", sport: "Basketball", performance: "Good" },
        { id: "stu-17", name: "Devansh Vyas", age: 15, class: "9", sport: "Athletics", performance: "Good" },
        { id: "stu-42", name: "Gautam Adani", age: 16, class: "10", sport: "Swimming", performance: "Excellent" },
        { id: "stu-43", name: "Kunal Shah", age: 14, class: "8", sport: "Football", performance: "Average" }
      ]
    },
    {
      id: "inst-107",
      name: "Silver Oak Sports High",
      email: "admin@silveroakhigh.com",
      phone: "+91 79988 66554",
      status: "pending",
      registeredAt: "2026-05-19",
      studentCount: 5,
      students: [
        { id: "stu-18", name: "Shreya Ghoshal", age: 14, class: "8", sport: "Swimming", performance: "Average" },
        { id: "stu-19", name: "Arijit Roy", age: 15, class: "9", sport: "Tennis", performance: "Good" },
        { id: "stu-44", name: "Sonu Nigam", age: 16, class: "10", sport: "Cricket", performance: "Good" },
        { id: "stu-45", name: "Sunidhi Chauhan", age: 15, class: "9", sport: "Athletics", performance: "Excellent" },
        { id: "stu-46", name: "Badshah Singh", age: 17, class: "11", sport: "Football", performance: "Average" }
      ]
    },
    {
      id: "inst-108",
      name: "Shanti Asiatic School, Ahmedabad",
      email: "contact@shantiasiatic.edu.in",
      phone: "+91 90088 77665",
      status: "approved",
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
          recommendedSport: "Basketball & Volleyball",
          manualReportData: "Great arm swing velocities. Lower body explosive metrics are superior. Excellent jumping response indices.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop"
        },
        { id: "stu-21", name: "Krisha Mehta", age: 15, class: "9", sport: "Football", performance: "Good" },
        { id: "stu-22", name: "Naman Pandya", age: 17, class: "11", sport: "Cricket", performance: "Average" },
        { id: "stu-47", name: "Hardik Pandya", age: 16, class: "10", sport: "Athletics", performance: "Excellent" },
        { id: "stu-48", name: "Krunal Pandya", age: 15, class: "9", sport: "Volleyball", performance: "Average" },
        { id: "stu-49", name: "Rashmika Mandanna", age: 14, class: "8", sport: "Badminton", performance: "Excellent" }
      ]
    },
    {
      id: "inst-109",
      name: "Greenwood Sports Alliance",
      email: "alliance@greenwood.in",
      phone: "+91 80011 22334",
      status: "pending",
      registeredAt: "2026-05-20",
      studentCount: 5,
      students: [
        { id: "stu-23", name: "Yashvi Patel", age: 14, class: "8", sport: "Athletics", performance: "Good" },
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
          recommendedSport: "Swimming & Sprinting",
          manualReportData: "Fastest response index recorded in standard 10th. Dynamic physical form and heart recovery factors are flawless.",
          reportHardCopyUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop"
        },
        { id: "stu-50", name: "Vijay Deverakonda", age: 15, class: "9", sport: "Football", performance: "Good" },
        { id: "stu-51", name: "Samantha Ruth", age: 14, class: "8", sport: "Athletics", performance: "Average" },
        { id: "stu-52", name: "Allu Arjun", age: 16, class: "10", sport: "Cricket", performance: "Excellent" }
      ]
    }
  ]);

  const [expandedId, setExpandedId] = useState("inst-101");
  
  // Connect with global DashboardLayout search context
  const outletContext = useOutletContext();
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const searchTerm = outletContext ? outletContext.searchTerm : localSearchTerm;
  const setSearchTerm = outletContext ? outletContext.setSearchTerm : setLocalSearchTerm;

  const [classFilter, setClassFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // State for active student portfolio report modal
  const [selectedStudentReport, setSelectedStudentReport] = useState(null);

  // Toggle accordion expand/collapse
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Quick Action: Approve Institution
  const approveInstitution = (id) => {
    setInstitutions(institutions.map(inst => 
      inst.id === id ? { ...inst, status: "approved" } : inst
    ));
  };

  // Quick Action: Reject/Hold Institution
  const rejectInstitution = (id) => {
    setInstitutions(institutions.map(inst => 
      inst.id === id ? { ...inst, status: "pending" } : inst
    ));
  };

  // Statistics calculation
  const totalInsts = institutions.length;
  const pendingApprovals = institutions.filter(i => i.status === "pending").length;
  const totalStudentsCount = institutions.reduce((acc, curr) => acc + curr.students.length, 0);

  return (
    <div className="space-y-8 animate-fade-in pb-12 font-sans">
      
      {/* Dynamic Printing Style rules */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
            background: none !important;
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
            Manage logged-in schools, authorize dashboard access, and click any student to inspect their active evaluation reports.
          </p>
        </div>
        
        {pendingApprovals > 0 && (
          <div className="flex items-center gap-2.5 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold shadow-sm animate-pulse">
            <ShieldAlert size={16} />
            <span>{pendingApprovals} Registration approvals pending</span>
          </div>
        )}
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
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pending Approval</p>
            <h3 className={`text-3xl font-black mt-2 ${pendingApprovals > 0 ? 'text-amber-500' : 'text-slate-700'}`}>
              {pendingApprovals}
            </h3>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${pendingApprovals > 0 ? 'bg-amber-100 text-amber-600 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
            <Clock size={24} />
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
      </div>

      {/* Toolbar - Search, Filter, Status */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          
          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 font-bold uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary bg-white min-w-[120px]"
            >
              <option value="All">All Accounts</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Student Class Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 font-bold uppercase">Student Standard:</span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary bg-white min-w-[140px]"
            >
              <option value="All">All Standards</option>
              <option value="8">Standard 8</option>
              <option value="9">Standard 9</option>
              <option value="10">Standard 10</option>
              <option value="11">Standard 11</option>
            </select>
          </div>

        </div>
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
          .filter(inst => statusFilter === "All" ? true : inst.status === statusFilter)
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
            
            // Filter and bubble matching students starting with query to the top
            const filteredStudents = inst.students
              .filter(stu => classFilter === "All" ? true : stu.class === classFilter)
              .sort((a, b) => {
                const term = searchTerm.toLowerCase();
                if (!term) return 0;
                const aStarts = a.name.toLowerCase().startsWith(term);
                const bStarts = b.name.toLowerCase().startsWith(term);
                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;
                return 0;
              });

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
                    <div className={`p-3.5 rounded-xl flex items-center justify-center shrink-0 ${
                      inst.status === 'approved' 
                        ? 'bg-blue-50 text-secondary' 
                        : 'bg-amber-50 text-amber-600'
                    }`}>
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

                  {/* Actions / Badges right side */}
                  <div className="flex items-center gap-4 self-end md:self-center">
                    
                    {/* Status Badge */}
                    {inst.status === 'approved' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-full animate-pulse">
                        <Clock size={14} className="text-amber-500" />
                        Pending Approval
                      </span>
                    )}

                    {/* Quick Approval Action button */}
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {inst.status === 'pending' ? (
                        <button
                          onClick={() => approveInstitution(inst.id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/10 hover:scale-105 transition-all flex items-center gap-1 px-3 py-1.5"
                        >
                          <Check size={14} /> Approve Access
                        </button>
                      ) : (
                        <button
                          onClick={() => rejectInstitution(inst.id)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 px-3 py-1.5"
                        >
                          <X size={14} /> Revoke Approval
                        </button>
                      )}
                    </div>

                    {/* Collapse icon */}
                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>

                  </div>
                </div>

                {/* Collapsible Panel content */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/30">
                    <div className="flex items-center justify-between mb-4 mt-2">
                      <h4 className="text-sm font-bold text-slate-700 tracking-wide uppercase flex items-center gap-2">
                        <GraduationCap size={16} className="text-secondary" />
                        Active Student Roster ({filteredStudents.length})
                      </h4>
                      {classFilter !== "All" && (
                        <span className="text-xs bg-secondary/15 text-secondary px-2.5 py-1 rounded-md font-bold">
                          Filtered by Standard {classFilter}
                        </span>
                      )}
                    </div>

                    {filteredStudents.length > 0 ? (
                      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50/80 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                                <th className="p-3.5 pl-5">Student Name</th>
                                <th className="p-3.5">Age</th>
                                <th className="p-3.5">Standard (Class)</th>
                                <th className="p-3.5">Assigned Sport</th>
                                <th className="p-3.5 pr-5 text-right">Fitness Status</th>
                              </tr>
                            </thead>
                            <tbody className="text-xs divide-y divide-slate-100 font-semibold text-slate-700">
                              {filteredStudents.map((student) => (
                                <tr 
                                  key={student.id} 
                                  className="hover:bg-blue-50/35 cursor-pointer transition-colors group"
                                  onClick={() => setSelectedStudentReport({ ...student, schoolName: inst.name })}
                                  title="Click to view athletic screening portfolio"
                                >
                                  <td className="p-3.5 pl-5">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden ring-2 ring-slate-100 group-hover:ring-secondary/40 transition-all shrink-0">
                                        <img src={`https://ui-avatars.com/api/?name=${student.name}&background=2563EB&color=fff&size=80`} alt={student.name} />
                                      </div>
                                      <div>
                                        <p className="font-extrabold text-slate-800 group-hover:text-secondary transition-colors">{student.name}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Click to inspect report ⚡</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-3.5 text-slate-500">{student.age} Years</td>
                                  <td className="p-3.5">
                                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                                      Class {student.class}th
                                    </span>
                                  </td>
                                  <td className="p-3.5">
                                    <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-bold">
                                      {student.sport}
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
                        <p className="text-slate-400 text-sm font-medium">No students registered matching this standard.</p>
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })}
      </div>

      {/* Student Physical Performance Report Card Modal */}
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
