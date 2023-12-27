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
} from '../../../../store/actions/callActions';
import ConversationButtons from '../../ConversationButtons/ConversationButtons';

const DirectCall = (props) => {
  const {
    localStream,
    remoteStream,
    callState,
    callerUsername,
    callingDialogVisible,
    callRejected,
    hideCallRejectedDialog,
  } = props;

  return (
    <>
      <LocalVideoView localStream={localStream} />
      {remoteStream && <RemoteVideoView remoteStream={remoteStream} />}
      {callRejected.rejected &&
        <CallRejectedDialog
          reason={callRejected.reason}
          hideCallRejectedDialog={hideCallRejectedDialog}
        />}
      {callState === callStates.CALL_REQUESTED &&
        <IncomingCallDialog callerUsername={callerUsername} />}
      {callingDialogVisible && <CallingDialog />}
      <ConversationButtons {...props} />
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
  };
};

export default connect (mapStateToProps, mapDispatchToProps) (DirectCall);