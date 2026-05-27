const express = require('express');
const router = express.Router();
const { addPerformance, getPerformanceByStudent, getAllPerformances } = require('../controllers/performanceController');
const { protect } = require('../middleware/auth');

router.post('/', protect, addPerformance);
router.get('/', protect, getAllPerformances);
router.get('/:studentId', protect, getPerformanceByStudent);

module.exports = router;
