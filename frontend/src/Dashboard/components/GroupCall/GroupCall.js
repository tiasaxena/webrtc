import React from "react";

import { connect } from "react-redux";
import LocalVideoView from '../LocalVideoView/LocalVideoView';
import { callStates, setLocalCameraEnabled, setLocalMicrophoneEnabled } from "../../../store/actions/callActions";
import GroupCallButton from "../GroupCallButton/GroupCallButton";
import GroupCallRoom from "../GroupCallRoom/GroupCallRoom";
import * as webRTCGroupCallHandler from "../../../utils/webRTCHandler/webRTCGroupCallHandler";

const GroupCall = (props) => {
  const {
    localStream,
    callState,
    groupCallActive
  } = props;

  const createRoom = () => {
    webRTCGroupCallHandler.createNewGroupCall();
  };

  const handleLeaveRoom = () => {
    webRTCGroupCallHandler.leaveGroupCall();
  };

  return (
    <>
      <LocalVideoView localStream={localStream} />
      {!groupCallActive &&
        
        callState !== callStates.CALL_IN_PROGRESS && (
          <GroupCallButton onClickHandler={createRoom} label="Create room" />
        )}
      {groupCallActive && <GroupCallRoom {...props} />}
      {groupCallActive && (
        <GroupCallButton onClickHandler={handleLeaveRoom} label="Leave Room" />
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const call = state.mainReducer.call;
  return {
    ...call,
  };
};

const mapActionsToProps = (dispatch) => {
  return {
    setCameraEnabled: enabled => dispatch(setLocalCameraEnabled(enabled)),
    setMicrophoneEnabled: enabled => dispatch(setLocalMicrophoneEnabled(enabled)),
  }
} 

export default connect(mapStateToProps, mapActionsToProps)(GroupCall);
