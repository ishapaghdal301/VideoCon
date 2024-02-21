const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const testRouter = require('./testRouter');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/testDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use('/api', testRouter);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('codeChange', (newCode) => {
    socket.broadcast.emit('codeChange', newCode);
  });

  socket.on('inputChange', (newInput) => {
    console.log('input change');
    socket.broadcast.emit('inputChange', newInput);
  });

  socket.on('outputChange', (newOutput) => {
    console.log('output change');
    socket.broadcast.emit('outputChange', newOutput);
  });

  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
