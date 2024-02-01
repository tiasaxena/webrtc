import { callStates, setCallState, setGroupCallActive, setGroupCallIncomingStreams } from '../../store/actions/callActions';
import store from '../../store/store';
import * as wss from '../../utils/webSocketConnection/wssConnection'

// Create a connection to the peer server in backend
let myPeer;
let myPeerId;

export const connectWithMyPeer = () => {
    // undefined(first param) tells that peer server will create client ids for us on its own
    myPeer = new window.Peer( undefined, {
        path: '/peerjs',
        host: '/',
        port: '8000',
    } );

    myPeer.on('open', (id) => {
        console.log("Sucessfully connected to the peer server", id);
        myPeerId = id;
    });

    myPeer.on('call', call => {
        call.answer(store.getState().mainReducer.call.localStream);
        call.on('stream', incomingStream => {
            const streams = store.getState().mainReducer.call.groupCallStreams;
            const stream = streams.find(stream => stream.id === incomingStream.id);
            if(!stream) {
                addVideoStream(stream);
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
            addVideoStream(stream);
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