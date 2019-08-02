import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType) => dispatch => {
    cosnt id = uuid.v4();
    dispatch({
        type: SET_ALERT,
        payload : { msg, alertType, id}
    })
}