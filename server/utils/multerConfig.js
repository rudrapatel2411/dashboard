const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- Student photo uploads ---
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, 'student-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
});

// --- Marksheet image/PDF uploads ---
const marksheetDir = path.join(__dirname, '../uploads/marksheets');
if (!fs.existsSync(marksheetDir)) {
  fs.mkdirSync(marksheetDir, { recursive: true });
}

const marksheetStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, marksheetDir);
  },
  filename: function (req, file, cb) {
    cb(null, 'marksheet-' + Date.now() + path.extname(file.originalname));
  }
});

const marksheetUpload = multer({
  storage: marksheetStorage,
  limits: { fileSize: 10000000 }, // 10MB limit for higher-res scans
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /jpeg|jpg|png|webp|pdf|application\/pdf/.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Only images and PDFs are allowed!');
    }
  }
});

// --- Avatar image uploads ---
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
  }
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Images Only!'));
    }
  }
});

module.exports = upload;
module.exports.marksheetUpload = marksheetUpload;
module.exports.avatarUpload = avatarUpload;
