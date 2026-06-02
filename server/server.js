const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');

const app = express();

// Fix #4: Restrict CORS to the configured frontend origin only
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/sports', require('./routes/sports'));
app.use('/api/performance', require('./routes/performance'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/institutes', require('./routes/institutes'));
app.use('/api/institute-portal', require('./routes/institutePortal'));
app.use('/api/notifications', require('./routes/notifications').router);

// Fix #24: Global error handler — catches any error thrown from middleware/routes
// and returns a consistent JSON response instead of crashing or leaking a stack trace.
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.message || err);

  // Multer file-type errors (thrown as strings or Errors)
  if (err && (err.message === 'Error: Images Only!' || err === 'Error: Images Only!'
    || err.message === 'Error: Only images and PDFs are allowed!')) {
    return res.status(400).json({ message: 'Invalid file type. Only images (and PDFs for marksheets) are allowed.' });
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
});

// Connect to Database
connectDB();

const DEFAULT_PORT = 5000;
const port = Number(process.env.PORT) || DEFAULT_PORT;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

server.on('error', (error) => {
  console.error('Server error:', error.message);
  process.exit(1);
});
