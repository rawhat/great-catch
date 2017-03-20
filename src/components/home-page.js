import React, { Component } from 'react';
import { withRouter } from 'react-router';

class HomePage extends Component {
    componentWillMount = () => {
        var token = sessionStorage.getItem('token');
        console.log(token);
        if(!!token) {
            this.props.router.push('/dashboard');
        }
    }

    render = () => {
        return (
            <div id="container">
                <div id="header"> 
                    <img id="logo" src="/img/logo.png"/> 
                    <div id="navi">
                        <a className='btn btn-primary' href="/login">
                            Log In
                        </a>
                        <a className='btn btn-danger' href='/signup'>
                            Sign In
                        </a>
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