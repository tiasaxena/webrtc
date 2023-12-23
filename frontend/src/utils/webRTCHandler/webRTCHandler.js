import store from "../../store/store";
import {
  callStates,
  setCallRejected,
  setCallState,
  setCallerUsername,
  setCallingDialogVisible,
  setLocalStream
} from "../../store/actions/callActions";
import * as wss from "../webSocketConnection/wssConnection";

const DEFAULT_CONSTRAINTS = {
  video: true,
  audio: true
};

// pre-offer answers
const preOfferAnswers = {
  CALL_REJECTED: "CALL_REJECTED",
  CALL_ACCEPTED: "CALL_ACCEPTED",
  // if we don't get access to the local stream or the call state is different froms call avilable
  CALL_NOT_AVAILABLE: "CALL_NOT_AVAILABLE"
};

let connectedUserSocketId;
let peerConnection;
let configuration = {
  iceServers: [{
    urls: 'stun:stun.l.google.com:13902'
  }],
}

export const getLocalStream = () => {
  //* getDisplayMedia() method prompts the user to select and grant permission to capture the contents of a display. It returns MediaStream object which can be transmitted to other peer using WebRTC.
  navigator.mediaDevices
    .getUserMedia(DEFAULT_CONSTRAINTS)
    .then(stream => {
      store.dispatch(setLocalStream(stream));
      store.dispatch(setCallState(callStates.CALL_AVAILABLE));
      // We create peer connection only when we get the access to our local stream
      createPeerConnection();
    })
    .catch(error => {
      console.log("Failed to fetch the user video");
      console.log(error);
    });
};

// Function to create local peer connection
export const createPeerConnection = () => {
  // The peer connection is made with every user
  peerConnection = new RTCPeerConnection(configuration);
  // Get access to local stream
  // We will add to our peer connection the tracks which are included in the local stream, which are the audio and the video track
  const localStream = store.getState().call.localStream;
  for (const track of localStream.getTrack()) {
    peerConnection.addTrack(track, localStream);
  }

  // Event listener when other users connect, we get their streams
  peerConnection.ontrack = ({ streams: [stream] }) => {
    // Dispatch remote stream in the store
  }

  // Event listner when we get the ICE candidates from the stun server we defined above
  peerConnection.onicecandidate = (event) => {
    // Send to the connected user our ICE candidates.
  } 
}

// Function to call other users
// calleeDetails will be obtained from the active user list items
// calleeDetails is actually the activeuser arguemnt passed while invoking the function
export const callToOtherUser = calleeDetails => {
  connectedUserSocketId = calleeDetails.socketId;
  // dispatch to set the call state in progress
  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
  store.dispatch(setCallingDialogVisible(true));

  // send the pre-offer using the signalling server
  wss.sendPreOffer({
    callee: calleeDetails,
    caller: {
      username: store.getState().mainReducer.dashboard.username
    }
  });
};

export const handlePreOffer = data => {
  if (checkIfCallIsPossible()) {
    // update the store
    connectedUserSocketId = data.callerSocketId;
    store.dispatch(setCallerUsername(data.callerUsername));
    store.dispatch(setCallState(callStates.CALL_REQUESTED));
  } else {
    wss.sendPreOfferAnswer({
      callerSocketId: data.callerSocketId,
      answer: preOfferAnswers.CALL_NOT_AVAILABLE
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
      rejectionReason = "Not Available!";
    } else {
      rejectionReason = "Call Rejected!";
    }
    store.dispatch(
      setCallRejected({
        rejected: true,
        reason: rejectionReason
      })
    );
    // reset the caller's status
    resetCallData();
  }
};

// accept incoming call request
export const acceptIncomingCallRequest = () => {
  wss.sendPreOfferAnswer({
    callerSocketId: connectedUserSocketId,
    answer: preOfferAnswers.CALL_ACCEPTED
  });
};

// reject incoming call request
export const rejectIncomingCallRequest = () => {
  wss.sendPreOfferAnswer({
    callerSocketId: connectedUserSocketId,
    answer: preOfferAnswers.CALL_REJECTED
  });

  // reset the caller's status
  resetCallData();
};

//function to check if the call can be answered
export const checkIfCallIsPossible = () => {
  if (
    store.getState().mainReducer.call.localStream === null ||
    store.getState().mainReducer.call.callState !== callStates.CALL_AVAILABLE
  ) {
    return false;
  }
  return true;
};

export const resetCallData = () => {
  connectedUserSocketId = null;
  store.dispatch(setCallState(callStates.CALL_AVAILABLE));
};
