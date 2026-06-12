/**
 * formatReportPayload.js
 *
 * Phase 2: Data Transformation & Formatting Utility
 *
 * Transforms raw DB Performance + Student objects into a clean,
 * PDF-ready payload for the National Fitness Standard Assessment report.
 *
 * Rules:
 *  - BMI is (re)calculated from stored height & weight for accuracy.
 *  - Dates are formatted as DD-MMM-YYYY (e.g., 27-Aug-2008).
 *  - Missing test scores default to "N/A".
 *  - Fitness level is determined against age+gender benchmark tables.
 *  - Dietary & lifestyle recommendations are generated from BMI category.
 */

// ─── Date Formatter ──────────────────────────────────────────────────────────

/**
 * Converts any date value to "DD-MMM-YYYY" format.
 * Returns "N/A" if the date is invalid or missing.
 * @param {Date|string|null} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'N/A';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day   = String(d.getDate()).padStart(2, '0');
  const month = months[d.getMonth()];
  const year  = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// ─── Age Calculator ───────────────────────────────────────────────────────────

/**
 * Returns integer age from a date-of-birth value.
 * @param {Date|string|null} dob
 * @returns {number}
 */
const computeAge = (dob) => {
  if (!dob) return 0;
  const birth = new Date(dob);
  const now   = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
};

// ─── BMI Calculator ───────────────────────────────────────────────────────────

/**
 * Calculates BMI from height (cm) and weight (kg).
 * Returns 0 if inputs are invalid.
 * @param {number} heightCm
 * @param {number} weightKg
 * @returns {number}
 */
const calcBMI = (heightCm, weightKg) => {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return 0;
  const h = heightCm / 100;
  return parseFloat((weightKg / (h * h)).toFixed(1));
};

// ─── BMI Category ─────────────────────────────────────────────────────────────

/**
 * Returns BMI category label based on age-adjusted thresholds.
 * For the National Fitness Standard, standard WHO-derived thresholds are used.
 * @param {number} bmi
 * @param {number} age  - used for future age-specific logic if needed
 * @returns {{ category: string, label: string }}
 */
const getBMICategory = (bmi, age = 14) => {
  if (bmi <= 0) return { category: 'N/A', label: 'N/A' };
  if (bmi < 14.60) return { category: 'UW',  label: 'Under Weight' };
  if (bmi < 17.20) return { category: 'N',   label: 'Normal'       };
  if (bmi < 20.20) return { category: 'OW',  label: 'Over Weight'  };
  return                  { category: 'OB',  label: 'Obese'        };
};

// ─── National Fitness Standard Benchmark Tables ───────────────────────────────
//
// Group 2 (age 9-18): runWalk600m, run50m, partialCurlUp, pushups, sitAndReach
// Group 1 (age 5-8):  plateTapping, flamingoBalance
//
// Test scores interpretation:
//   runWalk600m      → LOWER  is better (seconds)
//   run50m           → LOWER  is better (seconds)
//   plateTapping     → LOWER  is better (seconds for 25 taps)
//   partialCurlUp    → HIGHER is better (reps)
//   pushups          → HIGHER is better (reps)
//   sitAndReach      → HIGHER is better (cm)
//   flamingoBalance  → LOWER  is better (number of falls in 60s)

