import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import HomePage from './components/home-page';
import Login from './components/login';
import SignUp from './components/signup';
import Dashboard from './components/dashboard';
import isAuthenticated from './components/protected-component';
import Alerts from './components/alerts';

// const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

render(
    <Router history={browserHistory}>
        <Route path="/" component={HomePage} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route path="/dashboard" component={isAuthenticated(Dashboard)} />
        <Route path="/alerts" component={isAuthenticated(Alerts)} />
    </Router>,
    document.querySelector('#app')
);
