const Institute = require('../models/Institute');
const Student = require('../models/Student');
const User = require('../models/User');

// GET all institutes with pagination, search, and status filter
const getInstitutes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const type = req.query.type || '';

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

    if (type) {
      query.type = type;
    }

    const totalCount = await Institute.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    const institutes = await Institute.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const institutesWithCount = await Promise.all(institutes.map(async (inst) => {
      const studentCount = await Student.countDocuments({ instituteId: inst._id });
      return {
        ...inst.toObject(),
        studentCount
      };
    }));

    res.json({ institutes: institutesWithCount, totalPages, currentPage: page, totalCount });
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

// PUT approve an institute — also approves the linked User account
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

    // Sync the linked User's approvalStatus
    if (institute.userId) {
      await User.findByIdAndUpdate(institute.userId, { approvalStatus: 'approved' });
    }

    // Send notification
    try {
      const { sendNotification } = require('../routes/notifications');
      sendNotification(
        "Institute Approved",
        `"${institute.name}" has been approved and can now access the institute portal.`,
        "success"
      );
    } catch (e) {
      // Silent catch
    }

    res.json(institute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT reject an institute — also rejects the linked User account
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

    // Sync the linked User's approvalStatus
    if (institute.userId) {
      await User.findByIdAndUpdate(institute.userId, { approvalStatus: 'rejected' });
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
