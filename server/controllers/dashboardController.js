const { Student, Performance, Institute } = require('../models');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalInstitutes = await Institute.countDocuments();
    const pendingCount = await Institute.countDocuments({ status: 'pending' });
    const totalSports = 14; // Fixed number of sports for this system

    const allPerformance = await Performance.find();
    
    let totalScore = 0;
    allPerformance.forEach(p => totalScore += p.overallScore);
    const averagePerformance = allPerformance.length > 0 ? (totalScore / allPerformance.length).toFixed(1) : 0;

    // We can mock some data for the charts or aggregate real data
    const genderStats = await Student.aggregate([
      { $group: { _id: "$gender", count: { $sum: 1 } } },
      { $project: { gender: "$_id", count: 1, _id: 0 } }
    ]);

    res.json({
      totalStudents,
      totalInstitutes,
      pendingCount,
      totalSports,
      averagePerformance,
      genderStats,
      // TODO #26: Implement a real ActivityLog collection and populate recent activities from DB.
      // For now, returning empty array to avoid showing misleading hardcoded fake data.
      recentActivities: []
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
