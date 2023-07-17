import React, { useEffect } from 'react';

import './Dashborad.css';
import logo from '../assets/logo.png';
import ActiveUsersList from './components/ActiveUsersList/ActiveUsersList';
import * as webRTCHandler from '../utils/webRTCHandler/webRTCHandler';
import DirectCall from './components/ActiveUsersList/DirectCall/DirectCall';

const Dashboard = () => {
  useEffect(() => {
    webRTCHandler.getLocalStream();
  }, []) 
  return (
    <div className='dashboard_container background_main_color'>
      <div className='dashboard_left_section'>
        <div className="dashboard_content_container">
          <DirectCall/>
        </div>
        <div className="dashboard_rooms_container background_secondary_color">
          Rooms
        </div>
      </div>
      <div className="dashboard_right_section background_secondary_color">
        <div className="dashboard_active_users_list">
          <ActiveUsersList />
        </div>
        <div className='login-page_logo_container'>
          <img className='login-page_logo_image' src={logo} alt='VideoTalkerApp'/>
        </div>
      </div>
    </div>    
  )
}

export default Dashboard