const Institute = require('../models/Institute');
const Student = require('../models/Student');

// GET all institutes with pagination, search, and status filter
const getInstitutes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const totalCount = await Institute.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    const institutes = await Institute.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({ institutes, totalPages, currentPage: page, totalCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET students for a specific institute
const getInstituteStudents = async (req, res) => {
  try {
    const students = await Student.find({ instituteId: req.params.id });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT approve an institute
const approveInstitute = async (req, res) => {
  try {
    const institute = await Institute.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!institute) {
      return res.status(404).json({ message: 'Institute not found' });
    }
    res.json(institute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT reject an institute
const rejectInstitute = async (req, res) => {
  try {
    const institute = await Institute.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!institute) {
      return res.status(404).json({ message: 'Institute not found' });
    }
    res.json(institute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET count of pending institutes
const getPendingCount = async (req, res) => {
  try {
    const count = await Institute.countDocuments({ status: 'pending' });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getInstitutes, getInstituteStudents, approveInstitute, rejectInstitute, getPendingCount };
