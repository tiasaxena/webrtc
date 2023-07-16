import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';

import './LoginPage.css';
import logo from '../assets/logo.png';
import UsernameInput from './components/UsernameInput';
import SubmitButton from './components/SubmitButton';
import { setUsername } from '../store/actions/dashboardActions'; 
import { registerNewUser } from '../utils/webSocketConnection/wssConnection'

const LoginPage = ({ saveUsername }) => {
  const [ username, setUsername ] = useState('');
  const history = useHistory();

  const handleSubmitButton = () => {
    saveUsername(username);
    registerNewUser(username);
    history.push('/dashboard');
  } 

  return (
    <div className='login-page_container background_main_color'>
      <div className='login-page_login_box background_secondary_color'>
        <div className='login-page_logo_container'>
          <img className='login-page_logo_image' src={logo} alt='VideoTalkerApp'/>
        </div>
        <div className='login-page_title_container'>
          <h2> Get on Board </h2>
        </div>
        <UsernameInput username={username} setUsername={setUsername} />
        <SubmitButton handleSubmitButton={handleSubmitButton} />
      </div>
    </div>
  )
}

const mapActionsToProps = (dispatch) => {
  return {
    saveUsername: username => dispatch(setUsername(username))
  }
}

export default connect(null, mapActionsToProps)(LoginPage);