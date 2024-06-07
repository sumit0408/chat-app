const socketIo = require('socket.io');

module.exports = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: '*',
        },
    });
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
};
