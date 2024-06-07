const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const Message = require('./models/Message');
const User = require('./models/User');

dotenv.config();

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    },
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected');
        server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.log(err));

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '..', 'client', 'public')));

// Your socket.io code
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', ({ userId, room }) => {
        socket.join(room);
        console.log(`${userId} joined room: ${room}`);
    });

    socket.on('sendMessage', async ({ room, senderId, content }) => {
        try {
            const message = new Message({ sender: senderId, content, room });
            await message.save();
            const populatedMessage = await Message.findById(message._id).populate('sender', 'username').exec();
            io.to(room).emit('message', populatedMessage);
        } catch (error) {
            console.error('Error sending message:', error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Add API routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Handle any other requests with an error or 404 message
app.get('*', (req, res) => {
    res.status(404).send('Page not found');
});
