const express = require('express');
const router = express.Router();
const { getStudents, getStudentById, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const { protect } = require('../middleware/auth');
const upload = require('../utils/multerConfig');

router.route('/')
  .get(protect, getStudents)
  .post(protect, upload.single('photo'), createStudent);

router.route('/:id')
  .get(protect, getStudentById)
  .put(protect, upload.single('photo'), updateStudent)
  .delete(protect, deleteStudent);

module.exports = router;
