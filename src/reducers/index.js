import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import loginReducer from './reducer-login';
import dataReducer from './reducer-data';

export default combineReducers({
    data: dataReducer,
    authentication: loginReducer,
    form: formReducer
});
