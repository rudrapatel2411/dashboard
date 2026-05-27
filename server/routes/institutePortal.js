const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const upload = require('../utils/multerConfig');
const { marksheetUpload } = require('../utils/multerConfig');
const {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  addTestPerformance,
  getTestPerformance,
  getClassWiseReport,
  getClassSummary
} = require('../controllers/institutePortalController');

// All routes require authentication + institution role
router.use(protect, requireRole('institution'));

// Student management
router.get('/students', getStudents);
router.post('/students', addStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// Test performance
router.post('/test-performance', marksheetUpload.single('marksheet'), addTestPerformance);
router.get('/test-performance', getTestPerformance);

// Reports
router.get('/reports', getClassWiseReport);

// Dashboard summary
router.get('/dashboard-summary', getClassSummary);

module.exports = router;
