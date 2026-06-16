const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Auth middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
      } catch (err) {
        // Allow unauthenticated connections for public features
        next();
      }
    } else {
      next();
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join role-based rooms
    if (socket.user) {
      if (socket.user.role === 'staff' || socket.user.role === 'admin') {
        socket.join('kitchen');
        socket.join('admin');
        console.log(`  → Joined kitchen & admin rooms`);
      }
    }

    // Customer joins their order tracking room
    socket.on('joinOrderRoom', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`  → Joined order room: order_${orderId}`);
    });

    socket.on('leaveOrderRoom', (orderId) => {
      socket.leave(`order_${orderId}`);
    });

    // Kitchen staff acknowledges order
    socket.on('acknowledgeOrder', (data) => {
      io.to(`order_${data.orderId}`).emit('orderAcknowledged', data);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

module.exports = { initSocket, getIO };