const BENCHMARKS = {
  // Legacy default structure to prevent imports breaking (e.g. tests or external files)
  default: {
    runWalk600m: {
      label: '600m run/walk (Endurance)',
      unit: 'sec',
      lowerIsBetter: true,
      thresholds: [207, 202, 196, 191, 189, 186]
    },
    run50m: {
      label: '50m dash (Speed)',
      unit: 'sec',
      lowerIsBetter: true,
      thresholds: [10.1, 9.7, 9.3, 8.9, 8.5, 8.1]
    },
    partialCurlUp: {
      label: 'Partial curl up 30 sec (Core Strength)',
      unit: 'times',
      lowerIsBetter: false,
      thresholds: [13, 16, 19, 22, 23, 24]
    },
    pushups: {
      label: 'Push up (Strength)',
      unit: 'times',
      lowerIsBetter: false,
      thresholds: [6, 7, 8, 9, 10, 11]
    },
    sitAndReach: {
      label: 'Sit and reach (Flexibility)',
      unit: 'cm',
      lowerIsBetter: false,
      thresholds: [6.0, 10.8, 14.4, 17.7, 18.4, 21.8]
    }
  },

  group1Legacy: {
    plateTapping: {
      label: 'Plate Tapping (Coordination)',
      unit: 'sec',
      lowerIsBetter: true,
      thresholds: [18.0, 16.5, 15.0, 13.5, 12.5, 11.5]
    },
    flamingoBalance: {
      label: 'Flamingo Balance (Balance)',
      unit: 'sec',
      lowerIsBetter: false,
      thresholds: [5, 8, 12, 16, 20, 25]
    }
  },

  // Real-world dynamic cohorts
  cohorts: {
    '9-11': {
      Male: {
        runWalk600m: {
          label: '600m run/walk (Endurance)',
          unit: 'sec',
          lowerIsBetter: true,
          thresholds: [250, 235, 220, 205, 190, 175]
        },
        run50m: {
          label: '50m dash (Speed)',
          unit: 'sec',
          lowerIsBetter: true,
          thresholds: [11.5, 10.8, 10.1, 9.5, 8.9, 8.3]
        },
        partialCurlUp: {
          label: 'Partial curl up 30 sec (Core Strength)',
          unit: 'times',
          lowerIsBetter: false,
          thresholds: [6, 9, 12, 15, 18, 21]
        },
        pushups: {
          label: 'Push up (Strength)',
          unit: 'times',
          lowerIsBetter: false,
          thresholds: [4, 6, 9, 12, 15, 18]
        },
        sitAndReach: {
          label: 'Sit and reach (Flexibility)',
          unit: 'cm',
          lowerIsBetter: false,
          thresholds: [8.0, 12.0, 16.0, 20.0, 23.0, 26.0]
        }
      },
      Female: {
        runWalk600m: {
          label: '600m run/walk (Endurance)',
          unit: 'sec',
          lowerIsBetter: true,
          thresholds: [270, 255, 240, 225, 210, 195]
        },
        run50m: {
          label: '50m dash (Speed)',
          unit: 'sec',
          lowerIsBetter: true,
          thresholds: [12.0, 11.3, 10.6, 10.0, 9.4, 8.8]
        },
        partialCurlUp: {
          label: 'Partial curl up 30 sec (Core Strength)',
          unit: 'times',
          lowerIsBetter: false,
          thresholds: [5, 8, 11, 14, 17, 20]
        },
        pushups: {
          label: 'Modified Push up (Strength)',
          unit: 'times',
          lowerIsBetter: false,
          thresholds: [3, 5, 7, 10, 13, 16]
        },
        sitAndReach: {
          label: 'Sit and reach (Flexibility)',
          unit: 'cm',
          lowerIsBetter: false,
          thresholds: [10.0, 14.0, 18.0, 22.0, 25.0, 28.0]
        }
      }
    },
    '12-14': {
      Male: {
        runWalk600m: {
          label: '600m run/walk (Endurance)',
          unit: 'sec',
          lowerIsBetter: true,
          thresholds: [220, 205, 190, 175, 160, 145]
        },
        run50m: {
          label: '50m dash (Speed)',
          unit: 'sec',
          lowerIsBetter: true,
          thresholds: [10.2, 9.6, 9.0, 8.4, 7.8, 7.2]
        },
        partialCurlUp: {
          label: 'Partial curl up 30 sec (Core Strength)',
          unit: 'times',
          lowerIsBetter: false,
          thresholds: [10, 14, 18, 22, 25, 28]
        },
        pushups: {
          label: 'Push up (Strength)',
          unit: 'times',
          lowerIsBetter: false,
          thresholds: [8, 12, 16, 20, 24, 28]
        },
        sitAndReach: {
          label: 'Sit and reach (Flexibility)',
          unit: 'cm',
          lowerIsBetter: false,
          thresholds: [12.0, 16.0, 20.0, 24.0, 28.0, 32.0]
        }
      },
      Female: {
        runWalk600m: {
          label: '600m run/walk (Endurance)',
          unit: 'sec',
          lowerIsBetter: true,
          thresholds: [250, 235, 220, 205, 190, 175]
        },
        run50m: {
          label: '50m dash (Speed)',
          unit: 'sec',
          lowerIsBetter: true,
          thresholds: [11.0, 10.4, 9.8, 9.2, 8.6, 8.0]
        },
        partialCurlUp: {
          label: 'Partial curl up 30 sec (Core Strength)',
          unit: 'times',
          lowerIsBetter: false,
          thresholds: [8, 11, 15, 19, 22, 25]
        },
        pushups: {
          label: 'Modified Push up (Strength)',
          unit: 'times',
          lowerIsBetter: false,
          thresholds: [6, 9, 12, 16, 20, 24]
        },
        sitAndReach: {
          label: 'Sit and reach (Flexibility)',
          unit: 'cm',
          lowerIsBetter: false,
          thresholds: [15.0, 19.0, 23.0, 27.0, 31.0, 35.0]
        }
      }
    },
    '15-18': {
      Male: {
        runWalk600m: {
          label: '600m run/walk (Endurance)',
          unit: 'sec',
          lowerIsBetter: true,
          thresholds: [190, 175, 160, 145, 130, 115]
        },
        run50m: {
          label: '50m dash (Speed)',
          unit: 'sec',
          lowerIsBetter: true,
          thresholds: [9.0, 8.4, 7.8, 7.2, 6.6, 6.0]
        },
        partialCurlUp: {
          label: 'Partial curl up 30 sec (Core Strength)',
          unit: 'times',
          lowerIsBetter: false,
          thresholds: [15, 20, 25, 30, 34, 38]
        },
        pushups: {
          label: 'Push up (Strength)',
          unit: 'times',
          lowerIsBetter: false,
          thresholds: [12, 17, 22, 27, 32, 37]
        },
        sitAndReach: {
          label: 'Sit and reach (Flexibility)',
          unit: 'cm',
          lowerIsBetter: false,
          thresholds: [16.0, 20.0, 25.0, 30.0, 34.0, 38.0]
        }
      },
      Female: {
        runWalk600m: {
          label: '600m run/walk (Endurance)',
          unit: 'sec',
          lowerIsBetter: true,
          thresholds: [230, 215, 200, 185, 170, 155]
        },
        run50m: {
          label: '50m dash (Speed)',
          unit: 'sec',
          lowerIsBetter: true,
          thresholds: [10.2, 9.6, 9.0, 8.4, 7.8, 7.2]
        },
        partialCurlUp: {
          label: 'Partial curl up 30 sec (Core Strength)',
          unit: 'times',
          lowerIsBetter: false,
          thresholds: [12, 16, 20, 24, 28, 32]
        },
        pushups: {
          label: 'Modified Push up (Strength)',
          unit: 'times',
          lowerIsBetter: false,
          thresholds: [8, 12, 16, 21, 26, 30]
        },
        sitAndReach: {
          label: 'Sit and reach (Flexibility)',
          unit: 'cm',
          lowerIsBetter: false,
          thresholds: [20.0, 24.0, 28.0, 33.0, 37.0, 41.0]
        }
      }
    }
  },

  // Group 1: 5-8 year benchmarks
  group1: {
    Male: {
      plateTapping: {
        label: 'Plate Tapping (Coordination)',
        unit: 'sec',
        lowerIsBetter: true,
        thresholds: [17.5, 16.0, 14.5, 13.0, 12.0, 11.0]
      },
      flamingoBalance: {
        label: 'Flamingo Balance (Balance)',
        unit: 'falls',
        lowerIsBetter: true,
        thresholds: [15, 12, 9, 6, 4, 2]
      }
    },
    Female: {
      plateTapping: {
        label: 'Plate Tapping (Coordination)',
        unit: 'sec',
        lowerIsBetter: true,
        thresholds: [18.5, 17.0, 15.5, 14.0, 13.0, 12.0]
      },
      flamingoBalance: {
        label: 'Flamingo Balance (Balance)',
        unit: 'falls',
        lowerIsBetter: true,
        thresholds: [15, 12, 9, 6, 4, 2]
      }
    }
  }
};

