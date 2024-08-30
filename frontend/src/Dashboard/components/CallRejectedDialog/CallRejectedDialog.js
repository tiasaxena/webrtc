import React, { useEffect } from 'react';

import './CallRejectedDialog.css'

const CallRejectedDialog = ({reason, hideCallRejectedDialog}) => {
  useEffect(() => {
    setTimeout(() => {
      hideCallRejectedDialog({
        rejected: false,
        reason: '',
      })
    }, [4000])
  }, [])
  return (
    <div className="call_rejected_dialog background_secondary_color">
        <span><span style={{color: "red", fontSize: "2rem"}}>&#10554; </span> {reason}</span>
    </div>
  )
}

export default CallRejectedDialog