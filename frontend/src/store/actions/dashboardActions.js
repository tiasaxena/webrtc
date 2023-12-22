export const DASHBOARD_SET_USERNAME = 'DASHBOARD.SET_USERNAME';
export const DASHBOARD_SET_ACTIVE_USERS = 'DASHBOARD.SET_ACTIVE_USERS';

export const setActiveUsers = (activeUsers) => {
    return {
        type: DASHBOARD_SET_ACTIVE_USERS,
        activeUsers,
    }
}

export const setUsername = (username) => {
    return {
        type: DASHBOARD_SET_USERNAME,
        username, //username: username
    };
};