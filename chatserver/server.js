const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const sockets = require('./socket.js');
const server = require('./listen.js');

// Middleware setup
app.use(express.json());
app.use(cors());

const PORT = 3000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/chatserver')
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Define Channel Schema
const channelSchema = new mongoose.Schema({
    name: String,
    users: Array 
});

const Channel = mongoose.model('Channel', channelSchema);

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

// Socket handling for channels
sockets.connect(io, PORT);
server.listen(http, PORT);

// Handle socket connections
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Fetch the list of channels from MongoDB
    Channel.find({}, (err, channels) => {
        if (err) return console.error(err);
        socket.emit('channellist', JSON.stringify(channels.map(c => c.name)));
    });

    // User joins a channel
    socket.on('joinChannel', (channelName) => {
        Channel.findOne({ name: channelName }, (err, channel) => {
            if (err) return console.error(err);

            if (channel) {
                // Add the user to the channel's users list
                channel.users.push(socket.id);
                channel.save();

                socket.join(channelName);
                console.log(`User ${socket.id} joined channel ${channelName}`);

                // Notify others in the channel
                socket.to(channelName).emit('joined', { user: socket.id, channel: channelName });
            } else {
                console.log(`Channel ${channelName} not found`);
            }
        });
    });

    // User leaves a channel
    socket.on('leaveChannel', (channelName) => {
        socket.leave(channelName);
        console.log(`User ${socket.id} left channel ${channelName}`);

        // Remove the user from the channel's users list in MongoDB
        Channel.updateOne(
            { name: channelName },
            { $pull: { users: socket.id } },  // MongoDB $pull to remove the user from array
            (err) => {
                if (err) return console.error(err);
                console.log(`User ${socket.id} removed from channel ${channelName}`);
            }
        );

        // Notify others in the channel
        socket.to(channelName).emit('left', { user: socket.id, channel: channelName });
    });

    // Handle sending messages to a channel
    socket.on('message', (messageData) => {
        const { channel, message } = messageData;
        console.log(`Message from ${socket.id} in channel ${channel}: ${message}`);

        // Broadcast the message to others in the same channel
        socket.to(channel).emit('message', { user: socket.id, message });
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);

        // Remove the user from all channels in MongoDB
        Channel.updateMany(
            { users: socket.id },
            { $pull: { users: socket.id } },  // MongoDB $pull to remove the user from all channels
            (err) => {
                if (err) return console.error(err);
                console.log(`User ${socket.id} removed from all channels`);
            }
        );
    });
});

module.exports = {
    connect: function(io, PORT) {
        const chat = io.of('/chat');

        chat.on('connection', (socket) => {
            // Send the list of channels to the client
            Channel.find({}, (err, channels) => {
                if (err) return console.error(err);
                socket.emit('channellist', JSON.stringify(channels.map(c => c.name)));
            });

            socket.on('message', (message) => {
                const { channel, content } = message;
                chat.to(channel).emit('message', { user: socket.id, content });
            });

            socket.on('newchannel', (newchannel) => {
                Channel.findOne({ name: newchannel }, (err, channel) => {
                    if (err) return console.error(err);
                    
                    if (!channel) {
                        const newChannel = new Channel({ name: newchannel, users: [] });
                        newChannel.save((err) => {
                            if (err) return console.error(err);
                            chat.emit('channellist', JSON.stringify([...channels, newchannel]));
                        });
                    }
                });
            });

            socket.on('disconnect', () => {
                Channel.updateMany(
                    { users: socket.id },
                    { $pull: { users: socket.id } },  // MongoDB $pull to remove user
                    (err) => {
                        if (err) return console.error(err);
                        console.log(`User ${socket.id} removed from all channels`);
                    }
                );
            });
        });
    }
};
