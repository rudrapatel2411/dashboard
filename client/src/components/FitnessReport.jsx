/**
 * FitnessReport.jsx
 *
 * Phase 3 + 4 + 5: PDF Layout Blueprint, Styling, Edge Cases & Async State
 *
 * Generates a pixel-faithful Fitness Assessment Report PDF using jsPDF + autoTable.
 * Layout mirrors the reference image:
 *   Block 1 — Header: Student demographics + L1-L7 bar
 *   Block 2 — My Fitness Indicator: Weight / Height / BMI table (Current + Previous)
 *   Block 3 — My Fitness Score: 5-test table with Current/Previous scores + Feedback
 *   Block 4 — Benchmark table by age group
 *   Block 5 — My BMI bar + BMI Benchmark table (side by side)
 *   Block 6 — Recommendations (Dietary + Lifestyle)
 *
 * Constraints:
 *  - BLACKLISTED TERM: "Khelo India" is NEVER used anywhere in this file.
 *  - Uses "National Fitness Standard" / "Standard Assessment" terminology only.
 *  - Scales to A4 (210 × 297 mm), no overflow.
 *  - All async work is wrapped in try/catch/finally; isExporting resets on error.
 */

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import formatReportPayload, { formatGroup1ReportPayload } from '../utils/formatReportPayload';

// ─── Colour Palette (matches reference image) ──────────────────────────────────
const C = {
  black:       [0,   0,   0],
  white:       [255, 255, 255],
  lightGray:   [240, 240, 240],
  midGray:     [200, 200, 200],
  darkGray:    [80,  80,  80],
  headerBg:    [220, 230, 242],   // light blue header band
  sectionBg:   [197, 217, 241],   // medium blue section header
  tableBg:     [234, 240, 248],   // pale blue alternate rows
  greenDark:   [0,   112, 0],
  greenMid:    [0,   176, 80],
  yellow:      [255, 192, 0],
  orange:      [255, 102, 0],
  red:         [255, 0,   0],
  borderBlue:  [31,  73,  125],   // dark-blue cell borders
  bmiRed:      [255, 0,   0],     // BMI bar fill colour
  textBlue:    [0,   70,  127],
  textDark:    [30,  30,  30],
};

// L1–L7 colours matching the reference image
const LEVEL_COLORS = {
  L1: [255, 0,   0  ],
  L2: [255, 102, 0  ],
  L3: [255, 192, 0  ],
  L4: [0,   176, 80 ],
  L5: [0,   176, 80 ],
  L6: [0,   112, 0  ],
  L7: [0,   112, 0  ],
};

// ─── jsPDF drawing helpers ─────────────────────────────────────────────────────

/** Draws a filled rectangle */
const fillRect = (doc, x, y, w, h, rgb) => {
  doc.setFillColor(...rgb);
  doc.rect(x, y, w, h, 'F');
};

/** Draws a stroked rectangle */
const strokeRect = (doc, x, y, w, h, rgb, lw = 0.2) => {
  doc.setDrawColor(...rgb);
  doc.setLineWidth(lw);
  doc.rect(x, y, w, h, 'S');
};

/** Draws a filled + stroked rectangle */
const filledRect = (doc, x, y, w, h, fillRgb, strokeRgb, lw = 0.2) => {
  doc.setFillColor(...fillRgb);
  doc.setDrawColor(...strokeRgb);
  doc.setLineWidth(lw);
  doc.rect(x, y, w, h, 'FD');
};

/** Renders text clipped to a cell width (truncates with ellipsis) */
const clipText = (doc, text, maxWidth) => {
  const str = String(text ?? '');
  if (doc.getTextWidth(str) <= maxWidth) return str;
  let truncated = str;
  while (doc.getTextWidth(truncated + '…') > maxWidth && truncated.length > 0) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + '…';
};

/** Centered text in a cell */
const cellText = (doc, text, cellX, cellY, cellW, cellH, fontSize, rgb, bold = false) => {
  doc.setFontSize(fontSize);
  doc.setTextColor(...rgb);
  doc.setFont('helvetica', bold ? 'bold' : 'normal');
  const str   = String(text ?? '');
  const tw    = doc.getTextWidth(str);
  const textX = cellX + (cellW - tw) / 2;
  const textY = cellY + cellH / 2 + fontSize * 0.35 * 0.352; // approx vertical center
  doc.text(str, textX, textY);
};

/** Left-aligned text in a cell with left padding */
const leftText = (doc, text, cellX, cellY, cellH, fontSize, rgb, bold = false, padLeft = 1.5) => {
  doc.setFontSize(fontSize);
  doc.setTextColor(...rgb);
  doc.setFont('helvetica', bold ? 'bold' : 'normal');
  const textY = cellY + cellH / 2 + fontSize * 0.35 * 0.352;
  doc.text(String(text ?? ''), cellX + padLeft, textY);
};

// ─── Section Header Drawer ─────────────────────────────────────────────────────

const drawSectionHeader = (doc, x, y, w, h, text) => {
  filledRect(doc, x, y, w, h, C.sectionBg, C.borderBlue, 0.3);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.black);
  doc.text(text, x + 2, y + h / 2 + 1.5);
};

// ─── Main PDF Generator Function ───────────────────────────────────────────────

/**
 * Generates the Fitness Assessment Report PDF and triggers browser download.
 *
 * @param {Object} payload  - Output of formatReportPayload()
 * @param {string} filename - Output filename (without .pdf)
 */