/**
 * Resolves the appropriate benchmarks for a student based on age and gender.
 * @param {number} age
 * @param {string} gender
 * @returns {Object}
 */
export const getStudentBenchmarks = (age, gender = 'Male') => {
  const cleanGender = String(gender).toLowerCase().includes('female') ? 'Female' : 'Male';
  if (age >= 5 && age <= 8) {
    return BENCHMARKS.group1[cleanGender];
  }
  let cohortKey = '15-18';
  if (age <= 11) {
    cohortKey = '9-11';
  } else if (age <= 14) {
    cohortKey = '12-14';
  }
  return BENCHMARKS.cohorts[cohortKey][cleanGender];
};

// ─── Level Label Map ──────────────────────────────────────────────────────────

const LEVEL_LABELS = {
  L1: { label: 'Work Harder',  color: '#e53e3e' },
  L2: { label: 'Must Improve', color: '#ed8936' },
  L3: { label: 'Can do Better', color: '#ecc94b' },
  L4: { label: 'Good',         color: '#68d391' },
  L5: { label: 'Very Good',    color: '#48bb78' },
  L6: { label: 'Athletic',     color: '#38a169' },
  L7: { label: 'Sports Fit',   color: '#276749' }
};

// ─── Fitness Indicator Logic ──────────────────────────────────────────────────

/**
 * Determines the L1–L7 fitness level and feedback for a single test score.
 *
 * @param {string}  testKey         - Key in BENCHMARKS (e.g. 'run50m')
 * @param {number|string} rawScore  - The student's actual score
 * @returns {{ level: string, indicator: string, feedback: string }}
 */
