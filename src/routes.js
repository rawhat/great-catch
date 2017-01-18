import React from 'react';
import { Route } from 'react-router';

import App from './components/app';
import Template from './components/site-template';
import Login from './components/login';

const routes = <Route path='/' component={App}>
    <Route path='login' component={Login} />
    <Route path='template' component={Template} />
</Route>;

export default routes;
