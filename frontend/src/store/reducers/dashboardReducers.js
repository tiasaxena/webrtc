import * as dashboardActions from '../actions/dashboardActions';

const initialState = {
    username: '',
    activeUsers: [],
};

const dashboardReducer = (state = initialState, action) => {
    // dashboardAction has --> 1. type, 2. username 
    switch(action.type){
        case dashboardActions.DASHBOARD_SET_USERNAME:
            return {
                ...state,
                username: action.username
            };
        case dashboardActions.DASHBOARD_SET_ACTIVE_USERS:
        return {
            ...state,
            activeUsers: action.activeUsers
        };
        default: 
            return state;
    }
};

export default dashboardReducer;