import React from 'react';

import './ActiveUsersList.css';
import userAvatar from '../../../assets/userAvatar.png';
import { callToOtherUser } from '../../../utils/webRTCHandler/webRTCHandler';
import { callStates } from '../../../store/actions/callActions';

const ActiveUsersListItem = ({ activeUser, callState }) => {
  const handleListItem = () => {
    if(callState === callStates.CALL_AVAILABLE) {
      callToOtherUser(activeUser);
    }
  };
  return (
    <div className="active_user_list_container" onClick={handleListItem}>
      <div className="user_list_item">
        <div className="active_user_list_image_container">
          <img
            src={userAvatar}
            className="active_user_list_image border_img"
            alt="avatar-img"
          />
        </div>
        <span className="active_user_list_text border_name">
          {activeUser.username}
        </span>
      </div>
    </div>
  );
};

export default ActiveUsersListItem;
