const express = require('express');
const socket = require('socket.io');

require('dotenv').config()

const app =  express();

//express server
app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port: ${process.env.PORT}`)
})

//websocket server
const io = socket((server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST'],
    },
}))

//callback function when client connects
io.on('connection', (socket) => {
    //emit to the user we just connected with the frontend application
    socket.emit('connection', null);
    //io provides unique id to the diffreent users we are connecting with
    console.log('User connected with id: ', socket.io);
})