import store from '../../store/store';
import {
  callStates,
  setCallState,
  setCallerUsername,
  setCallingDialogVisible,
  setLocalStream,
} from '../../store/actions/callActions';
import * as wss from '../webSocketConnection/wssConnection';

const DEFAULT_CONSTRAINTS = {
  video: true,
  audio: true,
};

export const getLocalStream = () => {
  //* getDisplayMedia() method prompts the user to select and grant permission to capture the contents of a display. It returns MediaStream object which can be transmitted to other peer using WebRTC.
  navigator.mediaDevices
    .getUserMedia (DEFAULT_CONSTRAINTS)
    .then (stream => {
      store.dispatch (setLocalStream (stream));
      store.dispatch (setCallState (callStates.CALL_AVAILABLE));
    })
    .catch (error => {
      console.log ('Failed to fetch the user video');
      console.log (error);
    });
};

let connectedUserSocketId;

// Function to call other users
// calleeDetails will be obtained from the active user list items
export const callToOtherUser = calleeDetails => {
  connectedUserSocketId = calleeDetails.socketId;
  // dispatch to set the call stae in progress
  store.dispatch (setCallState (callStates.CALL_IN_PROGRESS));
  store.dispatch (setCallingDialogVisible (true));

  // send the pre-offer using the signalling server
  wss.sendPreOffer ({
    callee: calleeDetails,
    caller: {
      username: store.getState().mainReducer.dashboard.username,
    },
  });
};

export const handlePreOffer = data => {
  connectedUserSocketId = data.callerSocketId;
  store.dispatch (setCallerUsername (data.callerUsername));
  store.dispatch (setCallState (callStates.CALL_REQUESTED));
};
