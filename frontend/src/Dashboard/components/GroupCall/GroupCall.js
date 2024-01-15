import React from 'react';

import {connect} from 'react-redux';
import { callStates } from '../../../store/actions/callActions';
import GroupCallButton from '../GroupCallButton/GroupCallButton';
import * as webRTCGroupCallHandler from '../../../utils/webRTCHandler/webRTCGroupCallHandler';

const GroupCall = ({ callState, localStream }) => {
  const createRoom = () => {
    webRTCGroupCallHandler.createNewGroupCall();
  };
  console.log("call state", callState);
  console.log("localStream", localStream);

  return (
  <>
    { localStream && callState !== callStates.CALL_IN_PROGRESS && <GroupCallButton onClickHandler={createRoom} label='Create room'/> }
  </>
    );
};

const mapStateToProps = (state) => {
    const localStream = state.mainReducer.call.localStream;
    const callState = state.mainReducer.call.callState;
    return { 
      localStream,
      callState,
    }
  };

export default connect (mapStateToProps) (GroupCall);
