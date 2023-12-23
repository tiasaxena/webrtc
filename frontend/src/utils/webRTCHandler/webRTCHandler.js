import store from '../../store/store';
import {
  callStates,
  setCallRejected,
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

// pre-offer answers
const preOfferAnswers = {
  CALL_REJECTED: 'CALL_REJECTED',
  CALL_ACCEPTED: 'CALL_ACCEPTED',
  // if we don't get access to the local stream or the call state is different froms call avilable
  CALL_NOT_AVAILABLE: 'CALL_NOT_AVAILABLE',
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
// calleeDetails is actually the activeuser arguemnt passed while invoking the function
export const callToOtherUser = calleeDetails => {
  connectedUserSocketId = calleeDetails.socketId;
  // dispatch to set the call state in progress
  store.dispatch (setCallState (callStates.CALL_IN_PROGRESS));
  store.dispatch (setCallingDialogVisible (true));

  // send the pre-offer using the signalling server
  wss.sendPreOffer ({
    callee: calleeDetails,
    caller: {
      username: store.getState ().mainReducer.dashboard.username,
    },
  });
};

export const handlePreOffer = data => {
  if (checkIfCallIsPossible ()) {
    // update the store
    connectedUserSocketId = data.callerSocketId;
    store.dispatch (setCallerUsername (data.callerUsername));
    store.dispatch (setCallState (callStates.CALL_REQUESTED));
  } else {
    wss.sendPreOfferAnswer ({
      callerSocketId: data.callerSocketId,
      answer: preOfferAnswers.CALL_NOT_AVAILABLE,
    });
  }
};

export const handlePreOfferAnswer = data => {
  store.dispatch(setCallingDialogVisible(false));
  
  if (data.answer === preOfferAnswers.CALL_ACCEPTED) {
    //send pre-offer web RTC answer
  } else {
    let rejectionReason;
    if (data.answer === preOfferAnswers.CALL_NOT_AVAILABLE) {
      rejectionReason = 'Not available for the call at the moment!';
    } else {
      rejectionReason = 'Call Rejected!';
    }
    store.dispatch(setCallRejected({
      rejected: true,
      reason: rejectionReason,
    }))
  }
};

// accept incoming call request
export const acceptIncomingCallRequest = () => {
  wss.sendPreOfferAnswer ({
    callerSocketId: connectedUserSocketId,
    answer: preOfferAnswers.CALL_ACCEPTED,
  });
};

// reject incoming call request
export const rejectIncomingCallRequest = () => {
  wss.sendPreOfferAnswer ({
    callerSocketId: connectedUserSocketId,
    answer: preOfferAnswers.CALL_REJECTED,
  });

  // reset the caller's status
  resetCallData ();
};

//function to check if the call can be answered
export const checkIfCallIsPossible = () => {
  if (
    store.getState ().mainReducer.call.localStream === null ||
    store.getState ().mainReducer.call.callState !== callStates.CALL_AVAILABLE
  ) {
    return false;
  }
  return true;
};

export const resetCallData = () => {
  connectedUserSocketId = null;
  store.dispatch (setCallState (callStates.CALL_AVAILABLE));
};
