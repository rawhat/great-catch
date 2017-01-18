import { FETCH_USER_DATA } from '../actions/types';

export default function(state = {}, { type, payload }) {
    switch(type) {
        case FETCH_USER_DATA: {
            return { ...state, ...payload.data };
        }
    }

    return state;
}
