//Define connection with web socket server

import {io} from 'socket.io-client';
import store from '../../store/store';
import * as dashboardActions from '../../store/actions/dashboardActions';
import * as webRTCHandler from '../webRTCHandler/webRTCHandler';

const socket = io ('http://localhost:5000/');

const broadcastEventTypes = {
  ACTIVE_USERS: 'ACTIVE_USERS',
  GROUP_CALL_ROOMS: 'GROUP_CALL_ROOMS',
};

const handleBroadcastEvents = data => {
  switch (data.event) {
    case broadcastEventTypes.ACTIVE_USERS:
      const activeUsers = data.activeUsers.filter (
        activeUser => activeUser.socketId !== socket.id
      );
      store.dispatch (dashboardActions.setActiveUsers (activeUsers));
      break;
    default:
      break;
  }
};

const connectWithWebSocket = () => {
  socket.on ('connection', () => {
    console.log ('connection socket id', socket.id);
  });

  socket.on ('broadcast', data => {
    handleBroadcastEvents (data);
  });

  //listeners related to direct call
  socket.on('pre-offer', (data) => {
    webRTCHandler.handlePreOffer(data);
  })
};

export const registerNewUser = username => {
  socket.emit ('register-new-user', {
    username: username,
    socketId: socket.id,
  });
};

// Emitting events to server related to direct calling
// 1. Send Pre Offer
// 2. Pre Offer Answer

/* ______________________________________________________________________________________________ */

export const sendPreOffer = (data) => {
  socket.emit('pre-offer', data);
}

export const sendPreOfferAnswer = (data) => {
  socket.emit('pre-offer-answer', data);
}

/* ______________________________________________________________________________________________ */

export default connectWithWebSocket;
