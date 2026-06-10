import React, { useState, useEffect } from 'react';
import { FileBarChart, ChevronDown, Download, Loader2, TrendingUp, TrendingDown, Users, Award, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const STANDARDS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const TERMS = ['TERM-1', 'TERM-2', 'HALF-YEARLY', 'ANNUAL'];

const InstituteReports = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const authHeaders = {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    if (selectedClass) {
      fetchReport();
    } else {
      setReportData(null);
    }
  }, [selectedClass, selectedTerm]);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedClass) params.append('class', selectedClass);
      if (selectedTerm) params.append('term', selectedTerm);

      const res = await fetch(`${API_URL}/institute-portal/reports?${params.toString()}`, { headers: authHeaders });
      if (res.ok) {
        const data = await res.json();
        setReportData(data);
      }
    } catch (err) {
      console.error('Failed to fetch report');
    } finally {
      setIsLoading(false);
    }
  };

  const exportPDF = () => {
    if (!reportData || !reportData.records || reportData.records.length === 0) return;

    const doc = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // --- Header Section ---
    // Background header bar
    doc.setFillColor(27, 59, 43); // Deep Forest Green
    doc.rect(0, 0, pageWidth, 38, 'F');

    // Accent line
    doc.setFillColor(210, 180, 140); // Warm Sand/Gold accent stripe
    doc.rect(0, 38, pageWidth, 2, 'F');

    // Institute Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(user.instituteName || 'SportSphere Institute', 14, 16);

    // Report Title
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(240, 244, 240);
    doc.text(`Class ${selectedClass} Performance Report${selectedTerm ? ` — ${selectedTerm}` : ''}`, 14, 25);

    // Date on right
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth - 14, 16, { align: 'right' });
    doc.text('SportSphere Platform', pageWidth - 14, 22, { align: 'right' });

    // --- Summary Stats ---
    const summary = reportData.summary;
    const statsY = 46;
    doc.setTextColor(27, 59, 43);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Performance Summary & Analytics', 14, statsY);

    // Left grid stats boxes (3 cols x 2 rows)
    const statsData = [
      { label: 'Total Students', value: summary.totalStudents.toString() },
      { label: 'Average %', value: `${summary.averagePercentage}%` },
      { label: 'Highest %', value: `${summary.highestPercentage}%` },
      { label: 'Lowest %', value: `${summary.lowestPercentage}%` },
      { label: 'Passed Count', value: summary.passCount.toString() },
      { label: 'Failed Count', value: summary.failCount.toString() },
    ];

    const boxWidth = 36;
    const boxHeight = 13;
    const boxSpacingX = 4;
    const boxSpacingY = 4;

    statsData.forEach((stat, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 14 + col * (boxWidth + boxSpacingX);
      const y = statsY + 5 + row * (boxHeight + boxSpacingY);

      doc.setFillColor(248, 250, 252); // slate-50
      doc.roundedRect(x, y, boxWidth, boxHeight, 1.5, 1.5, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.25);
      doc.roundedRect(x, y, boxWidth, boxHeight, 1.5, 1.5, 'D');

      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.setFont('helvetica', 'normal');
      doc.text(stat.label, x + boxWidth / 2, y + 5, { align: 'center' });

      doc.setFontSize(9.5);
      doc.setTextColor(27, 59, 43); // Forest
      doc.setFont('helvetica', 'bold');
      doc.text(stat.value, x + boxWidth / 2, y + 11, { align: 'center' });
    });

    // Right grid: Vector Grade Distribution Bar Chart
    const grades = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F'];
    const gradeCounts = {};
    grades.forEach(g => { gradeCounts[g] = 0; });
    reportData.records.forEach(rec => {
      const g = rec.grade || 'F';
      gradeCounts[g] = (gradeCounts[g] || 0) + 1;
    });
    const maxCount = Math.max(...Object.values(gradeCounts), 1);

    // Draw chart outer container
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(140, statsY + 5, 143, 30, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(140, statsY + 5, 143, 30, 2, 2, 'D');

    // Chart title
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(27, 59, 43);
    doc.text('GRADE PERFORMANCE DISTRIBUTION (ATHLETE COUNT)', 144, statsY + 10);

    const barWidth = 12;
    const barSpacingX = 6;
    const barBaselineY = statsY + 30;
    const maxBarHeight = 14;

    grades.forEach((grade, idx) => {
      const count = gradeCounts[grade] || 0;
      const barHeight = (count / maxCount) * maxBarHeight;
      const barX = 146 + idx * (barWidth + barSpacingX);
      const barY = barBaselineY - barHeight;

      // Select natural colors based on grade
      if (grade === 'A+' || grade === 'A') {
        doc.setFillColor(27, 59, 43); // Forest Green
      } else if (grade === 'B+' || grade === 'B') {
        doc.setFillColor(143, 188, 143); // Sage Green
      } else if (grade === 'C') {
        doc.setFillColor(210, 180, 140); // Sand/Ochre
      } else if (grade === 'D') {
        doc.setFillColor(112, 128, 144); // Slate Gray
      } else {
        doc.setFillColor(200, 100, 70); // Terracotta/Clay
      }

      if (barHeight > 0) {
        doc.rect(barX, barY, barWidth, barHeight, 'F');
      }

      // Print count above bar
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text(count.toString(), barX + barWidth / 2, barY - 1, { align: 'center' });

      // Print grade label below baseline
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(grade, barX + barWidth / 2, barBaselineY + 3.5, { align: 'center' });
    });

    // --- Data Table ---
    const tableData = reportData.records.map((rec, i) => {
      const subjectsStr = rec.subjects
        ? rec.subjects.map(s => `${s.subjectName}: ${s.marks}/${s.maxMarks}`).join(', ')
        : '—';
      return [
        (i + 1).toString(),
        rec.studentId?.name || 'Unknown',
        rec.studentId?.studentId || '—',
        rec.examName || '—',
        subjectsStr,
        `${rec.totalMarks}/${rec.totalMaxMarks}`,
        `${rec.percentage}%`,
        rec.grade || '—'
      ];
    });

    autoTable(doc, {
      startY: statsY + 38,
      head: [['#', 'Student Name', 'ID', 'Exam', 'Subjects (Marks)', 'Total', '%', 'Grade']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [27, 59, 43],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
        halign: 'center',
        cellPadding: 3
      },
      bodyStyles: {
        fontSize: 7,
        cellPadding: 2.5,
        textColor: [30, 41, 59],
        lineColor: [226, 232, 240],
        lineWidth: 0.1
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 30 },
        4: { cellWidth: 'auto' },
        5: { halign: 'center', cellWidth: 22 },
        6: { halign: 'center', cellWidth: 18, fontStyle: 'bold' },
        7: { halign: 'center', cellWidth: 15, fontStyle: 'bold' }
      },
      margin: { left: 14, right: 14 },
      didParseCell: function (data) {
        if (data.section === 'body' && data.column.index === 7) {
          const grade = data.cell.raw;
          if (grade === 'A+' || grade === 'A') {
            data.cell.styles.textColor = [27, 59, 43]; // forest green
          } else if (grade === 'F') {
            data.cell.styles.textColor = [200, 100, 70]; // terracotta/fail
          }
        }
      }
    });

    // --- Footer ---
    const finalY = doc.lastAutoTable.finalY || statsY + 30;
    if (finalY + 15 < pageHeight) {
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.setFont('helvetica', 'italic');
      doc.text(
        `This is a computer-generated report from SportSphere. © ${new Date().getFullYear()} All rights reserved.`,
        pageWidth / 2, pageHeight - 8,
        { align: 'center' }
      );
    }

    // Save
    const fileName = `Class_${selectedClass}_Report${selectedTerm ? `_${selectedTerm}` : ''}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
  };

  const summary = reportData?.summary;

  return (
    <div className="space-y-8 animate-fade-in pb-16 font-sans">

      {/* Header Banner */}
      <div className="gov-card p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="gov-eyebrow px-3.5 py-1.5 text-xs font-black uppercase tracking-widest flex items-center gap-1.5 w-max mb-3">
              <FileBarChart size={12} /> Reports
            </span>
            <h1 className="gov-page-heading text-3xl md:text-4xl font-black">Class-wise Reports</h1>
            <p className="text-slate-600 text-sm mt-1.5 font-medium">
              View structured performance summaries and export professional PDF reports.
            </p>
          </div>
          {reportData && reportData.records && reportData.records.length > 0 && (
            <button
              onClick={exportPDF}
              className="group bg-gradient-to-r from-[#1B3B2B] to-[#2d5a44] hover:from-[#152e22] hover:to-[#1B3B2B] text-[#fbf7ee] border border-[#152e22]/50 px-6 py-3 rounded-xl font-black text-sm transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#1b3b2b]/30 hover:shadow-xl active:scale-95 hover:-translate-y-0.5 relative overflow-hidden self-start"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out pointer-events-none rounded-xl"></div>
              <Download size={18} className="group-hover:-translate-y-0.5 transition-transform duration-300" /> Export Professional PDF
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all cursor-pointer min-w-[160px]"
          >
            <option value="">Select Class</option>
            {STANDARDS.map(s => <option key={s} value={s}>Class {s}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all cursor-pointer min-w-[160px]"
          >
            <option value="">All Terms</option>
            {TERMS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Summary Stats Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <Users size={18} className="text-blue-500 mx-auto mb-1" />
            <p className="text-xl font-black text-slate-800">{summary.totalStudents}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Total Students</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <TrendingUp size={18} className="text-emerald-500 mx-auto mb-1" />
            <p className="text-xl font-black text-slate-800">{summary.averagePercentage}%</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Average</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <Award size={18} className="text-amber-500 mx-auto mb-1" />
            <p className="text-xl font-black text-slate-800">{summary.highestPercentage}%</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Highest</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <TrendingDown size={18} className="text-red-500 mx-auto mb-1" />
            <p className="text-xl font-black text-slate-800">{summary.lowestPercentage}%</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Lowest</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 mx-auto mb-1 flex items-center justify-center text-[10px] font-black">✓</div>
            <p className="text-xl font-black text-green-600">{summary.passCount}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Passed</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 mx-auto mb-1 flex items-center justify-center text-[10px] font-black">✗</div>
            <p className="text-xl font-black text-red-600">{summary.failCount}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Failed</p>
          </div>
        </div>
      )}

      {/* Recharts Analytics Section */}
      {reportData && reportData.records && reportData.records.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center">
            <h3 className="text-sm font-black text-[#1B3B2B] w-full text-center mb-6 uppercase tracking-wider">Pass / Fail Ratio</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Passed', value: summary.passCount },
                      { name: 'Failed', value: summary.failCount }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#1B3B2B" />
                    <Cell fill="#C86446" />
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }} 
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center">
            <h3 className="text-sm font-black text-[#1B3B2B] w-full text-center mb-6 uppercase tracking-wider">Grade Distribution</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={(() => {
                    const gradeCounts = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
                    reportData.records.forEach(r => { gradeCounts[r.grade || 'F']++; });
                    return Object.entries(gradeCounts).map(([name, count]) => ({ name, count }));
                  })()}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {(() => {
                      const gradeCounts = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
                      reportData.records.forEach(r => { gradeCounts[r.grade || 'F']++; });
                      return Object.keys(gradeCounts).map((grade, index) => {
                        let color = '#1B3B2B'; // Forest
                        if (grade === 'B+' || grade === 'B') color = '#8FBC8F'; // Sage
                        if (grade === 'C') color = '#D2B48C'; // Sand
                        if (grade === 'D') color = '#708090'; // Stone
                        if (grade === 'F') color = '#C86446'; // Terracotta
                        return <Cell key={`cell-${index}`} fill={color} />;
                      });
                    })()}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 text-amber-600 animate-spin" />
          </div>
        ) : !selectedClass ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center space-y-2">
            <FileBarChart className="w-10 h-10 text-slate-200" />
            <p className="text-sm font-bold text-slate-500">Select a class to view reports</p>
            <p className="text-xs text-slate-400">Choose a class and optionally a term to generate the report.</p>
          </div>
        ) : !reportData || !reportData.records || reportData.records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center space-y-2">
            <FileBarChart className="w-10 h-10 text-slate-200" />
            <p className="text-sm font-bold text-slate-500">No performance data found</p>
            <p className="text-xs text-slate-400">No test records for Class {selectedClass}{selectedTerm ? ` (${selectedTerm})` : ''}.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-wider border-b border-slate-100">
                  <th className="py-3 px-5 font-bold">#</th>
                  <th className="py-3 px-5 font-bold">Student</th>
                  <th className="py-3 px-5 font-bold">Exam</th>
                  <th className="py-3 px-5 font-bold">Term</th>
                  <th className="py-3 px-5 font-bold">Subjects</th>
                  <th className="py-3 px-5 font-bold">Total</th>
                  <th className="py-3 px-5 font-bold">%</th>
                  <th className="py-3 px-5 font-bold">Grade</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100 font-semibold text-slate-700">
                {reportData.records.map((rec, index) => (
                  <tr key={rec._id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3 px-5 text-slate-400">{index + 1}</td>
                    <td className="py-3 px-5">
                      <p className="font-black text-slate-800">{rec.studentId?.name || 'Unknown'}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{rec.studentId?.studentId}</p>
                    </td>
                    <td className="py-3 px-5">{rec.examName}</td>
                    <td className="py-3 px-5">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-black">{rec.term}</span>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex flex-wrap gap-1">
                        {rec.subjects?.map((sub, si) => (
                          <span key={si} className="px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-semibold">
                            {sub.subjectName}: <strong>{sub.marks}</strong>/{sub.maxMarks}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-5 font-bold">{rec.totalMarks}/{rec.totalMaxMarks}</td>
                    <td className="py-3 px-5 font-black text-base">{rec.percentage}%</td>
                    <td className="py-3 px-5">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${rec.grade === 'A+' || rec.grade === 'A' ? 'bg-green-50 text-green-700' :
                          rec.grade === 'B+' || rec.grade === 'B' ? 'bg-blue-50 text-blue-700' :
                            rec.grade === 'C' ? 'bg-amber-50 text-amber-700' :
                              rec.grade === 'D' ? 'bg-orange-50 text-orange-700' :
                                'bg-red-50 text-red-700'
                        }`}>
                        {rec.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstituteReports;