const getFitnessIndicator = (testKey, rawScore, age = 14, gender = 'Male') => {
  const activeBenchmarks = getStudentBenchmarks(age, gender);
  const bench = activeBenchmarks[testKey] || BENCHMARKS.default[testKey];
  if (!bench || rawScore === null || rawScore === undefined || rawScore === '' || rawScore === 'N/A') {
    return { level: 'N/A', indicator: 'N/A', feedback: 'No data recorded for this test.' };
  }

  let numericScore;

  // Handle 600m run stored as "M:SS" string (e.g. "7:05") or plain seconds
  if (testKey === 'runWalk600m') {
    if (typeof rawScore === 'string' && rawScore.includes(':')) {
      const [mins, secs] = rawScore.split(':').map(Number);
      numericScore = (mins * 60) + (isNaN(secs) ? 0 : secs);
    } else {
      numericScore = parseFloat(rawScore);
    }
  } else {
    numericScore = parseFloat(rawScore);
  }

  if (isNaN(numericScore)) {
    return { level: 'N/A', indicator: 'N/A', feedback: 'Invalid score format.' };
  }

  const { thresholds, lowerIsBetter } = bench;
  let levelIndex; // 0-based → levels L1..L7

  if (lowerIsBetter) {
    // Lower score = better level
    if      (numericScore > thresholds[0]) levelIndex = 0; // L1 (worst)
    else if (numericScore > thresholds[1]) levelIndex = 1;
    else if (numericScore > thresholds[2]) levelIndex = 2;
    else if (numericScore > thresholds[3]) levelIndex = 3;
    else if (numericScore > thresholds[4]) levelIndex = 4;
    else if (numericScore > thresholds[5]) levelIndex = 5;
    else                                   levelIndex = 6; // L7 (best)
  } else {
    // Higher score = better level
    if      (numericScore <= thresholds[0]) levelIndex = 0;
    else if (numericScore <= thresholds[1]) levelIndex = 1;
    else if (numericScore <= thresholds[2]) levelIndex = 2;
    else if (numericScore <= thresholds[3]) levelIndex = 3;
    else if (numericScore <= thresholds[4]) levelIndex = 4;
    else if (numericScore <= thresholds[5]) levelIndex = 5;
    else                                    levelIndex = 6;
  }

  const level     = `L${levelIndex + 1}`;
  const levelInfo = LEVEL_LABELS[level];

  // Generate contextual feedback
  let feedback;
  if (levelIndex <= 1) {
    feedback = 'The data seems to be outside the Benchmark data. PE Teacher/Coach may re-test to verify the result.';
  } else if (levelIndex === 2) {
    feedback = 'Performance needs improvement. Regular practice and structured training sessions are recommended.';
  } else if (levelIndex === 3) {
    feedback = 'Good performance. Maintain current training routine and aim for consistent improvement.';
  } else if (levelIndex === 4) {
    feedback = 'Very good performance. Student shows strong fitness levels. Continue advanced drills.';
  } else if (levelIndex === 5) {
    feedback = 'Athletic level achieved. Excellent physical conditioning. Competitive-level training is recommended.';
  } else {
    feedback = 'Sports Fit! Exceptional performance. Student is ready for high-level competitive sports.';
  }

  return {
    level,
    indicator: levelInfo.label,
    color:     levelInfo.color,
    feedback
  };
};

// ─── Score Display Formatter ──────────────────────────────────────────────────

/**
 * Formats a raw test score into a display-friendly string with unit.
 * @param {string}        testKey
 * @param {number|string} rawScore
 * @param {number}        age
 * @param {string}        gender
 * @returns {string}
 */
const formatScore = (testKey, rawScore, age = 14, gender = 'Male') => {
  if (rawScore === null || rawScore === undefined || rawScore === '' || rawScore === 0) {
    return 'N/A';
  }
  const activeBenchmarks = getStudentBenchmarks(age, gender);
  const bench = activeBenchmarks[testKey] || BENCHMARKS.default[testKey];
  const unit  = bench?.unit || '';

  // 600m: keep as-is if string (e.g., "7:05 min"), append "sec" if numeric
  if (testKey === 'runWalk600m') {
    if (typeof rawScore === 'string' && rawScore.includes(':')) {
      return `${rawScore} min`;
    }
    const n = parseFloat(rawScore);
    if (!isNaN(n) && n > 0) {
      const m = Math.floor(n / 60);
      const s = Math.round(n % 60);
      return `${m}:${String(s).padStart(2, '0')} min`;
    }
    return 'N/A';
  }

  const n = parseFloat(rawScore);
  if (isNaN(n) || n === 0) return 'N/A';
  return `${n} ${unit}`.trim();
};

