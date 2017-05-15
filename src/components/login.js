import React, { Component } from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null
        };
    }

    login = async (ev) => {
        if(ev) ev.preventDefault();
        try {
            let response = await axios.post('/login', {
                username: this.usernameInput.value,
                password: this.passwordInput.value
            });

            let { email, token, username } = response.data;

            sessionStorage.setItem('email', email);
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('username', username);

            this.props.router.push('/dashboard');
        }
        catch(e) {
            this.setState((state) => {
                return {
                    ...state,
                    error: 'Invalid username or password.'
                };
            });
        }
    }

    render = () => {
        return (
            <div className="container-fluid">
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div className="container-fluid clearfix">
                        <div className="navbar-header">
                            <a href='/'>
                                <img src="/img/logo.png" alt="" height='50px' width='auto' style={{ padding: 5, margin: '0 auto' }}/>
                            </a>
                        </div>
                    </div>
                </nav>
                <form className="well login-well home-panel form-content" style={{ marginTop: 75 }} onSubmit={this.login}>
                    <h2>Log in to GreatCatch</h2>
                    <div className="input-group">
                        <span className="input-group-addon">Username</span>
                        <input type="text" className="form-control"ref={(username) => this.usernameInput = username} />
                    </div>
                    <div className="input-group">
                        <span className="input-group-addon">Password</span>
                        <input type="password" className="form-control" ref={(password) => this.passwordInput = password} />
                    </div>
                    <button type='submit' className='btn btn-primary' onClick={this.login}>Login</button>
                    {this.state.error ? <div className="alert alert-danger">{this.state.error}</div> : null}
                </form>
            </div>
        );
    }
}

export default withRouter(Login);