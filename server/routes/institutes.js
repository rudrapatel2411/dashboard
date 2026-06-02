const express = require('express');
const router = express.Router();
const { getInstitutes, getInstituteStudents, approveInstitute, rejectInstitute, getPendingCount } = require('../controllers/instituteController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/', protect, getInstitutes);
router.get('/pending-count', protect, getPendingCount);
router.get('/:id/students', protect, getInstituteStudents);
// Fix #6: Approve/reject must require admin role — any institution must not be able to call these
router.put('/:id/approve', protect, requireRole('admin'), approveInstitute);
router.put('/:id/reject', protect, requireRole('admin'), rejectInstitute);

module.exports = router;