// ─── BMI Recommendations Generator ───────────────────────────────────────────

/**
 * Generates weight, dietary, and lifestyle recommendations based on BMI.
 * @param {number} bmi
 * @param {number} weight    - current weight in kg
 * @param {string} bmiLabel  - 'Under Weight'|'Normal'|'Over Weight'|'Obese'
 * @returns {{ weightTarget: string, dietary: string[], lifestyle: string[] }}
 */
const generateRecommendations = (bmi, weight, bmiLabel) => {
  let weightTarget = '';
  let dietary      = [];
  let lifestyle    = [];

  if (bmiLabel === 'Over Weight' || bmiLabel === 'Obese') {
    // Target BMI of 17.2 (upper edge of Normal for this age group)
    const targetBMI    = 17.2;
    // Keep same height, back-calculate target weight
    // Since BMI = weight / h^2 → targetWeight = targetBMI * h^2
    // We approximate using same h: h^2 = weight/bmi
    const hSquared     = weight / bmi;
    const targetWeight = parseFloat((targetBMI * hSquared).toFixed(1));
    const reduction    = parseFloat((weight - targetWeight).toFixed(1));

    weightTarget = `You can reduce your weight by ${reduction} Kg by improving your lifestyle and increasing regular physical activity. We recommend you to do the following:`;

    dietary = [
      'Calorie - Need to be decreased.',
      'Food Restrictions - Need to restrict food with extra fat.',
      'Healthier Choices - Replace fast foods and synthetic food items with natural and healthier choices like natural juices instead of sugar coated or aerated drinks.'
    ];

    lifestyle = [
      'Exercise - Regular exercise is essential and recommended on daily basis.',
      'Physical Activity - Keep moving is the most efficient way to burn calories and shed excess weight; any extra movement helps burn calories. Involve in household chores and do other basic activities yourself.',
      'Sports Participation - Regular sports participation is important. Involve in more of endurance sports.'
    ];

  } else if (bmiLabel === 'Under Weight') {
    weightTarget = 'Your weight is below the recommended range. A balanced diet plan and strength-building exercises are recommended to achieve a healthy weight.';

    dietary = [
      'Calorie - Need to be increased with nutritious, calorie-dense foods.',
      'Protein Intake - Increase protein consumption through eggs, dairy, legumes, and lean meats.',
      'Meal Frequency - Eat more frequent, smaller meals throughout the day to increase caloric intake.'
    ];

    lifestyle = [
      'Strength Training - Focus on resistance and weight-bearing exercises to build muscle mass.',
      'Rest & Recovery - Adequate sleep (8-9 hours) is essential for healthy weight gain and muscle growth.',
      'Sports Participation - Engage in strength-based sports to build body composition.'
    ];

  } else {
    // Normal BMI
    weightTarget = 'Your BMI is within the healthy range. Maintain your current lifestyle with balanced diet and regular physical activity.';

    dietary = [
      'Balanced Diet - Continue consuming a well-rounded diet rich in vegetables, fruits, and whole grains.',
      'Hydration - Drink adequate water throughout the day (minimum 8 glasses).',
      'Limit Junk Food - Minimize consumption of processed foods and sugary beverages.'
    ];

    lifestyle = [
      'Regular Activity - Continue participating in physical activities for at least 60 minutes daily.',
      'Sports Participation - Engage in team or individual sports to maintain fitness and build social skills.',
      'Sleep Hygiene - Maintain consistent sleep schedule of 8-9 hours per night for optimal performance.'
    ];
  }

  return { weightTarget, dietary, lifestyle };
};

// ─── Main Export: formatReportPayload ─────────────────────────────────────────

/**
 * Transforms raw DB objects into a clean, PDF-ready report payload.
 *
 * @param {Object} student       - Raw Student document from MongoDB
 * @param {Object} currentPerf   - Current term Performance document
 * @param {Object|null} prevPerf - Previous term Performance document (may be null)
 * @param {Object} institute     - Institute object { name, city, state }
 * @returns {Object} Formatted report payload
 */