export const generateFitnessReportPDF = async (payload, filename = 'Fitness_Report') => {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const PAGE_W  = 210;
  const PAGE_H  = 297;
  const MARGIN  = 8;
  const CONTENT_W = PAGE_W - MARGIN * 2;

  let y = MARGIN; // running Y cursor

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOCK 1 — REPORT TITLE HEADER
  // ═══════════════════════════════════════════════════════════════════════════

  // Title bar
  filledRect(doc, MARGIN, y, CONTENT_W, 8, C.white, C.borderBlue, 0.4);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.black);
  const titleText = 'Fitness Assessment Report';
  doc.text(titleText, PAGE_W / 2 - doc.getTextWidth(titleText) / 2, y + 5.5);
  y += 8;

  // ─── Student Info Box (left) + L1-L7 Indicator Bar (right) ─────────────────

  const INFO_W    = 90;
  const LEVEL_W   = CONTENT_W - INFO_W - 2;  // right panel
  const INFO_ROW_H = 7;
  const infoStartY = y;

  const { studentInfo, currentMetrics, prevMetrics } = payload;

  const infoRows = [
    { label: 'Name',            value: studentInfo.name  },
    { label: 'Class',           value: studentInfo.class },
    { label: 'Registration No', value: studentInfo.regNo },
    { label: 'Roll No',         value: studentInfo.rollNo },
    { label: 'Gender / DOB',    value: studentInfo.gender },
    { label: 'School',          value: studentInfo.school },
  ];

  infoRows.forEach((row, i) => {
    const rowY = y + i * INFO_ROW_H;
    filledRect(doc, MARGIN, rowY, INFO_W, INFO_ROW_H, C.white, C.midGray, 0.15);

    // Label column (30 mm)
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.darkGray);
    doc.text(row.label, MARGIN + 1.5, rowY + INFO_ROW_H / 2 + 1.4);

    // Value column (blue text)
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.textBlue);
    doc.text(
      clipText(doc, row.value, INFO_W - 35),
      MARGIN + 35, rowY + INFO_ROW_H / 2 + 1.4
    );
  });

  // ─── L1–L7 Indicator block (right side, spans same height as student info) ──

  const levX = MARGIN + INFO_W + 2;
  const levY = infoStartY;
  const levH = infoRows.length * INFO_ROW_H;

  filledRect(doc, levX, levY, LEVEL_W, levH, C.white, C.borderBlue, 0.3);

  // Title row
  const levTitleH = 7;
  filledRect(doc, levX, levY, LEVEL_W, levTitleH, C.sectionBg, C.borderBlue, 0.3);
  cellText(doc, 'My Fitness Indicator', levX, levY, LEVEL_W, levTitleH, 8, C.black, true);

  // Column headers: Period | Weight | Height | BMI
  const levRowH   = 6.5;
  const cols4     = [LEVEL_W * 0.28, LEVEL_W * 0.24, LEVEL_W * 0.24, LEVEL_W * 0.24];
  const col4X     = [levX, levX + cols4[0], levX + cols4[0] + cols4[1], levX + cols4[0] + cols4[1] + cols4[2]];
  const headerRow2Y = levY + levTitleH;

  filledRect(doc, levX, headerRow2Y, LEVEL_W, levRowH, C.lightGray, C.borderBlue, 0.2);
  ['Period', 'Weight', 'Height', 'BMI'].forEach((h, i) => {
    cellText(doc, h, col4X[i], headerRow2Y, cols4[i], levRowH, 7, C.black, true);
  });

  // Current row
  const currRowY = headerRow2Y + levRowH;
  filledRect(doc, levX, currRowY, LEVEL_W, levRowH, C.white, C.midGray, 0.15);
  const currVals = ['Current', currentMetrics.weight, currentMetrics.height, currentMetrics.bmi];
  currVals.forEach((v, i) => {
    cellText(doc, v, col4X[i], currRowY, cols4[i], levRowH, i === 0 ? 6.5 : 7, i === 0 ? C.darkGray : C.textBlue, i === 0);
  });
  // Date under "Current"
  doc.setFontSize(6);
  doc.setTextColor(...C.darkGray);
  doc.text(currentMetrics.date, col4X[0] + 1, currRowY + levRowH - 1);

  // Previous row
  const prevRowY = currRowY + levRowH;
  filledRect(doc, levX, prevRowY, LEVEL_W, levRowH, C.tableBg, C.midGray, 0.15);
  const prevVals = ['Previous',
    prevMetrics?.weight || '—',
    prevMetrics?.height || '—',
    prevMetrics?.bmi    || '—'
  ];
  prevVals.forEach((v, i) => {
    cellText(doc, v, col4X[i], prevRowY, cols4[i], levRowH, i === 0 ? 6.5 : 7, i === 0 ? C.darkGray : C.textBlue, i === 0);
  });
  if (prevMetrics?.date) {
    doc.setFontSize(6);
    doc.setTextColor(...C.darkGray);
    doc.text(prevMetrics.date, col4X[0] + 1, prevRowY + levRowH - 1);
  }

  y += infoRows.length * INFO_ROW_H + 3;

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOCK 2 — MY FITNESS SCORE TABLE (5 tests × Current + Previous)
  // ═══════════════════════════════════════════════════════════════════════════

  drawSectionHeader(doc, MARGIN, y, CONTENT_W, 7, 'My Fitness Score');
  y += 7;

  // Column widths: TestName | L1-L7 | My Score | Indicator | Feedback
  const SCORE_COLS = {
    test:      48,
    l1:        9,  l2: 9, l3: 9, l4: 9, l5: 9, l6: 9, l7: 9,
    score:     20,
    indicator: 18,
    feedback:  CONTENT_W - 48 - 9*7 - 20 - 18
  };

  // ── Level indicator header row ────────────────────────────────────────────
  const scoreHeaderH = 6;
  let cx = MARGIN;

  // Test name cell (spans 2 rows conceptually — draw it tall)
  filledRect(doc, cx, y, SCORE_COLS.test, scoreHeaderH, C.sectionBg, C.borderBlue, 0.2);
  cellText(doc, 'My Fitness Score', cx, y, SCORE_COLS.test, scoreHeaderH, 6.5, C.black, true);
  cx += SCORE_COLS.test;

  // L1–L7 cells
  ['L1','L2','L3','L4','L5','L6','L7'].forEach((lvl) => {
    filledRect(doc, cx, y, 9, scoreHeaderH, C.sectionBg, C.borderBlue, 0.2);
    cellText(doc, lvl, cx, y, 9, scoreHeaderH, 6.5, C.black, true);
    cx += 9;
  });

  // My Score, Indicator, Feedback
  ['My Score', 'Indicator', 'Feedback'].forEach((h, i) => {
    const w = [SCORE_COLS.score, SCORE_COLS.indicator, SCORE_COLS.feedback][i];
    filledRect(doc, cx, y, w, scoreHeaderH, C.sectionBg, C.borderBlue, 0.2);
    cellText(doc, h, cx, y, w, scoreHeaderH, 6.5, C.black, true);
    cx += w;
  });
  y += scoreHeaderH;

  // ── 5 Test rows ──────────────────────────────────────────────────────────
  const { fitnessScores } = payload;
  const TEST_ROW_H = 14; // tall enough for name + Current + Previous without overlap

  fitnessScores.forEach((test, tIdx) => {
    const rowBg    = tIdx % 2 === 0 ? C.white : C.tableBg;
    const testRowY = y;

    // ── Test name cell (wraps long names across 2 lines)
    filledRect(doc, MARGIN, testRowY, SCORE_COLS.test, TEST_ROW_H, rowBg, C.borderBlue, 0.2);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.black);
    const nameLines = doc.splitTextToSize(test.testName, SCORE_COLS.test - 3);
    doc.text(nameLines.slice(0, 2), MARGIN + 1.5, testRowY + 4.5);

    // "Current" / "Previous" sub-labels — well below the name
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(...C.darkGray);
    doc.text('Current',  MARGIN + 3, testRowY + 9);
    doc.text('Previous', MARGIN + 3, testRowY + 12.5);

    // ── L1–L7 dot cells
    cx = MARGIN + SCORE_COLS.test;
    ['L1','L2','L3','L4','L5','L6','L7'].forEach((lvl) => {
      filledRect(doc, cx, testRowY, 9, TEST_ROW_H, rowBg, C.borderBlue, 0.2);
      if (test.level === lvl) {
        doc.setFillColor(...LEVEL_COLORS[lvl]);
        doc.circle(cx + 4.5, testRowY + TEST_ROW_H / 2, 2.5, 'F');
        doc.setFillColor(...C.white);
        doc.circle(cx + 4.5, testRowY + TEST_ROW_H / 2, 1, 'F');
      }
      cx += 9;
    });

    // ── My Score cell
    filledRect(doc, cx, testRowY, SCORE_COLS.score, TEST_ROW_H, rowBg, C.borderBlue, 0.2);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.textBlue);
    doc.text(test.currentScore !== 'N/A' ? test.currentScore : 'N/A', cx + 1.5, testRowY + 5.5);
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.darkGray);
    doc.text(test.previousScore !== 'N/A' ? test.previousScore : '—', cx + 1.5, testRowY + 11.5);
    cx += SCORE_COLS.score;

    // ── Indicator cell
    filledRect(doc, cx, testRowY, SCORE_COLS.indicator, TEST_ROW_H, rowBg, C.borderBlue, 0.2);
    const indColor = test.level !== 'N/A' ? LEVEL_COLORS[test.level] : C.darkGray;
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...indColor);
    const indStr = clipText(doc, test.indicator, SCORE_COLS.indicator - 2);
    doc.text(indStr, cx + (SCORE_COLS.indicator - doc.getTextWidth(indStr)) / 2, testRowY + TEST_ROW_H / 2 + 1.2);
    cx += SCORE_COLS.indicator;

    // ── Feedback cell
    const feedW = SCORE_COLS.feedback;
    filledRect(doc, cx, testRowY, feedW, TEST_ROW_H, rowBg, C.borderBlue, 0.2);
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.textDark);
    const feedLines = doc.splitTextToSize(test.feedback, feedW - 2);
    doc.text(feedLines.slice(0, 3), cx + 1, testRowY + 4.5); // up to 3 lines now

    y += TEST_ROW_H;
  });

  y += 4;

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOCK 3 — BENCHMARK TABLE  (L1–L7 reference grid per test)
  // ═══════════════════════════════════════════════════════════════════════════

  const ageLabel = `${studentInfo.age} year ${studentInfo.gender?.split(' / ')[0] || 'Student'}`;
  drawSectionHeader(doc, MARGIN, y, CONTENT_W, 7, `Benchmark: ${ageLabel}`);
  y += 7;

  const { benchmarkTable } = payload;

  // Benchmark column layout: TestName | L1 | L2 | L3 | L4 | L5 | L6 | L7
  const bmTestW = 38;
  const bmLvlW  = (CONTENT_W - bmTestW) / 7;

  // Level header row
  cx = MARGIN;
  filledRect(doc, cx, y, bmTestW, 6, C.sectionBg, C.borderBlue, 0.2);
  cx += bmTestW;
  ['L1','L2','L3','L4','L5','L6','L7'].forEach((lvl) => {
    filledRect(doc, cx, y, bmLvlW, 6, C.sectionBg, C.borderBlue, 0.2);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...LEVEL_COLORS[lvl]);
    const tw = doc.getTextWidth(lvl);
    doc.text(lvl, cx + (bmLvlW - tw) / 2, y + 4.2);
    cx += bmLvlW;
  });
  y += 6;

  // Level label sub-row
  cx = MARGIN;
  filledRect(doc, cx, y, bmTestW, 5, C.white, C.borderBlue, 0.2);
  cx += bmTestW;
  const LEVEL_LABELS_TEXT = ['Work Harder','Must Improve','Can do Better','Good','Very Good','Athletic','Sports Fit'];
  LEVEL_LABELS_TEXT.forEach((lbl, i) => {
    const colRgb = LEVEL_COLORS[`L${i+1}`];
    filledRect(doc, cx, y, bmLvlW, 5, C.white, C.borderBlue, 0.2);
    doc.setFontSize(4.8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colRgb);
    const tw = doc.getTextWidth(lbl);
    doc.text(lbl, cx + (bmLvlW - tw) / 2, y + 3.5);
    cx += bmLvlW;
  });
  y += 5;

  // Data rows for each test
  benchmarkTable.forEach((bm, bIdx) => {
    const bmRowY  = y;
    const bmRowH  = 6;
    const bmRowBg = bIdx % 2 === 0 ? C.white : C.tableBg;

    // Test name
    filledRect(doc, MARGIN, bmRowY, bmTestW, bmRowH, bmRowBg, C.borderBlue, 0.2);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.black);
    doc.text(bm.testName, MARGIN + 1.5, bmRowY + bmRowH / 2 + 1.2);

    cx = MARGIN + bmTestW;
    bm.thresholds.forEach((thresh, ti) => {
      filledRect(doc, cx, bmRowY, bmLvlW, bmRowH, bmRowBg, C.borderBlue, 0.2);
      const op      = bm.lowerIsBetter ? '>' : '>';
      const prefix  = bm.lowerIsBetter ? '<' : '>';
      const display = `${prefix}${thresh} ${bm.unit}`;
      doc.setFontSize(5.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...C.textDark);
      const tw = doc.getTextWidth(display);
      doc.text(display, cx + (bmLvlW - tw) / 2, bmRowY + bmRowH / 2 + 1.2);
      cx += bmLvlW;
    });
    // L7 (beyond last threshold)
    filledRect(doc, cx, bmRowY, bmLvlW, bmRowH, bmRowBg, C.borderBlue, 0.2);
    const lastThresh = bm.thresholds[bm.thresholds.length - 1];
    const l7display  = bm.lowerIsBetter ? `<${lastThresh} ${bm.unit}` : `>${lastThresh} ${bm.unit}`;
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.textDark);
    const tw7 = doc.getTextWidth(l7display);
    doc.text(l7display, cx + (bmLvlW - tw7) / 2, bmRowY + bmRowH / 2 + 1.2);

    y += bmRowH;
  });

  y += 4;

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOCK 4 — MY BMI  (left: bar chart)  +  BMI BENCHMARK  (right: table)
  // ═══════════════════════════════════════════════════════════════════════════

  const BMI_LEFT_W  = CONTENT_W * 0.47;
  const BMI_RIGHT_W = CONTENT_W - BMI_LEFT_W - 2;
  const BMI_RIGHT_X = MARGIN + BMI_LEFT_W + 2;
  const bmiBlockY   = y;

  // ── Left: My BMI ─────────────────────────────────────────────────────────
  drawSectionHeader(doc, MARGIN, y, BMI_LEFT_W, 6.5, 'My BMI');
  y += 6.5;

  // sub-header row
  const bmiSubH = 5.5;
  filledRect(doc, MARGIN, y, BMI_LEFT_W, bmiSubH, C.lightGray, C.borderBlue, 0.2);
  const bmiCols  = ['Body Mass Index', 'UW', 'N', 'OW', 'OB', 'Weight', 'Height', 'My BMI'];
  const bmiColW  = [BMI_LEFT_W * 0.28, BMI_LEFT_W * 0.07, BMI_LEFT_W * 0.07, BMI_LEFT_W * 0.07, BMI_LEFT_W * 0.07, BMI_LEFT_W * 0.15, BMI_LEFT_W * 0.12, BMI_LEFT_W * 0.17];
  let bmiCX = MARGIN;
  bmiCols.forEach((h, i) => {
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.black);
    const tw = doc.getTextWidth(h);
    doc.text(h, bmiCX + (bmiColW[i] - tw) / 2, y + 3.8);
    bmiCX += bmiColW[i];
  });
  y += bmiSubH;

  // Current BMI row with bar
  const bmiRowH = 8;
  filledRect(doc, MARGIN, y, BMI_LEFT_W, bmiRowH, C.white, C.borderBlue, 0.2);

  bmiCX = MARGIN;
  // "Current" label
  leftText(doc, 'Current', bmiCX, y, bmiRowH, 6, C.darkGray, true);
  bmiCX += bmiColW[0];

  // BMI bar spanning UW+N+OW+OB columns
  const barCols   = 4; // UW N OW OB
  const barStartX = bmiCX;
  const barTotalW = bmiColW[1] + bmiColW[2] + bmiColW[3] + bmiColW[4];
  const barH      = 4;
  const barY      = y + (bmiRowH - barH) / 2;

  // Background of bar
  fillRect(doc, barStartX, barY, barTotalW, barH, C.lightGray);
  // Fill up to current BMI value
  const { bmiBar } = payload;
  const fillW = (bmiBar.percent / 100) * barTotalW;
  fillRect(doc, barStartX, barY, fillW, barH, C.bmiRed);
  strokeRect(doc, barStartX, barY, barTotalW, barH, C.borderBlue, 0.2);
  bmiCX += barTotalW;

  // Weight / Height / My BMI values
  [currentMetrics.weight, currentMetrics.height, bmiBar.value.toString()].forEach((v, i) => {
    const wCellW = bmiColW[5 + i];
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.textBlue);
    const tw = doc.getTextWidth(v);
    doc.text(v, bmiCX + (wCellW - tw) / 2, y + bmiRowH / 2 + 1.2);
    bmiCX += wCellW;
  });
  y += bmiRowH;

  // Previous BMI row
  const prevBmiRowH = 6.5;
  filledRect(doc, MARGIN, y, BMI_LEFT_W, prevBmiRowH, C.tableBg, C.borderBlue, 0.2);
  bmiCX = MARGIN;
  leftText(doc, 'Previous', bmiCX, y, prevBmiRowH, 6, C.darkGray, true);
  bmiCX += bmiColW[0];

  if (payload.prevBmiBar) {
    // Previous bar (dimmed)
    const prevFillW = (payload.prevBmiBar.percent / 100) * barTotalW;
    const pBarY     = y + (prevBmiRowH - 3) / 2;
    fillRect(doc, barStartX, pBarY, barTotalW, 3, C.lightGray);
    fillRect(doc, barStartX, pBarY, prevFillW, 3, [180, 100, 100]);
    strokeRect(doc, barStartX, pBarY, barTotalW, 3, C.midGray, 0.15);
    bmiCX += barTotalW;

    const prevW = prevMetrics?.weight || '—';
    const prevH = prevMetrics?.height || '—';
    const prevB = payload.prevBmiBar.value.toString();
    [prevW, prevH, prevB].forEach((v, i) => {
      const wCellW = bmiColW[5 + i];
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...C.darkGray);
      const tw = doc.getTextWidth(v);
      doc.text(v, bmiCX + (wCellW - tw) / 2, y + prevBmiRowH / 2 + 1.2);
      bmiCX += wCellW;
    });
  }
  y += prevBmiRowH;

  // ── Right: BMI Benchmark Table ────────────────────────────────────────────
  const bmiRightY = bmiBlockY;
  drawSectionHeader(doc, BMI_RIGHT_X, bmiRightY, BMI_RIGHT_W, 6.5, `BMI Benchmark: ${ageLabel}`);

  const bmiBenchH    = 5.5;
  const bmiBenchHdY  = bmiRightY + 6.5;
  const bmiBenchCols = ['UnderWeight', 'Normal', 'Over Weight', 'Obese'];
  const bmiBenchW    = BMI_RIGHT_W / 4;
  let   bmiRCX       = BMI_RIGHT_X;

  // Sub-header
  filledRect(doc, BMI_RIGHT_X, bmiBenchHdY, BMI_RIGHT_W, bmiBenchH, C.lightGray, C.borderBlue, 0.2);
  bmiBenchCols.forEach((h) => {
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.black);
    const tw = doc.getTextWidth(h);
    doc.text(h, bmiRCX + (bmiBenchW - tw) / 2, bmiBenchHdY + 3.8);
    bmiRCX += bmiBenchW;
  });

  // Threshold data row
  const bmiBenchDataH = 6;
  const bmiBenchDataY = bmiBenchHdY + bmiBenchH;
  filledRect(doc, BMI_RIGHT_X, bmiBenchDataY, BMI_RIGHT_W, bmiBenchDataH, C.white, C.borderBlue, 0.2);
  const bmiBenchVals = ['<= 14.60', '< 17.20', '< 20.20', '< 23.20'];
  bmiRCX = BMI_RIGHT_X;
  bmiBenchVals.forEach((v) => {
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.textBlue);
    const tw = doc.getTextWidth(v);
    doc.text(v, bmiRCX + (bmiBenchW - tw) / 2, bmiBenchDataY + 4);
    bmiRCX += bmiBenchW;
  });

  y += 4;

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOCK 5 — RECOMMENDATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const { recommendations } = payload;
  const REC_ROW_H = 5.5;

  // Weight target headline
  filledRect(doc, MARGIN, y, CONTENT_W, REC_ROW_H + 1, C.headerBg, C.borderBlue, 0.3);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.textDark);
  const wtLines = doc.splitTextToSize(recommendations.weightTarget, CONTENT_W - 4);
  doc.text(wtLines[0], MARGIN + 1.5, y + 4);
  y += REC_ROW_H + 1;

  // Dietary section
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.black);
  doc.text('Dietary', MARGIN + 1.5, y + 4);
  y += 5.5;

  recommendations.dietary.forEach((item, idx) => {
    const alpha = String.fromCharCode(97 + idx); // a, b, c
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.textDark);
    const lines = doc.splitTextToSize(`${alpha}. ${item}`, CONTENT_W - 6);
    doc.text(lines, MARGIN + 3, y);
    y += lines.length * 4 + 0.5;
  });

  y += 1;

  // Active Lifestyle section
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.black);
  doc.text('Active Lifestyle to be pursued', MARGIN + 1.5, y + 3.5);
  y += 5.5;

  recommendations.lifestyle.forEach((item, idx) => {
    const alpha = String.fromCharCode(97 + idx);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.textDark);
    const lines = doc.splitTextToSize(`${alpha}. ${item}`, CONTENT_W - 6);
    doc.text(lines, MARGIN + 3, y);
    y += lines.length * 4 + 0.5;
  });

  y += 3;

  // ═══════════════════════════════════════════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════════════════════════════════════════

  // Safety: clamp y to avoid overflow onto new page
  const footerY = Math.min(y, PAGE_H - 12);
  filledRect(doc, MARGIN, footerY, CONTENT_W, 8, C.headerBg, C.borderBlue, 0.3);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...C.textDark);
  const footerText = `Instructions to Parents: Download the SportSphere Mobile App from "Google Play Store / Apple App Store". Create your account and add ${studentInfo.name}'s profile. Add ${studentInfo.regNo} as "Standard Assessment Registration No." to his/her profile to view his/her detailed fitness dashboard.`;
  const footerLines = doc.splitTextToSize(footerText, CONTENT_W - 4);
  doc.text(footerLines.slice(0, 2), MARGIN + 2, footerY + 3.5);

  // Generated date (bottom right)
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.darkGray);
  doc.text(`Generated: ${payload.generatedAt}`, PAGE_W - MARGIN - 28, PAGE_H - 4);

  // ── Save ──────────────────────────────────────────────────────────────────
  doc.save(`${filename}.pdf`);
};

