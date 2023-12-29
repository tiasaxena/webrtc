import React from 'react';

import './DashboardInformation.css';

const DashboardInformation = ({ username }) => {
  return (
    <div className='dashboard_info_text_container'>
        <span className='dashboard_info_text_title'>
            Hello {username}! Welcome in VideoTalker.
        </span>
        <span className='dashboard_info_text_decsription'>
            You can start a call with the person directly in the list or
            you can create a new group 
        </span>
    </div>
  )
}

export default DashboardInformation