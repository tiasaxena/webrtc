import store from '../../store/store';
import { callStates, setCallState, setLocalStream } from '../../store/actions/callActions';

const DEFAULT_CONSTRAINTS = {
    video: true,
    audio: true,
};

export const getLocalStream = () => {
    //* getDisplayMedia() method prompts the user to select and grant permission to capture the contents of a display. It returns MediaStream object which can be transmitted to other peer using WebRTC. 
    navigator.mediaDevices.getUserMedia(DEFAULT_CONSTRAINTS)
        .then(stream => {
            store.dispatch(setLocalStream(stream))
            store.disptch(setCallState(callStates.CALL_AVAILABLE))
        })
        .catch(error => {
            console.log("Failed to fetch the user video");
            console.lof(error)
        });
}