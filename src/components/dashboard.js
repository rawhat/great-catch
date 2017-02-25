import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { fetchUserData, fetchFitbitData } from '../actions/index';

class Dashboard extends Component {
    componentWillMount = () => {
        this.props.fetchUserData(this.props.token);
    }

    render = () => {
        if(_.isEmpty(this.props.userData)) {
            return <h2>Loading...</h2>;
        }

        return(
            <h2>This is a dashboard for {this.props.user_data.fullName}</h2>
            <button className='btn'>Get FitBit Data</button>
        );
    }
}

const mapStateToProps = (state) => {
    console.log(state);
    return {
        token: state.auth.token,
        user_data: state.auth.user_data
    };
};

export default connect(mapStateToProps, { fetchUserData, fetchFitbitData })(Dashboard);
