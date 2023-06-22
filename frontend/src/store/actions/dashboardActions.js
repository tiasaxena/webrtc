export const DASHBOARD_SET_USERNAME = 'DASHBOARD_SET_USERNAME';

export const setUsername = (username) => {
    return {
        type: DASHBOARD_SET_USERNAME,
        username,
    };
};