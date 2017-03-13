import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import loginReducer from './reducer-login';
import dataReducer from './reducer-data';
import userDataReducer from './reducer-user-data';

export default combineReducers({
    data: dataReducer,
    userData: userDataReducer,
    auth: loginReducer,
    form: formReducer,
    // fitbitData
});
