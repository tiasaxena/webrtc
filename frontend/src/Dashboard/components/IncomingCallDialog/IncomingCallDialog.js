import React from 'react';

import './IncomingCallDialog.css';
import { acceptIncomingCallRequest, rejectIncomingCallRequest } from '../../../utils/webRTCHandler/webRTCHandler';

const IncomingCallDialog = ({callerUsername}) => {
  const handleAcceptButton = () => {
    acceptIncomingCallRequest();
  };

  const handleRejectButton = () => {
    rejectIncomingCallRequest();
  };

  return (
    <div className="direct_call_dialog background_secondary_color">
      <div className="direct_call_dialog_caller_name"> <span style={{color: "green"}}>&#8600;</span> {callerUsername}</div>
      <div className="direct_call_dialog_button_conatiner">
        <button
          className="direct_call_dialog_accept_button"
          onClick={handleAcceptButton}
        >
          Accept
        </button>
        <button
          className="direct_call_dialog_accept_button"
          onClick={handleRejectButton}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default IncomingCallDialog;
