const express = require('express');
const router = express.Router();
const { addPerformance, getPerformanceByStudent } = require('../controllers/performanceController');
const { protect } = require('../middleware/auth');

router.post('/', protect, addPerformance);
router.get('/:studentId', protect, getPerformanceByStudent);

module.exports = router;
