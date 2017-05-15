import React, { Component } from 'react';
import { withRouter } from 'react-router';

class HomePage extends Component {
    componentWillMount = () => {
        var token = sessionStorage.getItem('token');

        if(!!token) {
            this.props.router.push('/dashboard');
        }
    }

    render = () => {
        return (
            <div id="container">
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div className="container-fluid clearfix">
                        <div className="navbar-header">
                            <a href='/'>
                                <img src="/img/logo.png" alt="" height='50px' width='auto' style={{ padding: 5, margin: '0 auto' }}/>
                            </a>
                        </div>
                    </div>
                </nav>
                <div className='content'>
                    <div className="well well-lg home-panel">
                        <h1>Develop a professional way to monitor your health. </h1>
                        <a className='btn btn-success' href="/login">
                            Log In
                        </a>
                        <a className='btn btn-info' href='/signup'>
                            Sign Up
                        </a>
                    </div>
                    <div id="footer">
                        Copyright &copy; GreatCatch.com
                    </div>
                </div>
            </div>
        );
    }
};

export default withRouter(HomePage);