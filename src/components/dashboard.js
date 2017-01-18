import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { fetchUserData } from '../actions/index';

class Dashboard extends Component {
    componentWillMount = () => {
        this.props.fetchUserData(this.props.token);
    }

    render = () => {
        if(_.isEmpty(this.props.userData)) {
            return <h2>Loading...</h2>;
        }

        return(
            <h2>This is a dashboard for {this.props.userData.fullName}</h2>
        );
    }
}

const mapStateToProps = (state) => {
    console.log(state);
    return {
        token: state.auth.token,
        userData: state.userData
    };
};

export default connect(mapStateToProps, { fetchUserData })(Dashboard);
