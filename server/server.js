const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');

const app = express();

// Middleware
app.use(cors());
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
app.use('/api/notifications', require('./routes/notifications').router);

// Connect to Database
connectDB();

const DEFAULT_PORT = 5000;
const initialPort = Number(process.env.PORT) || DEFAULT_PORT;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.warn(`Port ${port} is in use, trying port ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error(error);
      process.exit(1);
    }
  });
}

startServer(initialPort);
