import React, { Component } from 'react';
import { browserHistory } from 'react-router';

export default (BaseComponent) => {
    class AuthenticatedComponent extends Component {
        constructor(props) {
            super(props);
            this.state = {
                authenticated: false
            };
        }

        componentWillMount = () => {
            this.checkAuthentication();
        }

        checkAuthentication = () => {
            let jwt = window.sessionStorage.getItem('token');
            let authenticated = !!jwt;
            this.setState({
                authenticated
            });
            if(!authenticated) browserHistory.push('/login');
        }

        render = () => {
            return this.state.authenticated ? <BaseComponent {...this.props} /> : null;
        }
    }

    return AuthenticatedComponent;
};