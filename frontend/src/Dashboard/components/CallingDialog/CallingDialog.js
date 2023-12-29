import React from 'react';
import { MdCallEnd } from 'react-icons/md';

import './CallingDialog.css';
import { hangUp } from '../../../utils/webRTCHandler/webRTCHandler';

const styles = {
  buttonContainer: {
    marginTop: '10px',
    width: '40px',
    height: '40px',
    borderRadius: '40px',
    border: '2px solid #E6E5E8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}

const CallingDialog = () => {
  const handleHangUpPressed =  () => {
    hangUp();
  }
  return (
    <div className="direct_calling_dialog background_secondary_color">
      <span>Calling</span>
      <div style={styles.buttonContainer} onClick={handleHangUpPressed}>
        <MdCallEnd style={{ width: '20px', height: '20px', fill: '#xE6E5E8' }}/>
      </div>
    </div>
  )
}

export default CallingDialog