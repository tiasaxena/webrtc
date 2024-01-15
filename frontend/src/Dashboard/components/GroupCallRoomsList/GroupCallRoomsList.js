import React from 'react';

import './GroupCallRoomsList.css';
import GroupCallRoomsListItem from './GroupCallRoomsListItem';

const dummyList = [
    {
        roomId: "123",
        hostName: "Tia"
    },
    {
        roomId: "4932",
        hostName: 'Mia',
    }
]

const GroupCallRoomsList = () => {
  return (
    <>
        { dummyList.map(room => <GroupCallRoomsListItem key={room.roomId} room={room} />)}
    </>
  )
}

export default GroupCallRoomsList