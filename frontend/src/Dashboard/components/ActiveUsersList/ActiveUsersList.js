import React from 'react';

import './ActiveUsersList.css';
import ActiveUsersListItem from './ActiveUsersListItem';

const activeUsers = [
    {
        socketId: 3,
        username: "Tia Saxena"
    },
    {
        socketId: 13,
        username: "Tia Saxena"
    },
    {
        socketId: 23,
        username: "Tia Saxena"
    },
    {
        socketId: 123,
        username: "Tia Saxena"
    },
    {
        socketId: 123,
        username: "Tia Saxena"
    },
]

const ActiveUsersList = () => {
  return (
    <div className="active_user_list_container">
        {activeUsers.map((activeUser) =>
            <ActiveUsersListItem 
                key={activeUser.socketId}
                activeUser={activeUser}
            />
        )}
    </div>
  )
}

export default ActiveUsersList