import { USER_LOGIN_SUCCESS, USER_AUTH_REFRESH } from '../actions/types';

export default (state = {}, action) => {
    switch(action.type) {
        case USER_LOGIN_SUCCESS: {
            return { ...state, token: action.payload.data.token };
        }
        case USER_AUTH_REFRESH: {
            return { ...state, token: action.payload };
        }
    }
    return state;
};
