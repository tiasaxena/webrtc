import { callStates, clearGroupCallData, setCallState, setGroupCallActive, setGroupCallIncomingStreams } from '../../store/actions/callActions';
import store from '../../store/store';
import * as wss from '../../utils/webSocketConnection/wssConnection'

// Create a connection to the peer server in backend
let myPeer;
let myPeerId;
let groupCallRoomId;

export const connectWithMyPeer = () => {
    // undefined(first param) tells that peer server will create client ids for us on its own
    myPeer = new window.Peer( undefined, {
        path: '/peerjs',
        host: '/',
        port: '5000',
    } );

    myPeer.on('open', (id) => {
        console.log("Sucessfully connected to the peer server", id);
        myPeerId = id;
    });

    myPeer.on('call', call => {
        call.answer(store.getState().mainReducer.call.localStream);
        call.on('stream', incomingStream => {
            const streams = store.getState().mainReducer.call.groupCallStreams;
            console.log('streams', streams)
            const stream = streams.find(stream => stream.id === incomingStream.id);
            if(!stream) {
                addVideoStream(incomingStream);
            }
        });
    });
}

export const createNewGroupCall = () => {
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
    console.log('connect to new user webrtcgroup', data);
    const localStream = store.getState().mainReducer.call.localStream;
    console.log('localStream', localStream)
    const call = myPeer.call(data.peerId, localStream);
    console.log('call webrtcgroup', call);
    call.on('stream', incomingStream => {
        const streams = store.getState().mainReducer.call.groupCallStreams;
        console.log('streams', streams);
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
    wss.userLeftGroupCall({
        streamId: store.getState().mainReducer.call.localStream.id,
        roomId: groupCallRoomId,
    });

    groupCallRoomId = null;
    store.dispatch(clearGroupCallData());
    myPeer.destroy();
    connectWithMyPeer();
}

export const removeInactiveStream = (data) => {
    const groupCallStreams = store.getState().mainReducer.call.groupCallStreams.filter(
        stream => stream.id !== data.streamId
    );

    store.dispatch(setGroupCallIncomingStreams(groupCallStreams));
}