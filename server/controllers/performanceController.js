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
    const { studentId, term, speed, strength, stamina, agility, flexibility, accuracy, endurance, reactionTime, attendance, discipline, matchPerformance } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Check if performance for term already exists
    const existing = await Performance.findOne({ studentId, term });
    if (existing) return res.status(400).json({ message: `Performance for ${term} already exists` });

    const totalMetrics = 6; // Speed + Strength + Stamina + Agility + Accuracy + Endurance as per requirement
    const overallScore = (parseInt(speed) + parseInt(strength) + parseInt(stamina) + parseInt(agility) + parseInt(accuracy) + parseInt(endurance)) / totalMetrics;
    
    let fitnessLevel = 'Poor';
    if (overallScore >= 90) fitnessLevel = 'Excellent';
    else if (overallScore >= 75) fitnessLevel = 'Good';
    else if (overallScore >= 50) fitnessLevel = 'Average';

    const aiInsight = generateAiInsight({ speed, strength, stamina, agility, endurance }, term);

    const performance = await Performance.create({
      studentId, term, speed, strength, stamina, agility, flexibility, accuracy, endurance, reactionTime, attendance, discipline, matchPerformance,
      overallScore: parseFloat(overallScore.toFixed(2)), fitnessLevel, aiInsight
    });

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