const formatReportPayload = (student, currentPerf, prevPerf = null, institute = {}) => {
  if (!student || !currentPerf) {
    throw new Error('formatReportPayload: student and currentPerf are required.');
  }

  // ── 1. Student Demographics ─────────────────────────────────────────────
  const age    = computeAge(student.dob) || student.age || 0;
  const gender = student.gender || 'Male';

  const dobVal = student.dob || currentPerf?.studentId?.dob;
  const dobDisplay = dobVal ? formatDate(dobVal) : (age ? `Age ${age}` : 'N/A');

  const studentInfo = {
    name:       student.name        || 'N/A',
    class:      student.class       || 'N/A',
    regNo:      student.studentId   || 'N/A',
    rollNo:     student.rollNo      || (student.studentId || 'N/A'),
    gender:     `${gender} / ${dobDisplay}`,
    dob:        dobDisplay,
    school:     institute.name      || 'N/A',
    age
  };

  // ── 2. Physical Metrics ─────────────────────────────────────────────────
  const heightCm  = currentPerf.height  || 0;
  const weightKg  = currentPerf.weight  || 0;
  const bmi       = currentPerf.bmi     || calcBMI(heightCm, weightKg);
  const bmiRounded = parseFloat(bmi.toFixed(2));

  const { category: bmiCategory, label: bmiLabel } = getBMICategory(bmiRounded, age);

  const currentMetrics = {
    date:   formatDate(currentPerf.createdAt || new Date()),
    weight: weightKg > 0 ? `${weightKg} kg`  : 'N/A',
    height: heightCm > 0 ? `${heightCm} cm`  : 'N/A',
    bmi:    bmiRounded  > 0 ? `${bmiRounded}` : 'N/A'
  };

  const prevMetrics = prevPerf ? {
    date:   formatDate(prevPerf.createdAt || null),
    weight: prevPerf.weight > 0 ? `${prevPerf.weight} kg`              : 'N/A',
    height: prevPerf.height > 0 ? `${prevPerf.height} cm`             : 'N/A',
    bmi:    prevPerf.bmi    > 0 ? `${parseFloat(prevPerf.bmi.toFixed(2))}` : 'N/A'
  } : null;

  // ── 3. The 5 Fitness Test Scores (Group 2: 9-18 yrs) ───────────────────

  const TEST_KEYS = [
    'sitAndReach',
    'runWalk600m',
    'run50m',
    'partialCurlUp',
    'pushups'
  ];

  const studentBenchmarks = getStudentBenchmarks(age, gender);

  const fitnessScores = TEST_KEYS.map((key) => {
    const bench       = studentBenchmarks[key] || BENCHMARKS.default[key];
    const currRaw     = currentPerf[key] ?? null;
    const prevRaw     = prevPerf?.[key]  ?? null;

    const currDisplay = formatScore(key, currRaw, age, gender);
    const prevDisplay = prevRaw !== null && prevRaw !== undefined
      ? formatScore(key, prevRaw, age, gender)
      : 'N/A';

    const { level, indicator, color, feedback } = getFitnessIndicator(key, currRaw, age, gender);

    return {
      testName:      bench.label,
      unit:          bench.unit,
      currentScore:  currDisplay,
      previousScore: prevDisplay,
      level,
      indicator,
      color,
      feedback
    };
  });

  // ── 4. BMI Indicator Bar ────────────────────────────────────────────────

  // BMI thresholds from reference image (11-year benchmark):
  // UW ≤14.60 | N <17.20 | OW <20.20 | OB <23.20
  const BMI_THRESHOLDS = { uw: 14.60, n: 17.20, ow: 20.20, ob: 23.20 };

  // Bar fill % (0–100) relative to the max threshold (23.20)
  const bmiBarPercent = bmiRounded > 0
    ? Math.min(100, parseFloat(((bmiRounded / BMI_THRESHOLDS.ob) * 100).toFixed(1)))
    : 0;

  const bmiBar = {
    value:      bmiRounded,
    percent:    bmiBarPercent,
    category:   bmiCategory,
    label:      bmiLabel,
    thresholds: BMI_THRESHOLDS
  };

  const prevBmiRaw    = prevPerf?.bmi || 0;
  const prevBmiValue  = prevBmiRaw > 0 ? parseFloat(prevBmiRaw.toFixed(2)) : null;
  const prevBmiBar    = prevBmiValue ? {
    value:   prevBmiValue,
    percent: Math.min(100, parseFloat(((prevBmiValue / BMI_THRESHOLDS.ob) * 100).toFixed(1))),
    date:    formatDate(prevPerf?.createdAt || null)
  } : null;

  // ── 5. Recommendations ─────────────────────────────────────────────────
  const recommendations = generateRecommendations(bmiRounded, weightKg, bmiLabel);

  // ── 6. Benchmark Table (for the PDF reference table) ───────────────────
  const benchmarkTable = Object.entries(studentBenchmarks).map(([key, bench]) => ({
    testName:   bench.label,
    unit:       bench.unit,
    thresholds: bench.thresholds,
    lowerIsBetter: bench.lowerIsBetter
  }));

  // ── Final Payload ───────────────────────────────────────────────────────
  return {
    studentInfo,
    currentMetrics,
    prevMetrics,
    fitnessScores,
    bmiBar,
    prevBmiBar,
    bmiLabel,
    bmiCategory,
    recommendations,
    benchmarkTable,
    term: currentPerf.term    || 'TERM-2',
    status: currentPerf.status || 'Present',
    generatedAt: formatDate(new Date())
  };
};

