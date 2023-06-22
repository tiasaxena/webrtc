import { io } from "socket.io-client";
const socket = io("http://localhost:5000/");

const connectWithWebSocket = () => {
    socket.on('connection', () => {
        console.log(socket.id); // true
    });
}

export default connectWithWebSocket;