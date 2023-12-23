const express = require('express');
// const socket = require('socket.io');
const { createServer } = require("http");
const { Server } = require("socket.io");

require('dotenv').config()

const app =  express();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})

//express server
const httpServer = createServer(app);
// web socket server
const io = new Server(httpServer, { 
    cors: {
        origin: "*",
        methods: ['GET', 'POST'],
        },
});

let peers = [];
const broadcastEventTypes = {
    ACTIVE_USERS: 'ACTIVE_USERS',
    GROUP_CALL_ROOMS: 'GROUP_CALL_ROOMS',
}

//callback function when client connects
io.on('connection', (socket) => {
    //emit to the user we just connected with the frontend application
    socket.emit('connection', null);
    //io provides unique id to the different users we are connecting with
    // console.log('User connected with id: ', socket.id);

    //event-listener
    socket.on('register-new-user', (data) => {
        peers.push({
            username: data.username,
            socketId: data.socketId
        })
        console.log('Registered new user', peers)
        
        //tell all the active users that there is a new joinee
        io.sockets.emit('broadcast', {
            event: broadcastEventTypes.ACTIVE_USERS,
            activeUsers: peers,
        });
    })
    
    //notify all when user leaves
    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
        peers = peers.filter(peer => peer.socketId !== socket.id);
        io.sockets.emit('broadcast', {
            event: broadcastEventTypes.ACTIVE_USERS,
            activeUsers: peers,
        });
    })

    //event listeners related to direct call
    socket.on('pre-offer', (data) => {
        console.log("Pre-offer handled");
        // caller sends details to callee
        io.to(data.callee.socketId).emit('pre-offer', {
            callerUsername: data.caller.username,
            callerSocketId: socket.id,
        })
    })
})

httpServer.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`)
});