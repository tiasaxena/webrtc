import React from 'react';
import {connect} from 'react-redux';

import LocalVideoView from '../../LocalVideoView/LocalVideoView';
import RemoteVideoView from '../../RemoteVideoView/RemoteVideoView';
import IncomingCallDialog from '../../IncomingCallDialog/IncomingCallDialog';
import CallRejectedDialog from '../../CallRejectedDialog/CallRejectedDialog';
import CallingDialog from '../../CallingDialog/CallingDialog';
import {
  callStates,
  setCallRejected,
  setLocalCameraEnabled,
  setLocalMicrophoneEnabled,
  setMessage,
} from '../../../../store/actions/callActions';
import ConversationButtons from '../../ConversationButtons/ConversationButtons';
import Messenger from '../../Messenger/Messenger';

const DirectCall = (props) => {
  const {
    localStream,
    remoteStream,
    callState,
    callerUsername,
    callingDialogVisible,
    callRejected,
    hideCallRejectedDialog,
    message,
    setDirectCallMessage,
  } = props;

  return (
    <>
      {remoteStream  &&  <RemoteVideoView remoteStream={remoteStream} />}
      <LocalVideoView localStream={localStream} />
      {callRejected.rejected &&
        <CallRejectedDialog
          reason={callRejected.reason}
          hideCallRejectedDialog={hideCallRejectedDialog}
        />}
      {callState === callStates.CALL_REQUESTED &&
        <IncomingCallDialog callerUsername={callerUsername} />}
      {callingDialogVisible && <CallingDialog />}
      { remoteStream && callState === callStates.CALL_IN_PROGRESS && <ConversationButtons {...props} /> }
      { remoteStream && callState === callStates.CALL_IN_PROGRESS && <Messenger message={message} setDirectCallMessage={setDirectCallMessage} /> }
    </>
  );
};

const mapStateToProps = state => {
  const call = state.mainReducer.call;
  return {
    ...call,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    hideCallRejectedDialog: callRejectedDetails => dispatch (setCallRejected (callRejectedDetails)),
    setMicrophoneEnabled: enabled => dispatch (setLocalMicrophoneEnabled(enabled)),
    setCameraEnabled: enabled => dispatch (setLocalCameraEnabled(enabled)),
    setDirectCallMessage: (received, content) => dispatch(setMessage(received, content)),
  };
};

export default connect (mapStateToProps, mapDispatchToProps) (DirectCall);