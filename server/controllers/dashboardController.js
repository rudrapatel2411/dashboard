const { Student, Performance } = require('../models');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalSports = 14; // Fixed number of sports for this system

    const allPerformance = await Performance.find();
    
    let totalScore = 0;
    allPerformance.forEach(p => totalScore += p.overallScore);
    const averagePerformance = allPerformance.length > 0 ? (totalScore / allPerformance.length).toFixed(2) : 0;

    // We can mock some data for the charts or aggregate real data
    const genderStats = await Student.aggregate([
      { $group: { _id: "$gender", count: { $sum: 1 } } },
      { $project: { gender: "$_id", count: 1, _id: 0 } }
    ]);

    res.json({
      totalStudents,
      totalSports,
      averagePerformance,
      genderStats,
      // adding mocked recent activities for UI purposes
      recentActivities: [
        { id: 1, action: "Term-1 performance added for John Doe", time: "2 hours ago" },
        { id: 2, action: "New student Jane Smith registered", time: "5 hours ago" }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
