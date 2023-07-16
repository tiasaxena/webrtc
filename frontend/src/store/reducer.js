import { combineReducers } from 'redux';
import dashboardReducer from './reducers/dashboardReducers';
import callReducer from './reducers/callReducer';

export default combineReducers({
    dashboard: dashboardReducer,
    call: callReducer,
});