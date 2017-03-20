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
            let userName = `${this.firstNameInput.value}.${this.lastNameInput.value}`;
            let password = this.passwordInput.value;
            let userEmail = this.emailInput.value;

            let response = await axios.post('/user/create', {
                username: userName,
                password,
                password_repeat: password,
                email: userEmail
            });

            console.log(response);

            let { token, username, email } = response.data;

            sessionStorage.setItem("token", token);
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("email", email);

            this.props.router.push('/dashboard');
        }
        catch(e) {
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
            <table>
                <tbody>
                    <tr>
                        <th>First Name </th>
                        <th>Last Name </th>
                    </tr>
                    <tr>
                        <th><input style={{ margin: '10px 0px' }} type="text" ref={(firstName) => this.firstNameInput = firstName} /></th>
                        <th><input type="text" ref={(lastName) => this.lastNameInput = lastName} /></th>
                    </tr>
                    <tr>
                        <th>Email Address </th>
                        <th>Password </th>
                    </tr>
                    <tr>
                        <th><input style={{ margin: '10px 0px' }} type="text" ref={(email) => this.emailInput = email} /></th>
                        <th><input type="password" ref={(password) => this.passwordInput = password} /> </th>
                    </tr>
                    <tr>
                        <th colSpan="2"> <input type="submit" value="Submit" onClick={this.signUp} /> </th>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default withRouter(SignUp);