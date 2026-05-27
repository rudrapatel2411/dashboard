const { Performance, Student } = require('../models');

const generateAiInsight = (metrics, term) => {
  const { speed, strength, stamina, agility, endurance } = metrics;
  let insight = `Performance analysis for ${term}: `;
  if (stamina > 85) insight += "Student shows excellent stamina. ";
  else if (stamina < 50) insight += "Needs improvement in stamina. ";

  if (agility < 50) insight += "Agility score is relatively low. ";
  
  if (endurance < 50) insight += "Needs improvement in endurance. ";
  else if (endurance > 85) insight += "Excellent endurance levels. ";

  return insight || "Consistent performance across metrics.";
};

exports.addPerformance = async (req, res) => {
  try {
    const { 
      studentId, term, status, height, weight, 
      plateTapping, flamingoBalance, partialCurlUp, pushups, sitAndReach, runWalk600m, run50m,
      manualReportData, reportHardCopyUrl,
      attendance, discipline, matchPerformance
    } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const isAbsent = status === 'Absent';

    // Calculate age and ageGroup
    const dob = new Date(student.dob);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    const ageGroup = (age >= 5 && age <= 8) ? 1 : 2;

    // Derived metrics
    let speed = 0, strength = 0, stamina = 0, agility = 0, flexibility = 0, accuracy = 0, endurance = 0, reactionTime = 0;
    let bmi = 0;
    let recommendedSport = "N/A";

    if (!isAbsent) {
      const heightNum = parseFloat(height) || 160;
      const weightNum = parseFloat(weight) || 50;
      bmi = parseFloat((weightNum / ((heightNum / 100) * (heightNum / 100))).toFixed(1));

      if (ageGroup === 1) {
        // Group 1: Under 5-8 yrs
        const tap = parseFloat(plateTapping) || 15;
        const flam = parseFloat(flamingoBalance) || 10;

        speed = Math.min(100, Math.max(30, Math.round(150 - tap * 6)));
        strength = Math.min(100, Math.max(30, Math.round(30 + flam * 3.5)));
        stamina = Math.min(100, Math.max(30, Math.round(35 + flam * 3)));
        agility = Math.min(100, Math.max(30, Math.round(140 - tap * 5.5)));
        flexibility = 65;
        accuracy = 60;
        endurance = Math.min(100, Math.max(30, Math.round(40 + flam * 2)));
        reactionTime = Math.min(100, Math.max(30, Math.round(135 - tap * 5)));

        recommendedSport = (tap < 12 && flam > 15) 
          ? "Gymnastics & Ballet (High Balance & Coordination)" 
          : "General Athletics & Coordination Drills";
      } else {
        // Group 2: Under 9-18 yrs
        const sprint = parseFloat(run50m) || 9.5;
        const push = parseInt(pushups) || 15;
        const curl = parseInt(partialCurlUp) || 20;
        const sitReach = parseFloat(sitAndReach) || 15;

        let runWalkSeconds = 150;
        if (runWalk600m && typeof runWalk600m === 'string' && runWalk600m.includes(':')) {
          const parts = runWalk600m.split(':');
          runWalkSeconds = (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0);
        } else if (runWalk600m) {
          runWalkSeconds = parseFloat(runWalk600m) || 150;
        }

        speed = Math.min(100, Math.max(30, Math.round(160 - sprint * 10)));
        strength = Math.min(100, Math.max(30, Math.round(35 + (push + curl) * 0.8)));
        stamina = Math.min(100, Math.max(30, Math.round(160 - runWalkSeconds * 0.45)));
        agility = Math.min(100, Math.max(30, Math.round(145 - sprint * 8)));
        flexibility = Math.min(100, Math.max(30, Math.round(40 + sitReach * 2)));
        accuracy = Math.min(100, Math.max(30, Math.round(45 + push * 1.2)));
        endurance = Math.min(100, Math.max(30, Math.round(155 - runWalkSeconds * 0.4)));
        reactionTime = Math.min(100, Math.max(30, Math.round(150 - sprint * 9)));

        if (sprint < 8.0 && runWalkSeconds < 120) {
          recommendedSport = "Athletics (Track & Field)";
        } else if (push > 25 && curl > 25) {
          recommendedSport = "Gymnastics, Wrestling & Combat Sports";
        } else if (sitReach > 25 && sprint < 9.0) {
          recommendedSport = "Badminton, Tennis & Agility Sports";
        } else if (runWalkSeconds < 140) {
          recommendedSport = "Football, Basketball & Hockey";
        } else {
          recommendedSport = "Cricket, Archery & Shooting";
        }
      }
    }

    const finalAttendance = parseFloat(attendance) || (isAbsent ? 0 : 90);
    const finalDiscipline = parseFloat(discipline) || (isAbsent ? 0 : 8);
    const finalMatchPerf = parseFloat(matchPerformance) || (isAbsent ? 0 : 80);

    const totalMetrics = 6;
    const overallScore = isAbsent ? 0 : (speed + strength + stamina + agility + accuracy + endurance) / totalMetrics;
    
    let fitnessLevel = 'Poor';
    if (!isAbsent) {
      if (overallScore >= 90) fitnessLevel = 'Excellent';
      else if (overallScore >= 75) fitnessLevel = 'Good';
      else if (overallScore >= 50) fitnessLevel = 'Average';
    }

    const aiInsight = isAbsent 
      ? "Student was absent on physical evaluation day."
      : generateAiInsight({ speed, strength, stamina, agility, endurance }, term);

    // Save or update Performance record
    let performance = await Performance.findOne({ studentId, term });
    const performanceData = {
      studentId, term, speed, strength, stamina, agility, flexibility, accuracy, endurance, reactionTime,
      attendance: finalAttendance, discipline: finalDiscipline, matchPerformance: finalMatchPerf,
      overallScore: parseFloat(overallScore.toFixed(2)), fitnessLevel, aiInsight,
      status, ageGroup, height: isAbsent ? 0 : parseFloat(height), weight: isAbsent ? 0 : parseFloat(weight), bmi,
      plateTapping: isAbsent ? 0 : parseFloat(plateTapping),
      flamingoBalance: isAbsent ? 0 : parseFloat(flamingoBalance),
      partialCurlUp: isAbsent ? 0 : parseInt(partialCurlUp),
      pushups: isAbsent ? 0 : parseInt(pushups),
      sitAndReach: isAbsent ? 0 : parseFloat(sitAndReach),
      runWalk600m: isAbsent ? '' : runWalk600m,
      run50m: isAbsent ? 0 : parseFloat(run50m),
      recommendedSport, manualReportData, reportHardCopyUrl
    };

    if (performance) {
      performance.set(performanceData);
      await performance.save();
    } else {
      performance = await Performance.create(performanceData);
    }

    res.status(201).json(performance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPerformanceByStudent = async (req, res) => {
  try {
    const performance = await Performance.find({ studentId: req.params.studentId });
    res.json(performance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllPerformances = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'institution') {
      const students = await Student.find({ instituteId: req.user.instituteId }).select('_id');
      const studentIds = students.map(s => s._id);
      query.studentId = { $in: studentIds };
    }
    if (req.query.term) {
      query.term = req.query.term;
    }
    const performances = await Performance.find(query).populate('studentId', 'name studentId class dob gender');
    res.json(performances);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
