import React from 'react';

import './IncomingCallDialog.css';

const IncomingCallDialog = () => {
    const handleAcceptButton = () => {
        //handle accept button
    }

    const handleRejectButton = () => {
        //hanlde reject button
    }

    return (
      <div className="direct_call_dialog background_secondary_color">
          <div className="direct_call_dialog_caller_name">Caller</div>
          <div className="direct_call_dialog_button_conatiner">
              <button
              className="direct_call_dialog_accept_button"
              onClick={handleAcceptButton}>
                  Accept
              </button>
              <button
              className="direct_call_dialog_accept_button"
              onClick={handleRejectButton}>
                  Reject
              </button>
          </div>
      </div>
    )
}

export default IncomingCallDialog