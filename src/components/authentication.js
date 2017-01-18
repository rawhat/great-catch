import React, { Component } from 'react';
import { connect } from 'react-redux';

import { authExistingUser } from '../actions/index';

export default function(ComposedComponent){
    class Authentication extends Component {
        static contextTypes = {
            router: React.PropTypes.object
        }

        componentWillMount = () => {
            if(!this.props.auth.token) {
                let jwtSessionToken = sessionStorage.getItem('jwt');
                if(!jwtSessionToken) {
                    this.context.router.push('/login');
                }
                else {
                    this.props.authExistingUser(jwtSessionToken);
                }
            }
        }

        componentWillReceiveProps = (nextProps) => {
            if(!nextProps.auth.token) {
                this.context.router.push('/login');
            }
        }

        render = () => {
            return <ComposedComponent {...this.props} />;
        }
    }

    const mapStateToProps = (state) => {
        return {
            auth: state.auth
        };
    };

    return connect(mapStateToProps, { authExistingUser })(Authentication);
}
