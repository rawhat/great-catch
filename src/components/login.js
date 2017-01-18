import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router';

import { loginUser, fetchData } from '../actions/index';

class Login extends Component {
    static contextTypes = {
        router: React.PropTypes.object
    }

    onSubmit = (props) => {
        console.log('attempting login');
        this.props.loginUser(props);
    }

    componentWillReceiveProps = (nextProps) => {
        console.log(nextProps);
        if(nextProps.token) {
            sessionStorage.setItem('jwt', nextProps.token);
            this.context.router.push('/');
        }
    }

    render = () => {
        const { handleSubmit } = this.props;

        return (
            <div className="login-area">
                <form onSubmit={handleSubmit(this.onSubmit)}>
                    <Field name='username' labelText='Username' type='text' component={renderField} />
                    <Field name='password' labelText='Password' type='password' component={renderField} />
                    <button type='submit' className="btn btn-primary">Login</button>
                    <Link to='/' className="btn btn-danger">Cancel</Link>
                </form>
            </div>
        );
    }
}

const renderField = ({ input, label, type, labelText, meta: { touched, error, warning }}) => {
    return (
        <div className={`form-group ${touched && error ? 'has-danger' : ''}`}>
            <label>{labelText}</label>
            <input className='form-control' type={type} {...input} />
            {touched &&
                ((error && <span className='text-help'>{error}</span>)
                || (warning && <span className='text-help'>{warning}</span>))
            }
        </div>
    );
};

const validate = () => {
    return {};
};

const LoginComponent = reduxForm({
    form: 'Login',
    validate,
    fields: [ 'username', 'password' ]
})(Login);

const mapStateToProps = (state) => {
    return {
        data: state.data,
        token: state.authentication.token
    };
};

export default connect(mapStateToProps, { loginUser, fetchData })(LoginComponent);
