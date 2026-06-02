const { Student, Performance, TestPerformance } = require('../models');

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Fix #10: Only create fields that actually exist in the Student schema.
// Previously referenced stale fields (age, bmi, bmiCategory, assignedSport, coachName, photoUrl)
// which are not in the model and were silently discarded by Mongoose.
exports.createStudent = async (req, res) => {
  try {
    const { studentId, name, dob, class: studentClass, gender, contact, address, taaluka, city, pincode } = req.body;

    const student = await Student.create({
      studentId, name, dob,
      class: studentClass,
      gender, contact, address, taaluka, city, pincode
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    // Fix #10: Only allow fields that exist in the Student schema
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

    const student = await Student.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Fix #9: Cascade-delete all performance/academic records for this student.
    // Previously, deleting a student left orphaned Performance and TestPerformance
    // documents, inflating dashboard statistics with ghost data.
    await Performance.deleteMany({ studentId: student._id });
    await TestPerformance.deleteMany({ studentId: student._id });

    res.json({ message: 'Student and all associated records removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
