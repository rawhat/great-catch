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

    login = async () => {
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
            /*<table>
                <tbody>
                    <tr>
                        <th>Username </th>
                        <th>Password </th>
                    </tr>
                    <tr>
                        <th><input style={{ margin: '10px 0px' }} type="text" ref={(username) => this.usernameInput = username} /></th>
                        <th><input type="password" ref={(password) => this.passwordInput = password} /> </th>
                    </tr>
                    <tr>
                        <th colSpan="2"> <input type="submit" value="Log In" onClick={this.login} /> </th>
                    </tr>
                    {this.state.error ? <tr><td>{this.state.error}</td></tr> : null}
                </tbody>
            </table>*/
            <div className="container-fluid">
                <div className="well login-well">
                    <h2>Log in to GreatCatch</h2>
                    <div className="input-group">
                        <span className="input-group-addon">Username</span>
                        <input type="text" className="form-control"ref={(username) => this.usernameInput = username} />
                    </div>
                    <div className="input-group">
                        <span className="input-group-addon">Password</span>
                        <input type="password" className="form-control" ref={(password) => this.passwordInput = password} />
                    </div>
                    <a className='btn btn-primary' href='#' onClick={this.login}>Login</a>
                    {this.state.error ? <div className="alert alert-danger">{this.state.error}</div> : null}
                </div>
            </div>
        );
    }
}

export default withRouter(Login);