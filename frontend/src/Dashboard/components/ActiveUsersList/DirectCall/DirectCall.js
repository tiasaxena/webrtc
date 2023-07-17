import React from 'react';
import { connect } from 'react-redux';

import LocalVideoView from '../../LocalVideoView/LocalVideoView';
import RemoteVideoView from '../../RemoteVideoView/RemoteVideoView';

const DirectCall = ({ call }) => {
    const { localStream, remoteStream } = call;

    return (
      <div>
          <LocalVideoView localStream = {localStream} />
          {remoteStream && <RemoteVideoView remoteStream = {remoteStream} />}
      </div>
    )
}

const mapStateToProps = (state) => {
    const call = state.mainReducer.call;
    return {
        call
    }
}

export default connect(mapStateToProps, null)(DirectCall)