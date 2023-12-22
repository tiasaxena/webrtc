import React from 'react';
import {connect} from 'react-redux';

import LocalVideoView from '../../LocalVideoView/LocalVideoView';
import RemoteVideoView from '../../RemoteVideoView/RemoteVideoView';
import IncomingCallDialog from '../../IncomingCallDialog/IncomingCallDialog';
import CallRejectedDialog from '../../CallRejectedDialog/CallRejectedDialog';
import CallingDialog from '../../CallingDialog/CallingDialog';
import {callStates} from '../../../../store/actions/callActions';

const DirectCall = ({call}) => {
  const {
    localStream,
    remoteStream,
    callState,
    callerUsername,
    callingDialogVisible,
  } = call;

  return (
    <div>
      <LocalVideoView localStream={localStream} />
      {remoteStream && <RemoteVideoView remoteStream={remoteStream} />}
      {/* <CallRejectedDialog/> */}
      {callState === callStates.CALL_REQUESTED &&
        <IncomingCallDialog callerUsername={callerUsername} />}
      {callingDialogVisible && <CallingDialog />}
    </div>
  );
};

const mapStateToProps = state => {
  const call = state.mainReducer.call;
  return {
    call,
  };
};

export default connect (mapStateToProps, null) (DirectCall);
