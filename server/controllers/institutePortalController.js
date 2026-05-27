const { Student, TestPerformance } = require('../models');

// --- Student Management (scoped to institute) ---

// GET students for the logged-in institute, optionally filtered by class
exports.getStudents = async (req, res) => {
  try {
    const instituteId = req.user.instituteId;
    if (!instituteId) {
      return res.status(403).json({ message: 'No institute linked to your account' });
    }

    const query = { instituteId };
    if (req.query.class) {
      query.class = req.query.class;
    }
    if (req.query.search) {
      const search = req.query.search;
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await Student.find(query).sort({ class: 1, name: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST add a student scoped to the logged-in institute
exports.addStudent = async (req, res) => {
  try {
    const instituteId = req.user.instituteId;
    if (!instituteId) {
      return res.status(403).json({ message: 'No institute linked to your account' });
    }

    const { 
      studentId, name, dob, class: studentClass, gender, contact,
      address, taaluka, city, pincode
    } = req.body;

    if (!studentId || !name || !dob || !studentClass || !gender || !contact || !address || !taaluka || !city || !pincode) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Check duplicate studentId within this institute
    const exists = await Student.findOne({ studentId, instituteId });
    if (exists) {
      return res.status(400).json({ message: 'A student with this ID already exists in your institute' });
    }

    const student = await Student.create({
      studentId, name, dob, class: studentClass, gender, contact,
      address, taaluka, city, pincode, instituteId
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT update a student (must belong to the institute)
exports.updateStudent = async (req, res) => {
  try {
    const instituteId = req.user.instituteId;
    const student = await Student.findOne({ _id: req.params.id, instituteId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found in your institute' });
    }

    const updates = { ...req.body };

    const updated = await Student.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE a student (must belong to the institute)
exports.deleteStudent = async (req, res) => {
  try {
    const instituteId = req.user.instituteId;
    const student = await Student.findOneAndDelete({ _id: req.params.id, instituteId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found in your institute' });
    }
    res.json({ message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- Test Performance ---

// POST add test performance (with optional marksheet image)
exports.addTestPerformance = async (req, res) => {
  try {
    const instituteId = req.user.instituteId;
    if (!instituteId) {
      return res.status(403).json({ message: 'No institute linked to your account' });
    }

    const { studentId, class: studentClass, examName, term, subjects, remarks } = req.body;

    if (!studentId || !studentClass || !examName || !term) {
      return res.status(400).json({ message: 'studentId, class, examName, and term are required' });
    }

    // Verify student belongs to this institute
    const student = await Student.findOne({ _id: studentId, instituteId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found in your institute' });
    }

    // Parse subjects if sent as JSON string (multipart form)
    let parsedSubjects = subjects;
    if (typeof subjects === 'string') {
      parsedSubjects = JSON.parse(subjects);
    }

    if (!parsedSubjects || !Array.isArray(parsedSubjects) || parsedSubjects.length === 0) {
      return res.status(400).json({ message: 'At least one subject with marks is required' });
    }

    let marksheetImageUrl = null;
    if (req.file) {
      marksheetImageUrl = `/uploads/marksheets/${req.file.filename}`;
    }

    const testPerformance = await TestPerformance.create({
      instituteId,
      studentId,
      class: studentClass,
      examName,
      term,
      subjects: parsedSubjects,
      marksheetImageUrl,
      remarks: remarks || ''
    });

    res.status(201).json(testPerformance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET test performance records filtered by institute, class, and/or term
exports.getTestPerformance = async (req, res) => {
  try {
    const instituteId = req.user.instituteId;
    if (!instituteId) {
      return res.status(403).json({ message: 'No institute linked to your account' });
    }

    const query = { instituteId };
    if (req.query.class) query.class = req.query.class;
    if (req.query.term) query.term = req.query.term;
    if (req.query.studentId) query.studentId = req.query.studentId;

    const records = await TestPerformance.find(query)
      .populate('studentId', 'name studentId class gender')
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET class-wise aggregated report
exports.getClassWiseReport = async (req, res) => {
  try {
    const instituteId = req.user.instituteId;
    if (!instituteId) {
      return res.status(403).json({ message: 'No institute linked to your account' });
    }

    const query = { instituteId };
    if (req.query.class) query.class = req.query.class;
    if (req.query.term) query.term = req.query.term;
    if (req.query.examName) query.examName = req.query.examName;

    const records = await TestPerformance.find(query)
      .populate('studentId', 'name studentId class gender')
      .sort({ class: 1, 'studentId.name': 1 });

    if (records.length === 0) {
      return res.json({
        records: [],
        summary: {
          totalStudents: 0,
          averagePercentage: 0,
          highestPercentage: 0,
          lowestPercentage: 0,
          passCount: 0,
          failCount: 0
        }
      });
    }

    // Compute summary stats
    const percentages = records.map(r => r.percentage || 0);
    const passCount = records.filter(r => (r.percentage || 0) >= 40).length;

    const summary = {
      totalStudents: records.length,
      averagePercentage: parseFloat((percentages.reduce((a, b) => a + b, 0) / percentages.length).toFixed(2)),
      highestPercentage: Math.max(...percentages),
      lowestPercentage: Math.min(...percentages),
      passCount,
      failCount: records.length - passCount
    };

    res.json({ records, summary });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET class-wise student count summary for dashboard
exports.getClassSummary = async (req, res) => {
  try {
    const instituteId = req.user.instituteId;
    if (!instituteId) {
      return res.status(403).json({ message: 'No institute linked to your account' });
    }

    const summary = await Student.aggregate([
      { $match: { instituteId: instituteId } },
      { $group: { _id: '$class', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const totalStudents = summary.reduce((acc, s) => acc + s.count, 0);
    const totalTests = await TestPerformance.countDocuments({ instituteId });

    res.json({
      classSummary: summary,
      totalStudents,
      totalClasses: summary.length,
      totalTests
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
