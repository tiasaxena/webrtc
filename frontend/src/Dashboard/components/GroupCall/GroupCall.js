import React from "react";

import { connect } from "react-redux";
import { callStates, setLocalCameraEnabled, setLocalMicrophoneEnabled } from "../../../store/actions/callActions";
import GroupCallButton from "../GroupCallButton/GroupCallButton";
import GroupCallRoom from "../GroupCallRoom/GroupCallRoom";
import * as webRTCGroupCallHandler from "../../../utils/webRTCHandler/webRTCGroupCallHandler";

const GroupCall = (props) => {
  const { callState, localStream, groupCallActive } = props;

  const createRoom = () => {
    webRTCGroupCallHandler.createNewGroupCall();
  };

  const handleLeaveRoom = () => {
    webRTCGroupCallHandler.leaveGroupCall();
  };

  return (
    <>
      {!groupCallActive &&
        localStream &&
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
  const localStream = state.mainReducer.call.localStream;
  const callState = state.mainReducer.call.callState;
  const groupCallActive = state.mainReducer.call.groupCallActive;
  const groupCallStreams = state.mainReducer.call.groupCallStreams;
  const localCameraEnabled = state.mainReducer.call.localCameraEnabled;
  const localMicrophoneEnabled = state.mainReducer.call.localMicrophoneEnabled;
  return {
    localStream,
    callState,
    groupCallActive,
    groupCallStreams,
    localCameraEnabled,
    localMicrophoneEnabled
  };
};

const mapActionsToProps = (dispatch) => {
  return {
    setCameraEnabled: enabled => dispatch(setLocalCameraEnabled(enabled)),
    setMicrophoneEnabled: enabled => dispatch(setLocalMicrophoneEnabled(enabled)),
  }
} 

export default connect(mapStateToProps, mapActionsToProps)(GroupCall);
