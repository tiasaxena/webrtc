import React from 'react';
import {
  MdCallEnd,
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVideocamOff,
  MdVideoLabel,
  MdVideoCall,
  MdCamera,
} from 'react-icons/md';

import ConversationButton from './ConversationButton';
import { switchForScreenSharingSystem } from '../../../utils/webRTCHandler/webRTCHandler';

const styles = {
  buttonContainer: {
    display: 'flex',
    position: 'absolute',
    bottom: '22%',
    left: '35%',
  },
  icon: {
    width: '25px',
    height: '25px',
    fill: '#E6E5E8',
  },
};

const ConversationButtons = props => {
  const {
    localStream,
    localCameraEnabled,
    localMicrophoneEnabled,
    setCameraEnabled,
    setMicrophoneEnabled,
    screenSharingActive,
  } = props;

  const handleMicButtonPressed = () => {
    const micEnabled = localMicrophoneEnabled;
    localStream.getAudioTracks()[0].enabled = !micEnabled;
    setMicrophoneEnabled(!micEnabled);
  }

  const handleVideoButtonPressed = () => {
    const cameraEnabled = localCameraEnabled;
    localStream.getVideoTracks()[0].enabled = !cameraEnabled;
    setCameraEnabled(!cameraEnabled); 
  }

  const handleScreenSharingButtonPressed = () => {
    switchForScreenSharingSystem();
  }

  return (
    <div style={styles.buttonContainer}>
      <ConversationButton onClickHandler={handleMicButtonPressed}>
        { localMicrophoneEnabled ? <MdMic style={styles.icon} /> : <MdMicOff style={styles.icon} /> } 
      </ConversationButton>
      <ConversationButton>
        <MdCallEnd style={styles.icon} />
      </ConversationButton>
      <ConversationButton onClickHandler={handleVideoButtonPressed}>
        { localCameraEnabled ? <MdVideocam style={styles.icon} /> : <MdVideocamOff style={styles.icon} /> }
      </ConversationButton>
      <ConversationButton onClickHandler={handleScreenSharingButtonPressed}>
        { screenSharingActive ? <MdCamera style={styles.icon} /> : <MdVideoLabel style={styles.icon} /> }
      </ConversationButton>
    </div>
  );
};

export default ConversationButtons;
