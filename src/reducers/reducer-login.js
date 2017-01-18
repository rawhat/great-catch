import { USER_LOGIN_SUCCESS } from '../actions/types';

export default (state = {}, action) => {
    switch(action.type) {
        case USER_LOGIN_SUCCESS: {
            return { ...state, token: action.payload.data.token };
        }
    }
    return state;
};