// ─── Group 1 (5-8 years) Payload Formatter ───────────────────────────────────

/**
 * Builds a PDF-ready payload for Group 1 students (age 5-8).
 * Tests: Plate Tapping (Coordination) + Flamingo Balance (Balance).
 *
 * @param {Object} student       - Raw Student document
 * @param {Object} currentPerf   - Current term Performance document
 * @param {Object|null} prevPerf - Previous term Performance (may be null)
 * @param {Object} institute     - { name, city, state }
 * @returns {Object}
 */
export const formatGroup1ReportPayload = (student, currentPerf, prevPerf = null, institute = {}) => {
  if (!student || !currentPerf) {
    throw new Error('formatGroup1ReportPayload: student and currentPerf are required.');
  }

  // ── Demographics ─────────────────────────────────────────────────────────
  const age    = computeAge(student.dob) || student.age || 0;
  const gender = student.gender || 'Male';
  const dobVal = student.dob || currentPerf?.studentId?.dob;
  const dobDisplay = dobVal ? formatDate(dobVal) : (age ? `Age ${age}` : 'N/A');

  const studentInfo = {
    name:   student.name      || 'N/A',
    class:  student.class     || 'N/A',
    regNo:  student.studentId || 'N/A',
    rollNo: student.rollNo    || (student.studentId || 'N/A'),
    gender: `${gender} / ${dobDisplay}`,
    dob:    dobDisplay,
    school: institute.name    || 'N/A',
    age
  };

  const cleanGender = gender.toLowerCase().includes('female') ? 'Female' : 'Male';

  // ── Physical Metrics ──────────────────────────────────────────────────────
  const heightCm   = currentPerf.height || 0;
  const weightKg   = currentPerf.weight || 0;
  const bmi        = currentPerf.bmi || calcBMI(heightCm, weightKg);
  const bmiRounded = parseFloat(bmi.toFixed(2));
  const { category: bmiCategory, label: bmiLabel } = getBMICategory(bmiRounded, age);

  const currentMetrics = {
    date:   formatDate(currentPerf.createdAt || new Date()),
    weight: weightKg > 0 ? `${weightKg} kg` : 'N/A',
    height: heightCm > 0 ? `${heightCm} cm` : 'N/A',
    bmi:    bmiRounded > 0 ? `${bmiRounded}` : 'N/A'
  };

  const prevMetrics = prevPerf ? {
    date:   formatDate(prevPerf.createdAt || null),
    weight: prevPerf.weight > 0 ? `${prevPerf.weight} kg`                       : 'N/A',
    height: prevPerf.height > 0 ? `${prevPerf.height} cm`                       : 'N/A',
    bmi:    prevPerf.bmi    > 0 ? `${parseFloat(prevPerf.bmi.toFixed(2))}`      : 'N/A'
  } : null;

  // ── Group 1 Test Scores ───────────────────────────────────────────────────
  const GROUP1_KEYS = ['plateTapping', 'flamingoBalance'];

  const getFitnessIndicatorG1 = (testKey, rawScore) => {
    const bench = BENCHMARKS.group1[cleanGender][testKey] || BENCHMARKS.group1Legacy[testKey];
    if (!bench || rawScore === null || rawScore === undefined || rawScore === '' || rawScore === 'N/A') {
      return { level: 'N/A', indicator: 'N/A', feedback: 'No data recorded for this test.' };
    }
    const numericScore = parseFloat(rawScore);
    if (isNaN(numericScore)) return { level: 'N/A', indicator: 'N/A', feedback: 'Invalid score format.' };

    const { thresholds, lowerIsBetter } = bench;
    let levelIndex;
    if (lowerIsBetter) {
      if      (numericScore > thresholds[0]) levelIndex = 0;
      else if (numericScore > thresholds[1]) levelIndex = 1;
      else if (numericScore > thresholds[2]) levelIndex = 2;
      else if (numericScore > thresholds[3]) levelIndex = 3;
      else if (numericScore > thresholds[4]) levelIndex = 4;
      else if (numericScore > thresholds[5]) levelIndex = 5;
      else                                   levelIndex = 6;
    } else {
      if      (numericScore <= thresholds[0]) levelIndex = 0;
      else if (numericScore <= thresholds[1]) levelIndex = 1;
      else if (numericScore <= thresholds[2]) levelIndex = 2;
      else if (numericScore <= thresholds[3]) levelIndex = 3;
      else if (numericScore <= thresholds[4]) levelIndex = 4;
      else if (numericScore <= thresholds[5]) levelIndex = 5;
      else                                    levelIndex = 6;
    }

    const level     = `L${levelIndex + 1}`;
    const levelInfo = LEVEL_LABELS[level];

    const feedbackMap = [
      'Performance is significantly below standard. Structured daily coordination practice is strongly recommended.',
      'Needs noticeable improvement. Regular practice and basic movement drills are advised.',
      'Below average. Consistent training and guided exercises can improve results.',
      'Good performance. Continue current activities and aim for steady improvement.',
      'Very good. Student shows strong motor skills for their age group.',
      'Athletic performance. Excellent physical development; advanced drills recommended.',
      'Exceptional! Sports-fit level reached. Student is ready for competitive-level activities.'
    ];

    return {
      level,
      indicator: levelInfo.label,
      color:     levelInfo.color,
      feedback:  feedbackMap[levelIndex]
    };
  };

  const formatScoreG1 = (testKey, rawScore) => {
    if (rawScore === null || rawScore === undefined || rawScore === '') return 'N/A';
    if (rawScore === 0 && testKey !== 'flamingoBalance') return 'N/A';
    const bench = BENCHMARKS.group1[cleanGender][testKey] || BENCHMARKS.group1Legacy[testKey];
    const unit  = bench?.unit || '';
    const n = parseFloat(rawScore);
    if (isNaN(n)) return 'N/A';
    if (n === 0 && testKey !== 'flamingoBalance') return 'N/A';
    return `${n} ${unit}`.trim();
  };

  const fitnessScores = GROUP1_KEYS.map((key) => {
    const bench       = BENCHMARKS.group1[cleanGender][key] || BENCHMARKS.group1Legacy[key];
    const currRaw     = currentPerf[key] ?? null;
    const prevRaw     = prevPerf?.[key]  ?? null;
    const currDisplay = formatScoreG1(key, currRaw);
    const prevDisplay = prevRaw !== null && prevRaw !== undefined ? formatScoreG1(key, prevRaw) : 'N/A';
    const { level, indicator, color, feedback } = getFitnessIndicatorG1(key, currRaw);

    return {
      testName:      bench.label,
      unit:          bench.unit,
      currentScore:  currDisplay,
      previousScore: prevDisplay,
      level,
      indicator,
      color,
      feedback
    };
  });

  // ── BMI Bar ───────────────────────────────────────────────────────────────
  const BMI_THRESHOLDS = { uw: 14.60, n: 17.20, ow: 20.20, ob: 23.20 };
  const bmiBarPercent  = bmiRounded > 0
    ? Math.min(100, parseFloat(((bmiRounded / BMI_THRESHOLDS.ob) * 100).toFixed(1)))
    : 0;
  const bmiBar = { value: bmiRounded, percent: bmiBarPercent, category: bmiCategory, label: bmiLabel, thresholds: BMI_THRESHOLDS };
  const prevBmiRaw   = prevPerf?.bmi || 0;
  const prevBmiValue = prevBmiRaw > 0 ? parseFloat(prevBmiRaw.toFixed(2)) : null;
  const prevBmiBar   = prevBmiValue ? {
    value:   prevBmiValue,
    percent: Math.min(100, parseFloat(((prevBmiValue / BMI_THRESHOLDS.ob) * 100).toFixed(1))),
    date:    formatDate(prevPerf?.createdAt || null)
  } : null;

  // ── Recommendations ───────────────────────────────────────────────────────
  const recommendations = generateRecommendations(bmiRounded, weightKg, bmiLabel);

  // ── Benchmark Table (Group 1 tests only) ─────────────────────────────────
  const benchmarkTable = Object.entries(BENCHMARKS.group1[cleanGender]).map(([key, bench]) => ({
    testName:      bench.label,
    unit:          bench.unit,
    thresholds:    bench.thresholds,
    lowerIsBetter: bench.lowerIsBetter
  }));

  return {
    studentInfo,
    currentMetrics,
    prevMetrics,
    fitnessScores,
    bmiBar,
    prevBmiBar,
    bmiLabel,
    bmiCategory,
    recommendations,
    benchmarkTable,
    ageGroup: 1,
    term: currentPerf.term || 'TERM-2',
    status: currentPerf.status || 'Present',
    generatedAt: formatDate(new Date())
  };
};

export default formatReportPayload;

// Named exports for unit-testing individual helpers
export {
  formatScore,
  getFitnessIndicator,
  getBMICategory,
  generateRecommendations,
  computeAge,
  calcBMI,
  BENCHMARKS,
  LEVEL_LABELS
};
