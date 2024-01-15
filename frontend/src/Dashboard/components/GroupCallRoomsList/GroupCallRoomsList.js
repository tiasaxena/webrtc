import React from 'react';
import { connect } from 'react-redux';

import './GroupCallRoomsList.css';
import GroupCallRoomsListItem from './GroupCallRoomsListItem';

const GroupCallRoomsList = ({ groupCallRooms }) => {
  return (
    <>
      { groupCallRooms.map(room => <GroupCallRoomsListItem key={room.roomId} room={room} />)}
    </>
  )
}

const mapStateToProps = (store) => {
  const groupCallRooms = store.mainReducer.dashboard.groupCallRooms;
  return {
    groupCallRooms,
  }
};

export default connect(mapStateToProps) (GroupCallRoomsList)