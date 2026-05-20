const express = require('express');
const router = express.Router();
const { getInstitutes, getInstituteStudents, approveInstitute, rejectInstitute, getPendingCount } = require('../controllers/instituteController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getInstitutes);
router.get('/pending-count', protect, getPendingCount);
router.get('/:id/students', protect, getInstituteStudents);
router.put('/:id/approve', protect, approveInstitute);
router.put('/:id/reject', protect, rejectInstitute);

module.exports = router;
