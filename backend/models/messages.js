const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  username: String,
  avatar: String,
  message: String,
  image: String,
  audio: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
