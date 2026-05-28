import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  School, Users, Search, ChevronDown, ChevronUp, GraduationCap, 
  Phone, Mail, Trophy, FileText, CheckCircle, ArrowLeft, BookOpen, 
  X, DollarSign, Calendar, MapPin, Printer, User, Award, Check, AlertCircle
} from 'lucide-react';

const Academies = () => {
  // Rich mock data representing Sports Academies with Grade 9-10 students
  const [academies, setAcademies] = useState([
    {
      id: "acad-1",
      name: "Dronacharya Cricket Academy",
      sport: "Cricket",
      coach: "Coach Devendra Prasad",
      email: "contact@dronacharyacricket.in",
      phone: "+91 99887 76655",
      registeredAt: "2026-03-10",
      location: "Ahmedabad, Gujarat",
      budget: "₹4,50,000 / Year",
      gradient: "from-red-500 to-rose-600",
      students: [
        { 
          id: "stu-c1", 
          name: "Rohan Patel", 
          age: 15, 
          class: "9", 
          attendance: "Present", 
          feesStatus: "Paid", 
          feesAmount: 15000, 
          receiptId: "REC-2026-001",
          paymentDate: "2026-05-02",
          paymentMethod: "UPI (Google Pay)"
        },
        { 
          id: "stu-c2", 
          name: "Amit Mishra", 
          age: 15, 
          class: "9", 
          attendance: "Present", 
          feesStatus: "Paid", 
          feesAmount: 15000, 
          receiptId: "REC-2026-002",
          paymentDate: "2026-05-05",
          paymentMethod: "Net Banking"
        },
        { 
          id: "stu-c3", 
          name: "Kabir Dev", 
          age: 16, 
          class: "10", 
          attendance: "Absent", 
          feesStatus: "Pending", 
          feesAmount: 15000 
        },
        { 
          id: "stu-c4", 
          name: "Sachin Verma", 
          age: 16, 
          class: "10", 
          attendance: "Present", 
          feesStatus: "Paid", 
          feesAmount: 15000, 
          receiptId: "REC-2026-003",
          paymentDate: "2026-05-01",
          paymentMethod: "Credit Card"
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
      budget: "₹6,20,000 / Year",
      gradient: "from-emerald-500 to-teal-600",
      students: [
        { 
          id: "stu-f1", 
          name: "Aditya Roy", 
          age: 15, 
          class: "9", 
          attendance: "Present", 
          feesStatus: "Paid", 
          feesAmount: 12000, 
          receiptId: "REC-2026-004",
          paymentDate: "2026-05-04",
          paymentMethod: "UPI (PhonePe)"
        },
        { 
          id: "stu-f2", 
          name: "Neil Nitin", 
          age: 16, 
          class: "10", 
          attendance: "Present", 
          feesStatus: "Paid", 
          feesAmount: 12000, 
          receiptId: "REC-2026-005",
          paymentDate: "2026-05-08",
          paymentMethod: "Debit Card"
        },
        { 
          id: "stu-f3", 
          name: "Arjun Rampal", 
          age: 15, 
          class: "9", 
          attendance: "Absent", 
          feesStatus: "Pending", 
          feesAmount: 12000 
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
      budget: "₹3,80,000 / Year",
      gradient: "from-cyan-500 to-blue-600",
      students: [
        { 
          id: "stu-b1", 
          name: "Jiya Shah", 
          age: 15, 
          class: "9", 
          attendance: "Present", 
          feesStatus: "Paid", 
          feesAmount: 18000, 
          receiptId: "REC-2026-006",
          paymentDate: "2026-05-03",
          paymentMethod: "UPI (Paytm)"
        },
        { 
          id: "stu-b2", 
          name: "Sneha Reddy", 
          age: 15, 
          class: "9", 
          attendance: "Present", 
          feesStatus: "Paid", 
          feesAmount: 18000, 
          receiptId: "REC-2026-007",
          paymentDate: "2026-05-07",
          paymentMethod: "UPI (GPay)"
        },
        { 
          id: "stu-b3", 
          name: "Kareena Kapoor", 
          age: 16, 
          class: "10", 
          attendance: "Absent", 
          feesStatus: "Pending", 
          feesAmount: 18000 
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
      budget: "₹5,00,000 / Year",
      gradient: "from-blue-500 to-indigo-600",
      students: [
        { 
          id: "stu-s1", 
          name: "Priya Patel", 
          age: 16, 
          class: "10", 
          attendance: "Present", 
          feesStatus: "Paid", 
          feesAmount: 14000, 
          receiptId: "REC-2026-008",
          paymentDate: "2026-05-09",
          paymentMethod: "Net Banking"
        },
        { 
          id: "stu-s2", 
          name: "Ishaan Verma", 
          age: 15, 
          class: "9", 
          attendance: "Present", 
          feesStatus: "Paid", 
          feesAmount: 14000, 
          receiptId: "REC-2026-009",
          paymentDate: "2026-05-10",
          paymentMethod: "UPI"
        },
        { 
          id: "stu-s3", 
          name: "Kiara Advani", 
          age: 15, 
          class: "9", 
          attendance: "Absent", 
          feesStatus: "Pending", 
          feesAmount: 14000 
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
      budget: "₹4,10,000 / Year",
      gradient: "from-orange-500 to-amber-600",
      students: [
        { 
          id: "stu-a1", 
          name: "Rohan Sharma", 
          age: 15, 
          class: "9", 
          attendance: "Present", 
          feesStatus: "Paid", 
          feesAmount: 10000, 
          receiptId: "REC-2026-010",
          paymentDate: "2026-05-01",
          paymentMethod: "Cash"
        },
        { 
          id: "stu-a2", 
          name: "Diya Sen", 
          age: 16, 
          class: "10", 
          attendance: "Present", 
          feesStatus: "Paid", 
          feesAmount: 10000, 
          receiptId: "REC-2026-011",
          paymentDate: "2026-05-02",
          paymentMethod: "Net Banking"
        },
        { 
          id: "stu-a3", 
          name: "Aarav Mehta", 
          age: 15, 
          class: "9", 
          attendance: "Present", 
          feesStatus: "Pending", 
          feesAmount: 10000 
        }
      ]
    }
  ]);

  const [expandedId, setExpandedId] = useState(null);
  const [selectedClass, setSelectedClass] = useState({});
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedStudentReport, setSelectedStudentReport] = useState(null);

  // Fetch approved academies from the backend database on load
  useEffect(() => {
    const fetchApprovedAcademies = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/institutes?status=approved&type=academy`, {
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
              isDb: true
            };
          });
          
          setAcademies(prev => {
            const filteredDb = formatted.filter(db => !prev.some(p => p.id === db.id || p.name.toLowerCase() === db.name.toLowerCase()));
            return [...filteredDb, ...prev];
          });
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
              const feesStatus = s.feesStatus || (Math.random() > 0.3 ? "Paid" : "Pending");
              const feesAmount = s.feesAmount || 15000;
              const hasPaid = feesStatus === "Paid";
              
              return {
                id: s._id || s.id,
                studentId: s.studentId,
                name: s.name,
                age,
                class: s.class,
                attendance: s.attendance || "Present",
                feesStatus,
                feesAmount,
                receiptId: hasPaid ? (s.receiptId || `REC-2026-${Math.floor(100 + Math.random() * 900)}`) : undefined,
                paymentDate: hasPaid ? (s.paymentDate || new Date().toISOString().split('T')[0]) : undefined,
                paymentMethod: hasPaid ? (s.paymentMethod || 'UPI (Google Pay)') : undefined,
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

  // Toggle Student Attendance On-The-Fly (Daily Attendance System)
  const toggleAttendance = (acadId, studentId) => {
    setAcademies(prevAcademies => 
      prevAcademies.map(acad => {
        if (acad.id !== acadId) return acad;
        return {
          ...acad,
          students: acad.students.map(stu => {
            if (stu.id !== studentId) return stu;
            const newAttendance = stu.attendance === 'Present' ? 'Absent' : 'Present';
            showToast(`${stu.name} is now marked ${newAttendance}!`);
            return { ...stu, attendance: newAttendance };
          })
        };
      })
    );
  };

  // Helper to show modern micro-toasts
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Toggle Fees Payment Status (simulate receipts generation)
  const toggleFeesStatus = (acadId, studentId) => {
    setAcademies(prevAcademies => 
      prevAcademies.map(acad => {
        if (acad.id !== acadId) return acad;
        return {
          ...acad,
          students: acad.students.map(stu => {
            if (stu.id !== studentId) return stu;
            const isPaying = stu.feesStatus === 'Pending';
            
            const updatedStu = {
              ...stu,
              feesStatus: isPaying ? 'Paid' : 'Pending',
              receiptId: isPaying ? `REC-2026-${Math.floor(100 + Math.random() * 900)}` : undefined,
              paymentDate: isPaying ? new Date().toISOString().split('T')[0] : undefined,
              paymentMethod: isPaying ? 'UPI (Generated)' : undefined
            };

            showToast(`${stu.name}'s fees status changed to ${updatedStu.feesStatus}!`);
            return updatedStu;
          })
        };
      })
    );
  };

  // Statistics Calculation
  const totalAcademies = academies.length;
  const allStudents = academies.flatMap(a => a.students);
  const totalEnrolled = allStudents.length;
  
  // Total Fees Collected
  const totalFeesCollected = allStudents
    .filter(s => s.feesStatus === 'Paid')
    .reduce((sum, s) => sum + (s.feesAmount || 0), 0);

  // Overall Attendance Rate
  const presentCount = allStudents.filter(s => s.attendance === 'Present').length;
  const attendanceRate = totalEnrolled > 0 ? Math.round((presentCount / totalEnrolled) * 100) : 0;

  // View Receipt Modal
  const openReceipt = (student, academy) => {
    setSelectedReceipt({
      receiptId: student.receiptId,
      studentName: student.name,
      class: student.class,
      feesAmount: student.feesAmount,
      paymentDate: student.paymentDate,
      paymentMethod: student.paymentMethod || 'UPI Swap',
      academyName: academy.name,
      sport: academy.sport,
      coach: academy.coach,
      location: academy.location
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 font-sans relative">
      
      {/* Dynamic Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-bounce duration-500 font-bold text-xs uppercase tracking-wide">
          <CheckCircle size={18} className="text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Print styles for Invoice Receipt */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
            background: none !important;
          }
          #print-receipt-modal, #print-receipt-modal * {
            visibility: visible;
          }
          #print-receipt-modal {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw !important;
            max-width: 100% !important;
            padding: 2rem !important;
            background-color: white !important;
            border: none !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <School className="text-secondary w-8 h-8" />
            Academy Management
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Manage sports academies, track student daily attendance, view fee receipts, and configure coach-sport assignments.
          </p>
        </div>
      </div>

      {/* Analytics Counter Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Fees Collected</p>
            <h3 className="text-3xl font-black text-emerald-600 mt-2">₹{totalFeesCollected.toLocaleString('en-IN')}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Daily Attendance Rate</p>
            <h3 className="text-3xl font-black text-amber-600 mt-2">{attendanceRate}%</h3>
          </div>
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
            <CheckCircle size={24} />
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
          Click an academy to configure Grade 9/10 roster, record daily attendance & view invoice receipts.
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
                      {acad.students.length} Enrolled
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
                                  <th className="p-4 pl-6">Athlete Name</th>
                                  <th className="p-4 text-center">Class / Standard</th>
                                  <th className="p-4 text-center">Age</th>
                                  <th className="p-4 text-center">Sport Speciality</th>
                                  <th className="p-4 text-center">Daily Attendance</th>
                                  <th className="p-4 text-center">Fees Status</th>
                                  <th className="p-4 pr-6 text-right">Receipt Details</th>
                                </tr>
                              </thead>
                              <tbody className="text-xs divide-y divide-slate-100 font-semibold text-slate-700">
                                {acad.students.map(student => (
                                  <tr 
                                    key={student.id}
                                    className={`hover:bg-slate-50/50 cursor-pointer transition-colors group ${
                                      student.attendance === 'Absent' ? 'bg-red-50/20 hover:bg-red-50/30' : ''
                                    }`}
                                    onClick={() => setSelectedStudentReport({ ...student, academyName: acad.name })}
                                    title="Click to view athlete profile & contact details"
                                  >
                                    {/* Student Name */}
                                    <td className="p-4 pl-6">
                                      <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden ring-2 ring-slate-100 group-hover:ring-secondary/40 transition-all shrink-0">
                                          <img src={`https://ui-avatars.com/api/?name=${student.name}&background=2563EB&color=fff&size=80`} alt={student.name} />
                                        </div>
                                        <div>
                                          <p className="font-extrabold text-slate-800 group-hover:text-secondary transition-colors">{student.name}</p>
                                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">ID: {student.id || student._id}</span>
                                        </div>
                                      </div>
                                    </td>

                                    {/* Class/Standard */}
                                    <td className="p-4 text-center text-slate-800 font-extrabold">Class {student.class}th</td>

                                    {/* Age */}
                                    <td className="p-4 text-center text-slate-500">{student.age}</td>

                                    {/* Sport Badge */}
                                    <td className="p-4 text-center">
                                      <span className={`inline-block px-3 py-1 bg-gradient-to-r ${acad.gradient} text-white rounded-full font-black text-[10px] uppercase tracking-wider`}>
                                        {acad.sport}
                                      </span>
                                    </td>

                                    {/* Daily Attendance Badge (Read-Only for Admin) */}
                                    <td className="p-4 text-center text-xs">
                                      <span
                                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider border select-none ${
                                          student.attendance === 'Present'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-150'
                                            : 'bg-rose-50 text-rose-600 border-rose-150'
                                        }`}
                                      >
                                        <span className={`w-2 h-2 rounded-full ${student.attendance === 'Present' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                                        {student.attendance}
                                      </span>
                                    </td>

                                    {/* Fees Status Badge (Read-Only for Admin) */}
                                    <td className="p-4 text-center">
                                      <span
                                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border select-none ${
                                          student.feesStatus === 'Paid'
                                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                            : 'bg-amber-100 text-amber-800 border-amber-300'
                                        }`}
                                      >
                                        {student.feesStatus === 'Paid' ? <Check size={12} /> : <AlertCircle size={12} />}
                                        {student.feesStatus}
                                      </span>
                                    </td>

                                    {/* View/Print Invoice Receipt Button */}
                                    <td className="p-4 pr-6 text-right">
                                      {student.feesStatus === 'Paid' ? (
                                        <button
                                          onClick={(e) => { e.stopPropagation(); openReceipt(student, acad); }}
                                          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all hover:scale-[1.02] shadow-md shadow-slate-900/10 cursor-pointer"
                                        >
                                          <FileText size={13} />
                                          Invoice Receipt
                                        </button>
                                      ) : (
                                        <span className="text-slate-400 font-bold text-xs">No Receipt</span>
                                      )}
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
                          <p className="text-slate-400 text-sm font-medium">No students registered in this academy.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* ═══════════════ BEAUTIFUL INVOICE FEES RECEIPT MODAL ═══════════════ */}
      {selectedReceipt && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in no-print"
          onClick={() => setSelectedReceipt(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-xl w-full shadow-2xl relative border border-slate-200/50 flex flex-col overflow-hidden max-h-[90vh] animate-scale-up"
            id="print-receipt-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Actions (Hide on Print) */}
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center shrink-0 no-print">
              <span className="font-extrabold text-xs tracking-wider uppercase flex items-center gap-2">
                <FileText size={18} className="text-accent" />
                Athlete Fees Receipt
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-accent hover:bg-orange-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/10 cursor-pointer"
                >
                  <Printer size={14} /> Print Receipt
                </button>
                <button 
                  onClick={() => setSelectedReceipt(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold uppercase bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Receipt Printable Content */}
            <div className="p-8 overflow-y-auto bg-slate-50/50">
              
              {/* Receipt Border Container */}
              <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-6 shadow-sm relative">
                
                {/* Visual Watermark background stamp */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
                  <Trophy size={200} className="text-primary" />
                </div>

                {/* Top Header */}
                <div className="text-center pb-4 border-b border-slate-200">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center font-bold text-base text-white shadow-lg">
                      S
                    </div>
                    <span className="font-black text-base tracking-wide uppercase text-slate-800">
                      Sport<span className="text-accent">Sphere</span>
                    </span>
                  </div>
                  <h3 className="text-xs font-black text-slate-400 tracking-widest uppercase">
                    Official Payment Receipt
                  </h3>
                </div>

                {/* Invoice Metadata */}
                <div className="grid grid-cols-2 gap-4 py-4 text-xs font-semibold text-slate-600 border-b border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Receipt Number</p>
                    <p className="text-slate-800 font-extrabold mt-0.5">{selectedReceipt.receiptId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-black">Payment Date</p>
                    <p className="text-slate-800 font-extrabold mt-0.5">{selectedReceipt.paymentDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Academy/Club Name</p>
                    <p className="text-slate-800 font-extrabold mt-0.5">{selectedReceipt.academyName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-black">Location</p>
                    <p className="text-slate-800 font-extrabold mt-0.5">{selectedReceipt.location}</p>
                  </div>
                </div>

                {/* Athlete Details */}
                <div className="py-4 text-xs space-y-2.5 border-b border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold">Athlete Name:</span>
                    <span className="text-slate-800 font-extrabold">{selectedReceipt.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold">Academy Standard:</span>
                    <span className="text-slate-800 font-extrabold">Class {selectedReceipt.class}th Standard</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold">Associated Sport:</span>
                    <span className="text-slate-800 font-extrabold flex items-center gap-1 uppercase text-[10px]">
                      <Award size={13} className="text-secondary" /> {selectedReceipt.sport}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold">Assigned Head Coach:</span>
                    <span className="text-slate-800 font-extrabold">{selectedReceipt.coach}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold">Payment Method:</span>
                    <span className="text-slate-800 font-extrabold">{selectedReceipt.paymentMethod}</span>
                  </div>
                </div>

                {/* Final Total Box */}
                <div className="mt-5 bg-slate-50 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black block">Total Fees Paid</span>
                    <span className="text-xs text-emerald-600 font-black uppercase tracking-wider mt-0.5 flex items-center gap-1">
                      <CheckCircle size={14} /> Transaction Success
                    </span>
                  </div>
                  <span className="text-2xl font-black text-slate-900">
                    ₹{selectedReceipt.feesAmount.toLocaleString('en-IN')}.00
                  </span>
                </div>

                {/* Bottom Signature Mockup */}
                <div className="flex justify-between items-end mt-8 text-[9px] font-black uppercase tracking-wider text-slate-400">
                  <div>
                    <p className="border-t border-slate-200 pt-1 text-center w-28">Payer Signature</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-8 bg-[url('https://upload.wikimedia.org/wikipedia/commons/3/3a/Jon_Kirsch_Signature.png')] bg-contain bg-no-repeat mx-auto opacity-70"></div>
                    <p className="border-t border-slate-200 pt-1 text-center w-28">Authorized Stamp</p>
                  </div>
                </div>

              </div>

              {/* Thank you note */}
              <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-6">
                Thank you for training with SportSphere Athletics!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ ATHLETE PROFILE REPORT MODAL ═══════════════ */}
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
                <button 
                  onClick={() => setSelectedStudentReport(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold uppercase bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
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
                    Academy: <span className="text-secondary">{selectedStudentReport.academyName}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Standard: Class {selectedStudentReport.class}th • Age: {selectedStudentReport.age} Years • Fees Status: {selectedStudentReport.feesStatus}
                  </p>
                  {/* Attendance badge */}
                  <span className={`inline-block px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider mt-1 ${
                    selectedStudentReport.attendance === 'Absent'
                      ? 'bg-red-50 text-red-600 border border-red-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  }`}>
                    {selectedStudentReport.attendance === 'Absent' ? '🔴 Absent' : '🟢 Present'}
                  </span>
                </div>
              </div>

              {/* Student Personal Information Details Block */}
              <div className="mt-6 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-700 font-extrabold text-sm border-b border-slate-150 pb-2">
                  <User size={16} className="text-secondary" />
                  Student Personal Profile & Contact Details
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Student / Athlete ID</p>
                    <p className="text-slate-800 font-extrabold mt-0.5">{selectedStudentReport.id || selectedStudentReport._id || "STU-001"}</p>
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
        </div>
      )}
    </div>
  );
};

export default Academies;
