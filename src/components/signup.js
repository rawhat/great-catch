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

    signUp = async () => {
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
                <div className="well signup-well">
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
                    <a href="#" className="btn btn-primary" onClick={this.signUp}>Sign Up</a>
                </div>
            </div>
        );
    }
}

export default withRouter(SignUp);