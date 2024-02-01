const express = require('express');
// const socket = require('socket.io');
const { createServer } = require("http");
const { Server } = require("socket.io");
// Express signalling server for group calls and answer to the group calls
const { ExpressPeerServer } = require('peer');
const groupCallHandler = require('./groupCallHandler');
const { v4: uuid4 } = require('uuid');

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
// Peer Server
const peerServer = ExpressPeerServer(httpServer, {
    debug: true,
});

app.use('/peerjs', peerServer);
groupCallHandler.createPeerServerListener(peerServer);

let peers = [];
let groupCallRooms = [];

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
        });
        console.log('Registered new user', peers);
        
        // Tell all the active users that there is a new joinee
        io.sockets.emit('broadcast', {
            event: broadcastEventTypes.ACTIVE_USERS,
            activeUsers: peers,
        });

        // Tell all the users about the group call rooms
        io.sockets.emit('broadcast', {
            event: broadcastEventTypes.GROUP_CALL_ROOMS,
            groupCallRooms,
        });
    });
    
    //notify all when user leaves
    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
        peers = peers.filter(peer => peer.socketId !== socket.id);
        io.sockets.emit('broadcast', {
            event: broadcastEventTypes.ACTIVE_USERS,
            activeUsers: peers,
        });
    });

    /* ___________________ event listeners related to direct call ________________________ */
    
    socket.on('pre-offer', (data) => {
        console.log("Pre-offer handled");
        // caller sends details to callee
        io.to(data.callee.socketId).emit('pre-offer', {
            callerUsername: data.caller.username,
            callerSocketId: socket.id,
        })
    });

    socket.on('pre-offer-answer', (data) => {
        console.log("Handled pre-offer answer");
        io.to(data.callerSocketId).emit('pre-offer-answer', {
            answer: data.answer
        })
    });

    socket.on('webRTC-offer', (data) => {
        console.log("Handled WebRTC offer");
        io.to(data.calleeSocketId).emit('webRTC-offer', {
            offer: data.offer,
        });
    }); 

    socket.on('webRTC-answer', (data) => {
        console.log("Handle webRTC Answer ");
        io.to(data.callerSocketId).emit('webRTC-answer', {
            answer: data.answer
        });
    });

    socket.on('ICE-candidate', (data) => {
        console.log("Handling ICE Candidates transfer");
        io.to(data.connectedUserSocketId).emit('ICE-candidate', {
            candidate: data.candidate,
        });
    });

    socket.on('user-hang-up', (data) => {
        console.log("Handling case when the user hangs up the call.");
        io.to(data.connectedUserSocketId).emit('user-hang-up');
    });
    
    /* ___________________ event listeners related to group call ________________________ */

    socket.on('register-group-call', (data) => {
        const roomId = uuid4();
        socket.join(roomId);

        const newGroupCallRoom = {
            peerId: data.peerId,
            hostName: data.username,
            socketId: socket.id,
            roomId: roomId,
        };
        groupCallRooms.push(newGroupCallRoom);

        io.sockets.emit('broadcast', {
            event: broadcastEventTypes.GROUP_CALL_ROOMS,
            groupCallRooms: groupCallRooms,
        });
    });

    socket.on('group-call-request', data => {
        io.to(data.roomId).emit('group-call-request', {
            peerId: data.peerId,
            streamId: data.streamId,
        });

        socket.join(data.roomId);
    });

    /* ____________________________________________________________________________________ */
})

httpServer.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`)
});