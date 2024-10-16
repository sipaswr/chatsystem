const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const sockets = require('./socket.js');
const server = require('./listen.js');
const request = require('request');

const PORT = 3000;

let users = [];

// Create User API
app.post('/api/users', (req, res) => {
    const { username, email } = req.body;

    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    const newUser = { id: Date.now(), username, email };
    users.push(newUser);
    return res.status(201).json({ message: 'User created successfully', user: newUser });
});

// Remove User API
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    users = users.filter(user => user.id !== parseInt(id));

    return res.status(200).json({ message: 'User removed successfully' });
});

app.get('/', (req, res) => {
    res.send('Welcome to the Chat Server!');
});

    
app.use(cors());
sockets.connect(io, PORT);
server.listen(http,PORT)

// Add this to the bottom of server.js (without modifying or removing anything above)

// Handle socket connections
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    

    // User joins a channel
    socket.on('joinChannel', (channel) => {
        socket.join(channel);
        console.log(`User ${socket.id} joined channel ${channel}`);
        
        // Notify others in the channel
        socket.to(channel).emit('joined', { user: socket.id, channel });
    });

    // User leaves a channel
    socket.on('leave-channel', (channel) => {
        socket.leave(channel);
        console.log(`User ${socket.id} left channel ${channel}`);
        
        // Notify others in the channel
        socket.to(channel).emit('left', { user: socket.id, channel });
    });

    // Handle sending messages
    socket.on('message', (messageData) => {
        const { channel, message } = messageData;
        console.log(`Message from ${socket.id} in channel ${channel}: ${message}`);
        
        // Broadcast the message to others in the same channel
        socket.to(channel).emit('message', { user: socket.id, message });
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

