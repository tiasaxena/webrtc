import React from 'react';

import {connect} from 'react-redux';
import { callStates } from '../../../store/actions/callActions';
import GroupCallButton from '../GroupCallButton/GroupCallButton';
import GroupCallRoom from '../GroupCallRoom/GroupCallRoom';
import * as webRTCGroupCallHandler from '../../../utils/webRTCHandler/webRTCGroupCallHandler';

const GroupCall = ({ callState, localStream, groupCallActive }) => {
  const createRoom = () => {
    webRTCGroupCallHandler.createNewGroupCall();
  };

  return (
  <>
    { !groupCallActive && localStream && callState !== callStates.CALL_IN_PROGRESS && <GroupCallButton onClickHandler={createRoom} label='Create room'/> }
    { groupCallActive && <GroupCallRoom />}
  </>
    );
};

const mapStateToProps = (state) => {
    const localStream = state.mainReducer.call.localStream;
    const callState = state.mainReducer.call.callState;
    const groupCallActive = state.mainReducer.call.groupCallActive;
    return { 
      localStream,
      callState,
      groupCallActive,
    }
  };

export default connect (mapStateToProps) (GroupCall);
