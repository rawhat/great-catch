import React, { Component } from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';

class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: ''
        };
    }

    signUp = async (ev) => {
        if(ev) ev.preventDefault();

        try {
            let usernameInput = this.username.value;
            let firstName = this.firstName.value;
            let lastName = this.lastName.value;
            let password = this.password.value;
            let password_repeat = this.passwordRepeat.value;
            let emailInput = this.emailAddress.value;

            let response = await axios.post('/user/create', {
                username: usernameInput,
                firstname: firstName,
                lastname: lastName,
                password,
                password_repeat,
                email: emailInput
            });

            console.log(response);

            let { token, username, email } = response.data;

            sessionStorage.setItem("token", token);
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("email", email);

            this.props.router.push('/dashboard');
        }
        catch(e) {
            console.log(e);
            this.setState((state) => {
                return {
                    ...state,
                    error: 'Invalid information supplied'
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
                <form className="well signup-well content signup-content form-content" onSubmit={this.signUp}>
                    <h2>Sign up to GreatCatch</h2>
                    <div className="input-group">
                        <span className="input-group-addon">First name</span>
                        <input type="text" className="form-control" ref={(firstName) => this.firstName = firstName} />
                    </div>
                    <div className="input-group">
                        <span className="input-group-addon">Last name</span>
                        <input type="text" className="form-control" ref={(lastName) => this.lastName = lastName} />
                    </div>
                    <div className="input-group">
                        <span className="input-group-addon">Username</span>
                        <input type="text" className="form-control" ref={(username) => this.username = username} />
                    </div>
                    <div className="input-group">
                        <span className="input-group-addon">Email</span>
                        <input type="text" className="form-control" ref={(emailAddress) => this.emailAddress = emailAddress} />
                    </div>
                    <div className="input-group">
                        <span className="input-group-addon">Password</span>
                        <input type="password" className="form-control" ref={(password) => this.password = password} />
                    </div>
                    <div className="input-group">
                        <span className="input-group-addon">Password Repeat</span>
                        <input type="password" className="form-control" ref={(passwordRepeat) => this.passwordRepeat = passwordRepeat} />
                    </div>
                    <button type='submit' className="btn btn-primary" onClick={this.signUp}>Sign Up</button>
                </form>
            </div>
        );
    }
}

export default withRouter(SignUp);