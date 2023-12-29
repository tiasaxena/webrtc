import store from '../../store/store';
import {
  callStates,
  setCallRejected,
  setCallState,
  setCallerUsername,
  setCallingDialogVisible,
  setLocalStream,
  setRemoteStream,
  setScreenSharingActive,
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

let connectedUserSocketId;
let peerConnection;
const configuration = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};

export const getLocalStream = () => {
  //* getDisplayMedia() method prompts the user to select and grant permission to capture the contents of a display. It returns MediaStream object which can be transmitted to other peer using WebRTC.
  navigator.mediaDevices
    .getUserMedia (DEFAULT_CONSTRAINTS)
    .then (stream => {
      store.dispatch (setLocalStream (stream));
      store.dispatch (setCallState (callStates.CALL_AVAILABLE));
      // We create peer connection only when we get the access to our local stream
      createPeerConnection ();
    })
    .catch (error => {
      console.log ('Failed to fetch the user video');
      console.log (error);
    });
};

// Function to create local peer connection
const createPeerConnection = () => {
  // The peer connection is made with every user
  peerConnection = new RTCPeerConnection (configuration);
  // Get access to local stream
  // We will add to our peer connection the tracks which are included in the local stream, which are the audio and the video track
  const localStream = store.getState ().mainReducer.call.localStream;
  for (const track of localStream.getTracks ()) {
    peerConnection.addTrack (track, localStream);
  }

  // Event listener when other users connect, we get their streams
  peerConnection.ontrack = ({streams: [stream]}) => {
    store.dispatch (setRemoteStream (stream));
  };
  // Event listner when we get the ICE candidates from the stun server we defined above
  peerConnection.onicecandidate = event => {
    console.log ('Getting candidates from STUN server.', event.candidate);
    // Send to the connected user our ICE candidates.
    if (event.candidate) {
      // send ice candidates to other users
      wss.sendICECandidate ({
        candidate: event.candidate,
        connectedUserSocketId: connectedUserSocketId,
      });
    }
  };

  peerConnection.onconnectionstatechange = event => {
    if (peerConnection.connectionState === 'connected') {
      console.log ('succesfully connected with other peer');
    }
  };
};

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

// accept incoming call request
export const acceptIncomingCallRequest = () => {
  wss.sendPreOfferAnswer ({
    callerSocketId: connectedUserSocketId,
    answer: preOfferAnswers.CALL_ACCEPTED,
  });

  store.dispatch (setCallState (callStates.CALL_IN_PROGRESS));
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

export const handlePreOfferAnswer = data => {
  store.dispatch (setCallingDialogVisible (false));

  if (data.answer === preOfferAnswers.CALL_ACCEPTED) {
    sendOffer ();
  } else {
    let rejectionReason;
    if (data.answer === preOfferAnswers.CALL_NOT_AVAILABLE) {
      rejectionReason = 'Not Available!';
    } else {
      rejectionReason = 'Call Rejected!';
    }
    store.dispatch (
      setCallRejected ({
        rejected: true,
        reason: rejectionReason,
      })
    );
    // reset the caller's status
    resetCallData ();
  }
};

// Send webRTC Offer to the callee
const sendOffer = async () => {
  //* The createOffer() function creates a SDP offer which includes information about any  MediaStreamTracks already attached to the WebRTC session, codec, and options supported by the browser, and any candidates already gathered by the ICE agent, for the purpose of being sent over the signaling channel (in our application Socket.IO) to a potential peer to request a connection or to update the configuration of an existing connection.

  //* The SDP is an important part of the WebRTC. It is a protocol that is intended to describe media communication sessions. It does not deliver the media data but is used for negotiation between peers of various audio and video codecs, network topologies, and other device information. It also needs to be easily transportable.

  const offer = await peerConnection.createOffer ();
  await peerConnection.setLocalDescription (offer);

  wss.sendWebRTCOffer ({
    calleeSocketId: connectedUserSocketId,
    offer: offer,
  });
};

/* ___________________________ EXHANGING SDP(includes media information) _________________________ */

export const handleWebRTCOffer = async data => {
  await peerConnection.setRemoteDescription (data.offer);
  const answer = await peerConnection.createAnswer ();
  // set the answer as the callee's local description
  await peerConnection.setLocalDescription (answer);
  wss.sendWebRTCAnswer ({
    callerSocketId: connectedUserSocketId,
    answer: answer,
  });
};

export const handleWebRTCAnswer = async data => {
  await peerConnection.setRemoteDescription (data.answer);
};

/* ________________________________________________________________________________________________ */

/* __________________ EXHANGING ICE CANDIDATES(information about network connection) ______________ */

export const handleICECandidate = async data => {
  try {
    console.log ('Adding ICE Candidates');
    await peerConnection.addIceCandidate (data.candidate);
  } catch (err) {
    console.log (
      'Error occured while trying to add ICE Candidates recevied from the STUN server',
      err
    );
  }
};

/* ________________________________________________________________________________________________ */

//function to check if the call can be answered
export const checkIfCallIsPossible = () => {
  if (
    store.getState ().mainReducer.call.localStream === null ||
    store.getState ().mainReducer.call.callState !== callStates.CALL_AVAILABLE
  ) {
    return false;
  } else {
    return true;
  }
};

// Screen Sharing Stream
let screenSharingStream;

export const switchForScreenSharingSystem = async () => {
  if (!store.getState ().mainReducer.call.screenSharingActive) {
    // Screen share the activities of the person
    try {
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia ({
        video: true,
      });
      store.dispatch (setScreenSharingActive (true));

      const senders = peerConnection.getSenders ();
      const sender = senders.find (
        sender =>
          sender.track.kind === screenSharingStream.getVideoTracks ()[0].kind
      );
      sender.replaceTrack (screenSharingStream.getVideoTracks ()[0]);
    } catch (err) {
      console.error ('Error while getting screen sharing stream', err);
    }
  } else {
    // Share the video of the person
    const localStream = store.getState ().mainReducer.call.localStream;
    const senders = peerConnection.getSenders ();
    const sender = senders.find (
      sender => sender.track.kind === localStream.getVideoTracks ()[0].kind
    );
    sender.replaceTrack (localStream.getVideoTracks ()[0]);
    store.dispatch (setScreenSharingActive (false));

    screenSharingStream.getTracks ().forEach (track => track.stop ());
  }
};

export const handleUserHangedUp = () => {
  resetCallDataAfterHangUp();
}

export const hangUp = () => {
  wss.sendUserHangedUp ({
    connectedUserSocketId: connectedUserSocketId,
  });

  resetCallDataAfterHangUp ();
};

const resetCallDataAfterHangUp = () => {
  store.dispatch(setRemoteStream(null));

  peerConnection.close();
  peerConnection = null;
  createPeerConnection();
  resetCallData();

  if(store.getState().mainReducer.call.screenSharingActive) {
    screenSharingStream.getTracks().forEach(track => track.stop())
  }
};

export const resetCallData = () => {
  connectedUserSocketId = null;
  store.dispatch (setCallState (callStates.CALL_AVAILABLE));
};