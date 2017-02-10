import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router';

import { createUser } from '../actions/index';
import renderField from './render-field';

class SignUp extends Component {
    onSubmit = (props) => {
        this.props.createUser(props);
    }

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.token) {
            sessionStorage.setItem('jwt', nextProps.token);
            this.context.router.push('/dashboard');
        }
    }

    render = () => {
        const { handleSubmit } = this.props;

        return (
            <div className="signup-form-area">
                <form onSubmit={handleSubmit(this.onSubmit)}>
                    <Field name='username' labelText='Username' type='text' component={renderField} />
                    <Field name='password' labelText='Password' type='password' component={renderField} />
                    <Field name='password_repeat' labelText='Repeat Password' type='password' component={renderField} />
                    <Field name='email' labelText='Email' type='text' component={renderField} />
                    <button type='submit' className="btn btn-primary">Signup</button>
                    <Link to='/' className='btn btn-danger'>Cancel</Link>
                </form>
            </div>
        );
    }
}

const validate = () => {
    return {};
};

const SignUpComponent = reduxForm({
    form: 'SignUp',
    fields: ['username', 'password', 'password_repeat', 'email'],
    validate
})(SignUp);

const mapStateToProps = (state) => {
    console.log(state);
    return {
        token: state.auth.token
    };
};

export default connect(mapStateToProps, { createUser })(SignUpComponent);