// ═══════════════════════════════════════════════════════════════════════════════
// REACT COMPONENT — Export Button with Async State + Cool Loader (Phase 5)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * FitnessReportExportButton
 *
 * A self-contained export button that:
 *  1. Manages isExporting boolean state (Phase 5)
 *  2. Shows a sleek animated spinner while PDF is generating
 *  3. Disables itself during generation (prevents duplicate clicks)
};

// ═══════════════════════════════════════════════════════════════════════════════
// GROUP 1 PDF GENERATOR — Age 5–8 years
// Tests: Plate Tapping (Coordination) + Flamingo Balance (Balance)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generates the Group 1 (5–8 yrs) Fitness Assessment Report PDF.
 *
 * @param {Object} payload  - Output of formatGroup1ReportPayload()
 * @param {string} filename - Output filename (without .pdf)
 */
export const generateGroup1FitnessReportPDF = async (payload, filename = 'Fitness_Report_Group1') => {
  const { default: jsPDF } = await import('jspdf');
  await import('jspdf-autotable');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const PAGE_W    = 210;
  const PAGE_H    = 297;
  const MARGIN    = 8;
  const CONTENT_W = PAGE_W - MARGIN * 2;

  let y = MARGIN;

  // ── TITLE HEADER ────────────────────────────────────────────────────────────
  filledRect(doc, MARGIN, y, CONTENT_W, 8, C.white, C.borderBlue, 0.4);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.black);
  const titleText = 'Fitness Assessment Report — Group 1 (Age 5–8 Years)';
  doc.text(titleText, PAGE_W / 2 - doc.getTextWidth(titleText) / 2, y + 5.5);
  y += 8;

  // ── STUDENT INFO (left) + MY FITNESS INDICATOR (right) ──────────────────────
  const { studentInfo, currentMetrics, prevMetrics } = payload;
  const INFO_W    = 90;
  const LEVEL_W   = CONTENT_W - INFO_W - 2;
  const INFO_ROW_H = 7;
  const infoStartY = y;

  const infoRows = [
    { label: 'Name',            value: studentInfo.name  },
    { label: 'Class',           value: studentInfo.class },
    { label: 'Registration No', value: studentInfo.regNo },
    { label: 'Roll No',         value: studentInfo.rollNo },
    { label: 'Gender / DOB',    value: studentInfo.gender },
    { label: 'School',          value: studentInfo.school },
  ];

  infoRows.forEach((row, i) => {
    const rowY = y + i * INFO_ROW_H;
    filledRect(doc, MARGIN, rowY, INFO_W, INFO_ROW_H, C.white, C.midGray, 0.15);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.darkGray);
    doc.text(row.label, MARGIN + 1.5, rowY + INFO_ROW_H / 2 + 1.4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.textBlue);
    doc.text(clipText(doc, row.value, INFO_W - 35), MARGIN + 35, rowY + INFO_ROW_H / 2 + 1.4);
  });

  // Fitness Indicator right panel (same as Group 2)
  const levX = MARGIN + INFO_W + 2;
  const levY = infoStartY;
  const levH = infoRows.length * INFO_ROW_H;
  filledRect(doc, levX, levY, LEVEL_W, levH, C.white, C.borderBlue, 0.3);

  const levTitleH = 7;
  filledRect(doc, levX, levY, LEVEL_W, levTitleH, C.sectionBg, C.borderBlue, 0.3);
  cellText(doc, 'My Fitness Indicator', levX, levY, LEVEL_W, levTitleH, 8, C.black, true);

  const levRowH = 6.5;
  const cols4   = [LEVEL_W * 0.28, LEVEL_W * 0.24, LEVEL_W * 0.24, LEVEL_W * 0.24];
  const col4X   = [levX, levX + cols4[0], levX + cols4[0] + cols4[1], levX + cols4[0] + cols4[1] + cols4[2]];
  const hdr2Y   = levY + levTitleH;

  filledRect(doc, levX, hdr2Y, LEVEL_W, levRowH, C.lightGray, C.borderBlue, 0.2);
  ['Period', 'Weight', 'Height', 'BMI'].forEach((h, i) => {
    cellText(doc, h, col4X[i], hdr2Y, cols4[i], levRowH, 7, C.black, true);
  });

  const currRowY = hdr2Y + levRowH;
  filledRect(doc, levX, currRowY, LEVEL_W, levRowH, C.white, C.midGray, 0.15);
  ['Current', currentMetrics.weight, currentMetrics.height, currentMetrics.bmi].forEach((v, i) => {
    cellText(doc, v, col4X[i], currRowY, cols4[i], levRowH, i === 0 ? 6.5 : 7, i === 0 ? C.darkGray : C.textBlue, i === 0);
  });
  doc.setFontSize(6);
  doc.setTextColor(...C.darkGray);
  doc.text(currentMetrics.date, col4X[0] + 1, currRowY + levRowH - 1);

  const prevRowY = currRowY + levRowH;
  filledRect(doc, levX, prevRowY, LEVEL_W, levRowH, C.tableBg, C.midGray, 0.15);
  ['Previous', prevMetrics?.weight || '—', prevMetrics?.height || '—', prevMetrics?.bmi || '—'].forEach((v, i) => {
    cellText(doc, v, col4X[i], prevRowY, cols4[i], levRowH, i === 0 ? 6.5 : 7, i === 0 ? C.darkGray : C.textBlue, i === 0);
  });
  if (prevMetrics?.date) {
    doc.setFontSize(6);
    doc.setTextColor(...C.darkGray);
    doc.text(prevMetrics.date, col4X[0] + 1, prevRowY + levRowH - 1);
  }

  y += infoRows.length * INFO_ROW_H + 4;

  // ── GROUP 1 AGE BADGE ────────────────────────────────────────────────────────
  filledRect(doc, MARGIN, y, CONTENT_W, 6, C.headerBg, C.borderBlue, 0.25);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.textDark);
  doc.text(
    `Age Group 1 (5–8 Years)  •  Tests: Plate Tapping (Coordination)  &  Flamingo Balance (Balance)`,
    PAGE_W / 2 - doc.getTextWidth(`Age Group 1 (5–8 Years)  •  Tests: Plate Tapping (Coordination)  &  Flamingo Balance (Balance)`) / 2,
    y + 4
  );
  y += 8;

  // ── MY FITNESS SCORE TABLE (Group 1 — 2 tests) ──────────────────────────────
  drawSectionHeader(doc, MARGIN, y, CONTENT_W, 7, 'My Fitness Score');
  y += 7;

  const SCORE_COLS = {
    test:      50,
    l1: 9, l2: 9, l3: 9, l4: 9, l5: 9, l6: 9, l7: 9,
    score:     22,
    indicator: 18,
    feedback:  CONTENT_W - 50 - 9*7 - 22 - 18
  };

  // Header row
  const scoreHeaderH = 6;
  let cx = MARGIN;
  filledRect(doc, cx, y, SCORE_COLS.test, scoreHeaderH, C.sectionBg, C.borderBlue, 0.2);
  cellText(doc, 'My Fitness Score', cx, y, SCORE_COLS.test, scoreHeaderH, 6.5, C.black, true);
  cx += SCORE_COLS.test;

  ['L1','L2','L3','L4','L5','L6','L7'].forEach((lvl) => {
    filledRect(doc, cx, y, 9, scoreHeaderH, C.sectionBg, C.borderBlue, 0.2);
    cellText(doc, lvl, cx, y, 9, scoreHeaderH, 6.5, C.black, true);
    cx += 9;
  });
  ['My Score', 'Indicator', 'Feedback'].forEach((h, i) => {
    const w = [SCORE_COLS.score, SCORE_COLS.indicator, SCORE_COLS.feedback][i];
    filledRect(doc, cx, y, w, scoreHeaderH, C.sectionBg, C.borderBlue, 0.2);
    cellText(doc, h, cx, y, w, scoreHeaderH, 6.5, C.black, true);
    cx += w;
  });
  y += scoreHeaderH;

  // Test rows (2 rows)
  const { fitnessScores } = payload;
  const TEST_ROW_H = 14; // tall enough: name at top, Current + Previous well below

  fitnessScores.forEach((test, tIdx) => {
    const rowBg    = tIdx % 2 === 0 ? C.white : C.tableBg;
    const testRowY = y;

    // Test name cell — wrap long names, no overlap with sub-labels
    filledRect(doc, MARGIN, testRowY, SCORE_COLS.test, TEST_ROW_H, rowBg, C.borderBlue, 0.2);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.black);
    const nameLines = doc.splitTextToSize(test.testName, SCORE_COLS.test - 3);
    doc.text(nameLines.slice(0, 2), MARGIN + 1.5, testRowY + 4.5);
    // Current / Previous sub-labels — placed in bottom half of the row
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(...C.darkGray);
    doc.text('Current',  MARGIN + 3, testRowY + 9);
    doc.text('Previous', MARGIN + 3, testRowY + 12.5);

    // L1–L7 dots
    cx = MARGIN + SCORE_COLS.test;
    ['L1','L2','L3','L4','L5','L6','L7'].forEach((lvl) => {
      filledRect(doc, cx, testRowY, 9, TEST_ROW_H, rowBg, C.borderBlue, 0.2);
      if (test.level === lvl) {
        doc.setFillColor(...LEVEL_COLORS[lvl]);
        doc.circle(cx + 4.5, testRowY + TEST_ROW_H / 2, 2.8, 'F');
        doc.setFillColor(...C.white);
        doc.circle(cx + 4.5, testRowY + TEST_ROW_H / 2, 1.1, 'F');
      }
      cx += 9;
    });

    // My Score cell
    filledRect(doc, cx, testRowY, SCORE_COLS.score, TEST_ROW_H, rowBg, C.borderBlue, 0.2);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.textBlue);
    doc.text(test.currentScore !== 'N/A' ? test.currentScore : 'N/A', cx + 1.5, testRowY + 5.5);
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.darkGray);
    doc.text(test.previousScore !== 'N/A' ? test.previousScore : '—', cx + 1.5, testRowY + 11.5);
    cx += SCORE_COLS.score;

    // Indicator cell
    filledRect(doc, cx, testRowY, SCORE_COLS.indicator, TEST_ROW_H, rowBg, C.borderBlue, 0.2);
    const indColor = test.level !== 'N/A' ? LEVEL_COLORS[test.level] : C.darkGray;
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...indColor);
    const indStr = clipText(doc, test.indicator, SCORE_COLS.indicator - 2);
    doc.text(indStr, cx + (SCORE_COLS.indicator - doc.getTextWidth(indStr)) / 2, testRowY + TEST_ROW_H / 2 + 1.2);
    cx += SCORE_COLS.indicator;

    // Feedback cell — up to 3 lines in the taller row
    const feedW = SCORE_COLS.feedback;
    filledRect(doc, cx, testRowY, feedW, TEST_ROW_H, rowBg, C.borderBlue, 0.2);
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.textDark);
    const feedLines = doc.splitTextToSize(test.feedback, feedW - 2);
    doc.text(feedLines.slice(0, 3), cx + 1, testRowY + 4.5);

    y += TEST_ROW_H;
  });


  y += 5;

  // ── BENCHMARK TABLE (Group 1) ────────────────────────────────────────────────
  const ageLabel = `${studentInfo.age} year ${studentInfo.gender?.split(' / ')[0] || 'Student'}`;
  drawSectionHeader(doc, MARGIN, y, CONTENT_W, 7, `Benchmark: ${ageLabel} — Group 1`);
  y += 7;

  const { benchmarkTable } = payload;
  const bmTestW = 50;
  const bmLvlW  = (CONTENT_W - bmTestW) / 7;

  // Level header row
  cx = MARGIN;
  filledRect(doc, cx, y, bmTestW, 6, C.sectionBg, C.borderBlue, 0.2);
  cx += bmTestW;
  ['L1','L2','L3','L4','L5','L6','L7'].forEach((lvl) => {
    filledRect(doc, cx, y, bmLvlW, 6, C.sectionBg, C.borderBlue, 0.2);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...LEVEL_COLORS[lvl]);
    const tw = doc.getTextWidth(lvl);
    doc.text(lvl, cx + (bmLvlW - tw) / 2, y + 4.2);
    cx += bmLvlW;
  });
  y += 6;

  // Level label sub-row
  cx = MARGIN;
  filledRect(doc, cx, y, bmTestW, 5, C.white, C.borderBlue, 0.2);
  cx += bmTestW;
  ['Work Harder','Must Improve','Can do Better','Good','Very Good','Athletic','Sports Fit'].forEach((lbl, i) => {
    filledRect(doc, cx, y, bmLvlW, 5, C.white, C.borderBlue, 0.2);
    doc.setFontSize(4.8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...LEVEL_COLORS[`L${i+1}`]);
    const tw = doc.getTextWidth(lbl);
    doc.text(lbl, cx + (bmLvlW - tw) / 2, y + 3.5);
    cx += bmLvlW;
  });
  y += 5;

  benchmarkTable.forEach((bm, bIdx) => {
    const bmRowY  = y;
    const bmRowH  = 6;
    const bmRowBg = bIdx % 2 === 0 ? C.white : C.tableBg;

    filledRect(doc, MARGIN, bmRowY, bmTestW, bmRowH, bmRowBg, C.borderBlue, 0.2);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.black);
    doc.text(bm.testName, MARGIN + 1.5, bmRowY + bmRowH / 2 + 1.2);

    cx = MARGIN + bmTestW;
    bm.thresholds.forEach((thresh) => {
      filledRect(doc, cx, bmRowY, bmLvlW, bmRowH, bmRowBg, C.borderBlue, 0.2);
      const prefix  = bm.lowerIsBetter ? '<' : '>';
      const display = `${prefix}${thresh} ${bm.unit}`;
      doc.setFontSize(5.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...C.textDark);
      const tw = doc.getTextWidth(display);
      doc.text(display, cx + (bmLvlW - tw) / 2, bmRowY + bmRowH / 2 + 1.2);
      cx += bmLvlW;
    });
    // L7 last cell
    filledRect(doc, cx, bmRowY, bmLvlW, bmRowH, bmRowBg, C.borderBlue, 0.2);
    const lastT   = bm.thresholds[bm.thresholds.length - 1];
    const l7disp  = bm.lowerIsBetter ? `<${lastT} ${bm.unit}` : `>${lastT} ${bm.unit}`;
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.textDark);
    const tw7 = doc.getTextWidth(l7disp);
    doc.text(l7disp, cx + (bmLvlW - tw7) / 2, bmRowY + bmRowH / 2 + 1.2);
    y += bmRowH;
  });

  y += 5;

  // ── BMI BLOCK (identical to Group 2 layout) ──────────────────────────────────
  const BMI_LEFT_W  = CONTENT_W * 0.47;
  const BMI_RIGHT_W = CONTENT_W - BMI_LEFT_W - 2;
  const BMI_RIGHT_X = MARGIN + BMI_LEFT_W + 2;
  const bmiBlockY   = y;

  drawSectionHeader(doc, MARGIN, y, BMI_LEFT_W, 6.5, 'My BMI');
  y += 6.5;

  const bmiSubH = 5.5;
  filledRect(doc, MARGIN, y, BMI_LEFT_W, bmiSubH, C.lightGray, C.borderBlue, 0.2);
  const bmiCols = ['Body Mass Index', 'UW', 'N', 'OW', 'OB', 'Weight', 'Height', 'My BMI'];
  const bmiColW = [BMI_LEFT_W * 0.28, BMI_LEFT_W * 0.07, BMI_LEFT_W * 0.07, BMI_LEFT_W * 0.07, BMI_LEFT_W * 0.07, BMI_LEFT_W * 0.15, BMI_LEFT_W * 0.12, BMI_LEFT_W * 0.17];
  let bmiCX = MARGIN;
  bmiCols.forEach((h, i) => {
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.black);
    const tw = doc.getTextWidth(h);
    doc.text(h, bmiCX + (bmiColW[i] - tw) / 2, y + 3.8);
    bmiCX += bmiColW[i];
  });
  y += bmiSubH;

  const bmiRowH = 8;
  filledRect(doc, MARGIN, y, BMI_LEFT_W, bmiRowH, C.white, C.borderBlue, 0.2);
  bmiCX = MARGIN;
  leftText(doc, 'Current', bmiCX, y, bmiRowH, 6, C.darkGray, true);
  bmiCX += bmiColW[0];

  const barTotalW = bmiColW[1] + bmiColW[2] + bmiColW[3] + bmiColW[4];
  const barStartX = bmiCX;
  const barH      = 4;
  const barY      = y + (bmiRowH - barH) / 2;
  const { bmiBar } = payload;
  fillRect(doc, barStartX, barY, barTotalW, barH, C.lightGray);
  fillRect(doc, barStartX, barY, (bmiBar.percent / 100) * barTotalW, barH, C.bmiRed);
  strokeRect(doc, barStartX, barY, barTotalW, barH, C.borderBlue, 0.2);
  bmiCX += barTotalW;

  [currentMetrics.weight, currentMetrics.height, bmiBar.value.toString()].forEach((v, i) => {
    const ww = bmiColW[5 + i];
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.textBlue);
    const tw = doc.getTextWidth(v);
    doc.text(v, bmiCX + (ww - tw) / 2, y + bmiRowH / 2 + 1.2);
    bmiCX += ww;
  });
  y += bmiRowH;

  // Previous BMI row
  const prevBmiRowH = 6.5;
  filledRect(doc, MARGIN, y, BMI_LEFT_W, prevBmiRowH, C.tableBg, C.borderBlue, 0.2);
  bmiCX = MARGIN;
  leftText(doc, 'Previous', bmiCX, y, prevBmiRowH, 6, C.darkGray, true);
  bmiCX += bmiColW[0];
  if (payload.prevBmiBar) {
    const pBarY    = y + (prevBmiRowH - 3) / 2;
    fillRect(doc, barStartX, pBarY, barTotalW, 3, C.lightGray);
    fillRect(doc, barStartX, pBarY, (payload.prevBmiBar.percent / 100) * barTotalW, 3, [180, 100, 100]);
    strokeRect(doc, barStartX, pBarY, barTotalW, 3, C.midGray, 0.15);
    bmiCX += barTotalW;
    [prevMetrics?.weight || '—', prevMetrics?.height || '—', payload.prevBmiBar.value.toString()].forEach((v, i) => {
      const ww = bmiColW[5 + i];
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...C.darkGray);
      const tw = doc.getTextWidth(v);
      doc.text(v, bmiCX + (ww - tw) / 2, y + prevBmiRowH / 2 + 1.2);
      bmiCX += ww;
    });
  }
  y += prevBmiRowH;

  // Right: BMI Benchmark
  drawSectionHeader(doc, BMI_RIGHT_X, bmiBlockY, BMI_RIGHT_W, 6.5, `BMI Benchmark: ${ageLabel}`);
  const bmiBenchH   = 5.5;
  const bmiBenchHdY = bmiBlockY + 6.5;
  const bmiBenchW   = BMI_RIGHT_W / 4;
  let bmiRCX = BMI_RIGHT_X;
  filledRect(doc, BMI_RIGHT_X, bmiBenchHdY, BMI_RIGHT_W, bmiBenchH, C.lightGray, C.borderBlue, 0.2);
  ['UnderWeight', 'Normal', 'Over Weight', 'Obese'].forEach((h) => {
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.black);
    const tw = doc.getTextWidth(h);
    doc.text(h, bmiRCX + (bmiBenchW - tw) / 2, bmiBenchHdY + 3.8);
    bmiRCX += bmiBenchW;
  });
  const bmiBenchDataH = 6;
  const bmiBenchDataY = bmiBenchHdY + bmiBenchH;
  filledRect(doc, BMI_RIGHT_X, bmiBenchDataY, BMI_RIGHT_W, bmiBenchDataH, C.white, C.borderBlue, 0.2);
  bmiRCX = BMI_RIGHT_X;
  ['<= 14.60', '< 17.20', '< 20.20', '< 23.20'].forEach((v) => {
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.textBlue);
    const tw = doc.getTextWidth(v);
    doc.text(v, bmiRCX + (bmiBenchW - tw) / 2, bmiBenchDataY + 4);
    bmiRCX += bmiBenchW;
  });

  y += 5;

  // ── RECOMMENDATIONS ──────────────────────────────────────────────────────────
  const { recommendations } = payload;
  const REC_ROW_H = 5.5;

  filledRect(doc, MARGIN, y, CONTENT_W, REC_ROW_H + 1, C.headerBg, C.borderBlue, 0.3);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.textDark);
  const wtLines = doc.splitTextToSize(recommendations.weightTarget, CONTENT_W - 4);
  doc.text(wtLines[0], MARGIN + 1.5, y + 4);
  y += REC_ROW_H + 1;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.black);
  doc.text('Dietary', MARGIN + 1.5, y + 4);
  y += 5.5;

  recommendations.dietary.forEach((item, idx) => {
    const alpha = String.fromCharCode(97 + idx);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.textDark);
    const lines = doc.splitTextToSize(`${alpha}. ${item}`, CONTENT_W - 6);
    doc.text(lines, MARGIN + 3, y);
    y += lines.length * 4 + 0.5;
  });

  y += 1;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.black);
  doc.text('Active Lifestyle to be pursued', MARGIN + 1.5, y + 3.5);
  y += 5.5;

  recommendations.lifestyle.forEach((item, idx) => {
    const alpha = String.fromCharCode(97 + idx);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.textDark);
    const lines = doc.splitTextToSize(`${alpha}. ${item}`, CONTENT_W - 6);
    doc.text(lines, MARGIN + 3, y);
    y += lines.length * 4 + 0.5;
  });

  y += 3;

  // ── FOOTER ───────────────────────────────────────────────────────────────────
  const footerY = Math.min(y, PAGE_H - 12);
  filledRect(doc, MARGIN, footerY, CONTENT_W, 8, C.headerBg, C.borderBlue, 0.3);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...C.textDark);
  const footerText = `Instructions to Parents: Download the SportSphere Mobile App. Create your account, add ${studentInfo.name}'s profile, and enter ${studentInfo.regNo} as "Standard Assessment Registration No." to view the detailed fitness dashboard.`;
  const footerLines = doc.splitTextToSize(footerText, CONTENT_W - 4);
  doc.text(footerLines.slice(0, 2), MARGIN + 2, footerY + 3.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.darkGray);
  doc.text(`Generated: ${payload.generatedAt}`, PAGE_W - MARGIN - 28, PAGE_H - 4);

  doc.save(`${filename}.pdf`);
};

