const { Student } = require('../models');

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

    // Fix #8: Explicit field whitelist to prevent mass-assignment (no raw req.body spread).
    // This prevents attackers from injecting fields like instituteId, __v, or _id.
    const { name, dob, class: studentClass, gender, contact, address, taaluka, city, pincode } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (dob !== undefined) updates.dob = dob;
    if (studentClass !== undefined) updates.class = studentClass;
    if (gender !== undefined) updates.gender = gender;
    if (contact !== undefined) updates.contact = contact;
    if (address !== undefined) updates.address = address;
    if (taaluka !== undefined) updates.taaluka = taaluka;
    if (city !== undefined) updates.city = city;
    if (pincode !== undefined) updates.pincode = pincode;

    const updated = await Student.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
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

// POST bulk promote students from source class to target class (scoped to institute)
exports.promoteStudents = async (req, res) => {
  try {
    const instituteId = req.user.instituteId;
    if (!instituteId) {
      return res.status(403).json({ message: 'No institute linked to your account' });
    }

    const { sourceClass, targetClass } = req.body;

    if (!sourceClass || !targetClass) {
      return res.status(400).json({ message: 'Source class and target class are required' });
    }

    if (sourceClass === targetClass) {
      return res.status(400).json({ message: 'Source and target classes must be different' });
    }

    const result = await Student.updateMany(
      { instituteId, class: sourceClass },
      { $set: { class: targetClass } }
    );

    res.json({
      message: `Successfully promoted students from Class ${sourceClass} to Class ${targetClass}`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




// GET class-wise student summary report
exports.getClassWiseReport = async (req, res) => {
  try {
    const instituteId = req.user.instituteId;
    if (!instituteId) {
      return res.status(403).json({ message: 'No institute linked to your account' });
    }

    const query = { instituteId };
    if (req.query.class) query.class = req.query.class;

    const students = await Student.find(query).sort({ class: 1, name: 1 });

    res.json({
      records: students,
      summary: {
        totalStudents: students.length
      }
    });
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

    res.json({
      classSummary: summary,
      totalStudents,
      totalClasses: summary.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
