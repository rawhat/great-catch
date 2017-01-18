import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import Authentication from './components/authentication';
import Template from './components/site-template';
import Login from './components/login';
import Signup from './components/sign-up';
import HomePage from './components/home-page';
import Dashboard from './components/dashboard';
import NotFound from './components/not-found';

const routes = <Route path='/' component={App}>
    <IndexRoute component={HomePage} />
    <Route path='login' component={Login} />
    <Route path='signup' component={Signup} />
    <Route path='dashboard' component={Authentication(Dashboard)} />
    <Route path='template' component={Template} />
    <Route path='*' component={NotFound} />
</Route>;

export default routes;
