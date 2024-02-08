import React from 'react';

import './GroupCallRoomsList.css';
import * as webRTCGroupCallHandler
  from '../../../utils/webRTCHandler/webRTCGroupCallHandler';

const GroupCallRoomsListItem = ({room}) => {
  
  const handleListItemPressed = () => {
    webRTCGroupCallHandler.joinGroupCall (room.socketId, room.roomId);
  };
  return (
    <div onClick={handleListItemPressed} className="group_calls_list_item background_main_color">
      <span> {room.hostName} </span>
    </div>
  );
};

export default GroupCallRoomsListItem;