// ═══════════════════════════════════════════════════════════════════════════════
// REACT COMPONENT — Export Button with Async State + Cool Loader (Phase 5)
const FitnessReportExportButton = ({
  student,
  currentPerf,
  prevPerf   = null,
  institute  = {},
  disabled   = false,
  className  = '',
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [errorMsg,    setErrorMsg   ] = useState(null);

  const handleExport = async () => {
    if (isExporting || disabled) return;

    setIsExporting(true);
    setErrorMsg(null);

    try {
      // ── Detect age group — prefer dob, fall back to pre-computed age ──────
      const computeAgeLocal = (dob) => {
        if (!dob) return null; // signal: dob not available
        const birth = new Date(dob);
        if (isNaN(birth.getTime())) return null;
        const now = new Date();
        let age = now.getFullYear() - birth.getFullYear();
        const m = now.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
        return age;
      };
      // Try dob from student, then from populated perf record, then use pre-computed age
      const dobSource = student.dob || currentPerf?.studentId?.dob || null;
      const studentAge = computeAgeLocal(dobSource) ?? student.age ?? 10;
      const isGroup1   = studentAge >= 5 && studentAge <= 8;

      let payload;
      if (isGroup1) {
        payload = formatGroup1ReportPayload(student, currentPerf, prevPerf, institute);
      } else {
        payload = formatReportPayload(student, currentPerf, prevPerf, institute);
      }

      // ── Construct a safe filename ────────────────────────────────────────
      const safeName = (student.name || 'Student').replace(/\s+/g, '_');
      const groupTag  = isGroup1 ? 'Group1' : 'Group2';
      const filename  = `${safeName}_Fitness_Report_${payload.term}_${groupTag}`;

      // ── Run the correct PDF generator ────────────────────────────────────
      if (isGroup1) {
        await generateGroup1FitnessReportPDF(payload, filename);
      } else {
        await generateFitnessReportPDF(payload, filename);
      }

    } catch (err) {
      console.error('[FitnessReport] PDF generation failed:', err);
      setErrorMsg('PDF generation failed. Please try again.');
    } finally {
      // ── ALWAYS reset loader — even on error (Phase 5 requirement) ────────
      setIsExporting(false);
    }
  };

  return (
    <div className="relative inline-flex flex-col items-start gap-1">
      <button
        id="export-fitness-report-btn"
        onClick={handleExport}
        disabled={isExporting || disabled}
        className={`
          relative inline-flex items-center gap-2
          px-5 py-2.5 rounded-xl text-xs font-black
          transition-all duration-200 active:scale-95
          select-none overflow-hidden
          ${isExporting || disabled
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none opacity-70'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-500/30 cursor-pointer'
          }
          ${className}
        `}
        aria-label={isExporting ? 'Generating PDF document...' : 'Export Fitness Assessment Report as PDF'}
        aria-busy={isExporting}
      >
        {/* ── Shimmer overlay while exporting ─────────────────────────── */}
        {isExporting && (
          <span
            className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
            }}
          />
        )}

        {/* ── Icon: spinner OR download icon ─────────────────────────── */}
        {isExporting ? (
          <svg
            className="animate-spin h-3.5 w-3.5 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <Download size={13} strokeWidth={2.5} aria-hidden="true" />
        )}

        {/* ── Button label ─────────────────────────────────────────────── */}
        <span>
          {isExporting ? 'Generating Document…' : 'Export PDF'}
        </span>
      </button>

      {/* ── Inline error message (non-intrusive, no alert()) ─────────────── */}
      {errorMsg && !isExporting && (
        <p
          role="alert"
          className="text-[10px] font-semibold text-red-500 flex items-center gap-1 mt-0.5 animate-fade-in"
        >
          <svg viewBox="0 0 16 16" className="w-3 h-3 fill-red-500 shrink-0" aria-hidden="true">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 4.25a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0v-3zm-.75 5.5a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75z"/>
          </svg>
          {errorMsg}
        </p>
      )}
    </div>
  );
};

export default FitnessReportExportButton;
