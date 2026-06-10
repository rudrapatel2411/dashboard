const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  promoteStudents,
  getClassWiseReport,
  getClassSummary
} = require('../controllers/institutePortalController');

// All routes require authentication + institution role
router.use(protect, requireRole('institution'));

// Student management
router.get('/students', getStudents);
router.post('/students', addStudent);
router.post('/students/promote', promoteStudents);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// Reports
router.get('/reports', getClassWiseReport);

// Dashboard summary
router.get('/dashboard-summary', getClassSummary);

module.exports = router;
