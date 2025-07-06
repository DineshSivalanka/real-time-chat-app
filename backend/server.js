const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
const Message = require('./models/messages');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// ✅ MongoDB Atlas Connection
mongoose.connect('mongodb+srv://chatuser:chatpassword123@cluster0.cbrwy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB Atlas');
}).catch(err => {
  console.error('❌ MongoDB Error:', err);
});

// ✅ Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ Socket.IO Chat Handling
io.on('connection', async (socket) => {
  let currentUser = {};

  const history = await Message.find().sort({ timestamp: 1 }).limit(50);
  socket.emit('chat history', history);

  socket.on('join', (data) => {
    currentUser = data;
    console.log(`${data.username} joined`);
  });

  socket.on('chat message', async (data) => {
    const newMsg = new Message(data);
    await newMsg.save();

    io.emit('chat message', data);
  });

  socket.on('disconnect', () => {
    console.log(`${currentUser.username || 'User'} disconnected`);
  });
});

server.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
