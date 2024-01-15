import React from 'react';

import './GroupCallRoomsList.css'

const GroupCallRoomsListItem = ({ room }) => {
    const handleListItemPressed = () => {
        //Join the grp call
    }
  return (
    <div onClick={handleListItemPressed} className='group_calls_list_item'>
        <span> {room.hostName} </span>
    </div>
  )
}

export default GroupCallRoomsListItem