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
const io = new Server(httpServer, { 
    cors: {
        origin: "*",
        methods: ['GET', 'POST'],
        },
 });

//websocket server
// const io = socket((server, {
//     cors: {
//         origin: "*",
//         methods: ['GET', 'POST'],
//     },
// }))

//callback function when client connects
io.on('connection', (socket) => {
    //emit to the user we just connected with the frontend application
    socket.emit('connection', null);
    //io provides unique id to the diffreent users we are connecting with
    console.log('User connected with id: ', socket.id);
})

httpServer.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`)
});