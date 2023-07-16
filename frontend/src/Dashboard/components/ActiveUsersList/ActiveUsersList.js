import React, { useEffect } from 'react';
import ActiveUsersListItem from './ActiveUsersListItem';
import { connect } from 'react-redux';

import './ActiveUsersList.css';

const ActiveUsersList = ({ activeUsers }) => {
  useEffect(() => {
  }, [activeUsers]);
  return (
    <div className='active_user_list_container'>
      {activeUsers.map((activeUser) =>
        <ActiveUsersListItem
          key={activeUser.socketId}
          activeUser={activeUser}
        />)}
    </div>
  );
};

const mapStateToProps = (state) => {
  const activeUsers = state.mainReducer.dashboard.activeUsers;
  return { 
    activeUsers,
  }
};

export default connect(mapStateToProps)(ActiveUsersList);