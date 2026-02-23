const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // Allow Next.js frontend to connect
    methods: ['GET', 'POST']
  }
});

let notifications = [];
let counter = 1;

// Generate a new notification every 3 seconds
setInterval(() => {
  const newNotification = {
    id: Date.now(),
    message: `Server update #${counter}`,
    timestamp: new Date().toISOString()
  };
  
  // Keep only the latest 10 notifications
  notifications.unshift(newNotification);
  if (notifications.length > 10) {
    notifications.pop();
  }

  counter++;

  // Push to all connected WebSocket clients
  io.emit('notification', newNotification);
}, 3000);

// HTTP Polling endpoint
app.get('/api/notifications', (req, res) => {
  res.json({
    success: true,
    data: notifications
  });
});

io.on('connection', (socket) => {
  console.log(`Client connected via WebSocket: ${socket.id}`);
  
  // Send the latest data immediately upon connection
  socket.emit('initialData', notifications);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Notification server is running on http://localhost:${PORT}`);
  console.log(`WebSocket server is ready for connections.`);
});
