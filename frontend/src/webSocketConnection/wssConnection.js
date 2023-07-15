import { io } from "socket.io-client";
const socket = io("http://localhost:5000/");

const connectWithWebSocket = () => {
    socket.on('connection', () => {
        console.log(socket.id);
    });
}

export const registerNewUser = (username) => {
    socket.emit('register-new-user', {
        username: username,
        socketId: socket.id,
    })
}

export default connectWithWebSocket;

