import { callStates, clearGroupCallData, setCallState, setGroupCallActive, setGroupCallIncomingStreams } from '../../store/actions/callActions';
import store from '../../store/store';
import * as wss from '../../utils/webSocketConnection/wssConnection'

// Create a connection to the peer server in backend
let myPeer;
let myPeerId;
let groupCallRoomId;
let groupCallHost = false;

export const connectWithMyPeer = () => {
    // undefined(first param) tells that peer server will create client ids for us on its own
    myPeer = new window.Peer( undefined, {
        path: '/peerjs',
        host: '/',
        port: '5000',
    } );
    
    // The PeerServer helps clients (peers) find each other on the network. When a client connects to the PeerServer, it is assigned a unique identifier (peer ID). This ID can then be shared with other peers to establish a connection.The PeerServer helps clients (peers) find each other on the network. When a client connects to the PeerServer, it is assigned a unique identifier (peer ID). This ID can then be shared with other peers to establish a connection.
    myPeer.on('open', (id) => {
        console.log("Sucessfully connected to the peer server", id);
        myPeerId = id;
    });

    // listen from incoming call form other peers
    myPeer.on('call', call => {
        // prepare your video stream as an answer to the incoming call
        call.answer(store.getState().mainReducer.call.localStream);
        // handling the incoming streams
        call.on('stream', incomingStream => {
            const streams = store.getState().mainReducer.call.groupCallStreams;
            const stream = streams.find(stream => stream.id === incomingStream.id);
            // check if the stream is already added
            if(!stream) {
                addVideoStream(incomingStream);
            }
        });
    });
}

export const createNewGroupCall = () => {
    groupCallHost = true;
    wss.registerGroupCall({
        username: store.getState().mainReducer.dashboard.username,
        peerId: myPeerId,
    });
    // Update the store
    store.dispatch(setGroupCallActive(true));
    store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
}

export const joinGroupCall = (hostSocketId, roomId) => {
    const localStream = store.getState().mainReducer.call.localStream;
    groupCallRoomId = roomId;

    wss.userWantsToJoinGroupCall({
        peerId: myPeerId,
        hostSocketId,
        roomId,
        localStreamId: localStream.id,
    });

    store.dispatch(setGroupCallActive(true));
    store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
}

export const connectToNewUser = (data) => {
    const localStream = store.getState().mainReducer.call.localStream;
    const call = myPeer.call(data.peerId, localStream);
    call.on('stream', incomingStream => {
        const streams = store.getState().mainReducer.call.groupCallStreams;
        const stream = streams.find(stream => stream.id === incomingStream.id);
        if(!stream) {
            addVideoStream(incomingStream);
        }
    })
}

const addVideoStream = (incomingStream) => {
    const groupCallStreams = [
        ...store.getState().mainReducer.call.groupCallStreams,
        incomingStream
    ];
    store.dispatch(setGroupCallIncomingStreams(groupCallStreams));
}

export const leaveGroupCall = () => {
    if(groupCallHost) {
        wss.groupCallClosedByHost({
            peerId: myPeerId
        })
    } else {
        wss.userLeftGroupCall({
            streamId: store.getState().mainReducer.call.localStream.id,
            roomId: groupCallRoomId,
        });
    }

    clearGroupCallDataHelper();
}

export const clearGroupCallDataHelper = () => {
    groupCallRoomId = null;
    groupCallHost = null;
    store.dispatch(clearGroupCallData());
    myPeer.destroy();
    connectWithMyPeer();
    
    const localStream = store.getState().mainReducer.call.localStream;
    localStream.getVideoTracks()[0].enabled = true;
    localStream.getAudioTracks()[0].enabled = true;
}

export const removeInactiveStream = (data) => {
    const groupCallStreams = store.getState().mainReducer.call.groupCallStreams.filter(
        stream => stream.id !== data.streamId
    );

    store.dispatch(setGroupCallIncomingStreams(groupCallStreams));
}

export const checkActiveGroupCall = () => {
    if(store.getState().mainReducer.call.groupCallActive) {
        return groupCallRoomId;
    } else {
        return false;
    }
}