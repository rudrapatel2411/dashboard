const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const sportsList = [
  "Cricket", "Football", "Volleyball", "Basketball", "Kabaddi", 
  "Badminton", "Athletics", "Swimming", "Tennis", "Hockey", 
  "Table Tennis", "Wrestling", "Kho Kho", "Gymnastics"
];

router.get('/', protect, (req, res) => {
  res.json(sportsList);
});

module.exports = router;
