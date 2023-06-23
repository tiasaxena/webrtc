import React from 'react';

import '../LoginPage.css';
import '../../index.css';

const UsernameInput = (props) => {
    const { username, setUsername } = props;
  return (
    <div className='login-page_input_container'>
        <input
            className='login-page_input background_main_color text_main_color'
            placeholder='Enter your name'
            type='text'
            value={username}
            onChange={(event) => {
                setUsername(event.target.value)
            }}
        />
    </div>
  )
}

export default UsernameInput