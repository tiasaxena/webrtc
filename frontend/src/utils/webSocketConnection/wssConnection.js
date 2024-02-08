//Define connection with web socket server

import {io} from 'socket.io-client';

import store from '../../store/store';
import * as dashboardActions from '../../store/actions/dashboardActions';
import * as webRTCHandler from '../webRTCHandler/webRTCHandler';
import * as webRTCGroupCallHandler
  from '../webRTCHandler/webRTCGroupCallHandler';

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
    case broadcastEventTypes.GROUP_CALL_ROOMS:
      const groupCallRooms = data.groupCallRooms.filter(room => room.socketId !== socket.id);
      const activeGroupCallRoomId = webRTCGroupCallHandler.checkActiveGroupCall();

      if(activeGroupCallRoomId) {
        const room = groupCallRooms.find(room => room.roomId === activeGroupCallRoomId);
        if(!room) {
          webRTCGroupCallHandler.clearGroupCallDataHelper();
        }
      }
      store.dispatch (dashboardActions.setGroupCalls (groupCallRooms));
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

  /* _________________________listeners related to direct call________________________________*/
  socket.on ('pre-offer', data => {
    webRTCHandler.handlePreOffer (data);
  });

  socket.on ('pre-offer-answer', data => {
    webRTCHandler.handlePreOfferAnswer (data);
  });

  socket.on ('webRTC-offer', data => {
    webRTCHandler.handleWebRTCOffer (data);
  });

  socket.on ('webRTC-answer', data => {
    webRTCHandler.handleWebRTCAnswer (data);
  });

  socket.on ('ICE-candidate', data => {
    webRTCHandler.handleICECandidate (data);
  });

  socket.on ('user-hang-up', () => {
    webRTCHandler.handleUserHangedUp ();
  });

  /* _________________________________________________________________________________________*/

  /* _________________________listeners related to group call________________________________*/
  socket.on ('group-call-join-request', data => {
    webRTCGroupCallHandler.connectToNewUser (data);
  });

  socket.on('group-call-user-left', data => {
    webRTCGroupCallHandler.removeInactiveStream(data)
  })

  /* _________________________________________________________________________________________*/
};

export const registerNewUser = username => {
  socket.emit ('register-new-user', {
    username: username,
    socketId: socket.id,
  });
};

// Emitting events to server related to group calls
// 1. Register group call
// 2. If the user wants to join a group call
// 3. When any user leaves the group call 

/* ______________________________________________________________________________________________ */

export const registerGroupCall = data => {
  socket.emit ('group-call-register', data);
};

export const userWantsToJoinGroupCall = data => {
  socket.emit ('group-call-join-request', data);
};

export const userLeftGroupCall = data => {
  socket.emit('group-call-user-left', data);
}

export const groupCallClosedByHost = data => {
  socket.emit('group-call-closed-by-host', data);
}

/* ______________________________________________________________________________________________ */

// Emitting events to server related to direct calling
// 1. Send Pre Offer
// 2. Pre Offer Answer
// 3. Send WebRTCOffer
// 4. Send WebRTAnswer
// 5. Send ICE Candidate
// 6. User Hangs Up

/* ______________________________________________________________________________________________ */

export const sendPreOffer = data => {
  socket.emit ('pre-offer', data);
};

export const sendPreOfferAnswer = data => {
  socket.emit ('pre-offer-answer', data);
};

export const sendWebRTCOffer = data => {
  socket.emit ('webRTC-offer', data);
};

export const sendWebRTCAnswer = data => {
  socket.emit ('webRTC-answer', data);
};

export const sendICECandidate = data => {
  socket.emit ('ICE-candidate', data);
};

export const sendUserHangedUp = data => {
  socket.emit ('user-hang-up', data);
};

/* ______________________________________________________________________________________________ */

export default connectWithWebSocket;
