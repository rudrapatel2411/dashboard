const { Student } = require('../models');

// Calculate BMI and Category
const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  let category = 'Normal';
  
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi >= 18.5 && bmi <= 24.9) category = 'Normal';
  else if (bmi >= 25 && bmi <= 29.9) category = 'Overweight';
  else if (bmi >= 30) category = 'Obese';
  
  return { bmi: parseFloat(bmi.toFixed(2)), category };
};

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

exports.createStudent = async (req, res) => {
  try {
    const { studentId, name, age, gender, height, weight, class: studentClass, contact, assignedSport, coachName } = req.body;
    
    let photoUrl = null;
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    const { bmi, category } = calculateBMI(parseFloat(weight), parseFloat(height));

    const student = await Student.create({
      studentId, name, age, gender, height, weight, bmi, bmiCategory: category,
      class: studentClass, contact, assignedSport, coachName, photoUrl
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { weight, height } = req.body;
    let updates = { ...req.body };

    if (weight && height) {
      const { bmi, category } = calculateBMI(parseFloat(weight), parseFloat(height));
      updates.bmi = bmi;
      updates.bmiCategory = category;
    }

    if (req.file) {
      updates.photoUrl = `/uploads/${req.file.filename}`;
    }

    const student = await Student.findByIdAndUpdate(req.params.id, updates, { new: true });
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

    res.json({ message: 'Student removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
