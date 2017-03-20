import React, { Component } from 'react';
import Chart from 'chart.js';
import axios from 'axios';

export default class Dashboard extends Component {
    constructor(props) {
        super(props);

        let username = sessionStorage.getItem('username');

        this.state = {
            username,
            access_token: ''
        };
    }

    componentWillMount = () => {
        this.getUserProfile();
        this.getAccessToken();
    }

    headerObject = () => {
        return { Authorization: `Bearer ${sessionStorage.getItem('token')}` };
    }

    getUserProfile = async () => {
        let response = await axios.post('/graphql', { query: `
            {
                user(username: "${this.state.username}") {
                    email
                }
            }
        `}, {
            headers: this.headerObject()
        });

        console.log(response);
    }

    getAccessToken = async () => {
        let response = await axios.get('/user/profile', { headers: this.headerObject() });
        let { auth_token } = response.data;

        this.setState((state) => {
            return {
                ...state,
                access_token: auth_token
            };
        });
    }

    getFitbitData = async () => {
        let dataType = this.dataType.value;
        let dateRange = this.dateRange.value;
        let selectedDate = this.selectedDate.value;

        let response = await axios.post('/api/fitbit', {
            dataType,
            dateRange,
            selectedDate
        }, { headers: this.headerObject() });

        this.drawChart(response.data);
    }

    drawChart = (data) => {
        var chartData = data['activities-steps'];
        this.barChart = new Chart(this.chart, {
            type: 'bar',
            data: {
                labels: chartData.map(point => point.dateTime),
                datasets: [{
                    label: 'Activities: Steps',
                    data: chartData.map(point => point.value)
                }]
            }
        });
    }

    render = () => {
        return (
            <div id="container">
                <div id="header"> 
                    <img id="logo" src="/img/logo.png"/> 
                    <div id="navi">
                        <a href="/" className="signIn">Sign Out</a>
                    </div>
                </div>
        
                <div id="profileBody">
                    <div id="banner">
                        <h2>Welcome, <span id="userName">{this.state.username}</span></h2>
                </div>
                    
                <table id="infoTable">
                    <tbody>
                        <tr>
                            <th>First Name:</th>
                            <th id="firstName"></th>
                        </tr>
                        <tr>
                            <th>Last Name:</th>
                            <th id="lastName"></th>
                        </tr>
                        <tr>
                            <th>Email Address:</th>
                            <th id="eAddress"></th>
                        </tr>
                    </tbody>
                </table>

                {!this.state.access_token ?
                <div id='fitbit-auth-link'>
                    <a href='/auth/fitbit'>
                        <button>Authorize FitBit</button>
                    </a>
                </div> : null}
                <div id="userInput">
                    <select  name="fitbit_dataType" ref={(dataType) => this.dataType = dataType}>
                        <option value="heart_rate">Heart Rate</option>
                        <option value="calories">Calories</option>
                        <option value="steps">Steps</option>
                        <option value="distance">Distance</option>
                    </select>
                
                    <select name="range" ref={(dateRange) => this.dateRange = dateRange}>
                        <option value="5_min">5 minutes</option>
                        <option value="30_min">30 minutes</option>
                        <option value="6_h">6 hours</option>
                        <option value="1_d">1 day</option>
                        <option value="15_d">15 day</option>
                    </select>
                
                    <input type="date" name="selected_date" ref={(selectedDate) => this.selectedDate = selectedDate}/>
                    
                    <button id="request_fitbit_data" type="button" onClick={this.getFitbitData} >Submit</button>
                </div>
                
                <div className='chart-container'>
                    <canvas className='profile-chart' width="400" height="400" ref={(chart) => this.chart = chart}></canvas>
                </div>
                </div>
                <div id="footer">
                    Copyright &copy; GreatCatch.com
                </div>
            </div>
        );
    }
}