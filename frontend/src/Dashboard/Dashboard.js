import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import './Dashborad.css';
import logo from '../assets/logo.png';
import { callStates } from '../store/actions/callActions';
import * as webRTCHandler from '../utils/webRTCHandler/webRTCHandler';
import ActiveUsersList from './components/ActiveUsersList/ActiveUsersList';
import DirectCall from './components/ActiveUsersList/DirectCall/DirectCall';
import DashboardInformation from './components/DashboardInformation/DashboardInformation';
import * as webRTCGroupCallHandler from '../utils/webRTCHandler/webRTCGroupCallHandler';

const Dashboard = ({ username, callState }) => {
  useEffect(() => {
    webRTCHandler.getLocalStream();
    webRTCGroupCallHandler.connectWithMyPeer();
  }, []) 
  return (
    <div className='dashboard_container background_main_color'>
      <div className='dashboard_left_section'>
        <div className="dashboard_content_container">
          <DirectCall/>
          { callState !== callStates.CALL_IN_PROGRESS && <DashboardInformation username={username}/> }
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

const mapStateToProps = (state) => {
  const username = state.mainReducer.dashboard.username;
  const callState = state.mainReducer.dashboard.callState;
  return {
    username,
    callState,
  }
}

export default connect (mapStateToProps) (Dashboard)