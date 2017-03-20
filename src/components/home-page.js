import React, { Component } from 'react';
import { withRouter } from 'react-router';

class HomePage extends Component {
    componentWillMount = () => {
        if(sessionStorage.getItem('token')) {
            this.props.router.push('/dashboard');
        }
    }

    render = () => {
        return (
            <div id="container">
                <div id="header"> 
                    <img id="logo" src="/img/logo.png"/> 
                    <div id="navi">
                        <a href="/login">Log In</a>
                        <a href='/signup'>Sign In</a>
                    </div>
                </div>
                <div id="main">
                    <div id="slogon">
                        <h1>Develop a professional way to monitor your health. </h1>
                    </div>
                </div>
                <div id="footer">
                    Copyright &copy; GreatCatch.com
                </div>
            </div>
        );
    }
};

export default withRouter(HomePage);