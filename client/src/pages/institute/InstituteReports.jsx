import React, { useState, useEffect } from 'react';
import { FileBarChart, ChevronDown, Download, Loader2, TrendingUp, TrendingDown, Users, Award } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 38, 'F');

    // Accent line
    doc.setFillColor(37, 99, 235); // blue-600
    doc.rect(0, 38, pageWidth, 2, 'F');

    // Institute Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(user.instituteName || 'SportSphere Institute', 14, 16);

    // Report Title
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Class ${selectedClass} Performance Report${selectedTerm ? ` — ${selectedTerm}` : ''}`, 14, 25);

    // Date on right
    doc.setFontSize(8);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth - 14, 16, { align: 'right' });
    doc.text('SportSphere Platform', pageWidth - 14, 22, { align: 'right' });

    // --- Summary Stats ---
    const summary = reportData.summary;
    const statsY = 48;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Performance Summary', 14, statsY);

    // Stats boxes
    const statsData = [
      { label: 'Total Students', value: summary.totalStudents.toString() },
      { label: 'Average %', value: `${summary.averagePercentage}%` },
      { label: 'Highest %', value: `${summary.highestPercentage}%` },
      { label: 'Lowest %', value: `${summary.lowestPercentage}%` },
      { label: 'Pass', value: summary.passCount.toString() },
      { label: 'Fail', value: summary.failCount.toString() },
    ];

    const boxWidth = (pageWidth - 28 - 5 * 6) / 6;
    statsData.forEach((stat, i) => {
      const x = 14 + i * (boxWidth + 6);
      const y = statsY + 4;

      doc.setFillColor(248, 250, 252); // slate-50
      doc.roundedRect(x, y, boxWidth, 18, 2, 2, 'F');

      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.setFont('helvetica', 'normal');
      doc.text(stat.label, x + boxWidth / 2, y + 7, { align: 'center' });

      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(stat.value, x + boxWidth / 2, y + 14, { align: 'center' });
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

    doc.autoTable({
      startY: statsY + 28,
      head: [['#', 'Student Name', 'ID', 'Exam', 'Subjects (Marks)', 'Total', '%', 'Grade']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7,
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
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 7) {
          const grade = data.cell.raw;
          if (grade === 'A+' || grade === 'A') {
            data.cell.styles.textColor = [22, 163, 74]; // green
          } else if (grade === 'F') {
            data.cell.styles.textColor = [239, 68, 68]; // red
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
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,158,11,0.15),transparent)] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="px-3.5 py-1.5 bg-amber-500/10 text-amber-400 text-xs font-black rounded-lg border border-amber-400/20 uppercase tracking-widest flex items-center gap-1.5 w-max mb-3">
              <FileBarChart size={12} /> Reports
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Class-wise Reports</h1>
            <p className="text-slate-400 text-sm mt-1.5 font-medium">
              View structured performance summaries and export professional PDF reports.
            </p>
          </div>
          {reportData && reportData.records && reportData.records.length > 0 && (
            <button
              onClick={exportPDF}
              className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 self-start"
            >
              <Download size={16} /> Export PDF
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
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                        rec.grade === 'A+' || rec.grade === 'A' ? 'bg-green-50 text-green-700' :
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
