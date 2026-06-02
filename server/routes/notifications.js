const express = require('express');
const router = express.Router();

// Track all active connection streams
let clients = [];

// SSE Route
router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Immediately write successful connection handshake
  res.write(`data: ${JSON.stringify({ status: 'connected', message: 'SSE Stream Active' })}\n\n`);

  clients.push(res);

  // Clear connection on disconnect (clean close)
  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

// Broadcast notification to all active browser tabs
const sendNotification = (title, message, type = 'info') => {
  const payload = JSON.stringify({
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title,
    message,
    type, // 'info', 'success', 'warning'
    timestamp: new Date()
  });

  // Fix #20: Remove stale clients immediately on write failure instead of accumulating them.
  // This prevents an ever-growing array of dead response objects (memory leak).
  const deadClients = [];
  clients.forEach(client => {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch (err) {
      deadClients.push(client);
    }
  });

  if (deadClients.length > 0) {
    clients = clients.filter(c => !deadClients.includes(c));
  }
};

module.exports = { 
  router, 
  sendNotification 
};
