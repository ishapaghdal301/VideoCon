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


app.post('/compile', async (req, res) => {
  try {
    const { code, language, input } = req.body;
    const clientId = '8bdb62745746f7fdcef1b24e7ee1d468';
    const clientSecret = 'e7beba5c6cf30b5dc76098acb5570f0a838220ed89a6cdeaf347266909e4796a';
    const apiURL = 'https://api.jdoodle.com/v1/execute';

    const response = await axios.post(apiURL, {
      clientId: clientId,
      clientSecret: clientSecret,
      script: code,
      language: language,
      versionIndex: '0',
      stdin: input
    });

    if (response.status === 200) {
      const responseData = response.data;
      if ('output' in responseData) {
        res.status(200).json({ output: responseData.output });
      } else if ('error' in responseData) {
        res.status(400).json({ error: responseData.error });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    } else {
      res.status(500).json({ error: 'Failed to execute code' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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
