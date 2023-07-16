import { io } from "socket.io-client";
import store from '../../store/store';
import * as dashboardActions from '../../store/actions/dashboardActions';

const socket = io("http://localhost:5000/");

const broadcastEventTypes = {
    ACTIVE_USERS: 'ACTIVE_USERS',
    GROUP_CALL_ROOMS: 'GROUP_CALL_ROOMS'
};

const connectWithWebSocket = () => {
    socket.on('connection', () => {
        console.log(socket.id);
    });

    socket.on('broadcast', (data) => {
      handleBroadcastEvents(data);
    });
}

export const registerNewUser = (username) => {
    socket.emit('register-new-user', {
      username: username,
      socketId: socket.id
    });
  };
  
const handleBroadcastEvents = (data) => {
  switch (data.event) {
    case broadcastEventTypes.ACTIVE_USERS:
      const activeUsers = data.activeUsers.filter(activeUser => activeUser.socketId !== socket.id);
      store.dispatch(dashboardActions.setActiveUsers(activeUsers));
      break;
    default:
      break;
  }
}

export default connectWithWebSocket;

