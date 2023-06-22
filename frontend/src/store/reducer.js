import { combineReducers } from 'redux';
import dashboardReducer from './reducers/dashboardReducers';

export default combineReducers({
    dashboard: dashboardReducer,
});