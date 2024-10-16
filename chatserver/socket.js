module.exports = {
    connect: function(io, PORT) {
        const channels = ["channel1", "channel2", "channel3", "channel4"];
        const socketChannel = [];
        const socketChannelnum = [];

        const chat = io.of('/chat');

        chat.on('connection', (socket) => {
            socket.emit('channellist', JSON.stringify(channels));

            socket.on('message', (message) => {
                for (let i = 0; i < socketChannel.length; i++) {
                    if (socketChannel[i][0] === socket.id) {
                        chat.to(socketChannel[i][1]).emit('message', message);
                    }
                }
            });

            socket.on('newchannel', (newchannel) => {
                if (!channels.includes(newchannel)) {
                    channels.push(newchannel);
                    chat.emit('channellist', JSON.stringify(channels));
                }
            });

            socket.on('channellist', () => {
                chat.emit('channellist', JSON.stringify(channels));
            });

            socket.on('numusers', (channel) => {
                let usercount = 0;

                for (let i = 0; i < socketChannelnum.length; i++) {
                    if (socketChannelnum[i][0] === channel) {
                        usercount = socketChannelnum[i][1];
                    }
                }

                chat.in(channel).emit('numusers', usercount);
            });

            socket.on("joinChannel", (channel) => {
                if (channels.includes(channel)) {
                    socket.join(channel, () => {
                        let inChannelSocketArray = false;

                        for (let i = 0; i < socketChannel.length; i++) {
                            if (socketChannel[i][0] === socket.id) {
                                socketChannel[i][1] = channel;
                                inChannelSocketArray = true;
                            }
                        }

                        if (!inChannelSocketArray) {
                            socketChannel.push([socket.id, channel]);
                            let hasChannelNum = false;

                            for (let j = 0; j < socketChannelnum.length; j++) {
                                if (socketChannelnum[j][0] === channel) {
                                    socketChannelnum[j][1] += 1;
                                    hasChannelNum = true;
                                }
                            }

                            if (!hasChannelNum) {
                                socketChannelnum.push([channel, 1]);
                            }
                        }

                        chat.in(channel).emit("notice", "A new user has joined");
                    });

                    return chat.in(channel).emit("joined", channel);
                }
            });


            socket.on('disconnect', () => {
                for (let i = 0; i < socketChannel.length; i++) {
                    if (socketChannel[i][0] === socket.id) {
                        socketChannel.splice(i, 1);
                    }
                }

                for (let j = 0; j < socketChannelnum.length; j++) {
                    if (socketChannelnum[j][0] === socketChannel[j][1]) {
                        socketChannelnum[j][1] -= 1;
                    }
                }

                chat.emit("disconnect");
                console.log("Client disconnected");
            });
        });
    }
}
