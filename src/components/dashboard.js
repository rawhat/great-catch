import React, { Component } from 'react';
import { withRouter } from 'react-router';
import _ from 'lodash';
import Chart from 'chart.js';
import axios from 'axios';
import Modal from 'react-modal';

function convertToArray(std, data) {
    //calc mean
    let dataSum = data.reduce((sum, next) => sum + next, 0);
    let dataMean = dataSum / data.length;

    return {
        stdDevUpper: Array(data.length).fill(dataMean + std),
        stdDevLower: Array(data.length).fill(dataMean - std),
    };
}

class Dashboard extends Component {
    constructor(props) {
        super(props);

        let username = sessionStorage.getItem('username');

        this.state = {
            username,
            access_token: '',
            editing: false,
            addingCaretaker: false,
            addingMedicine: false,
            firstName: '',
            lastName: '',
            email: '',
            medicines: [],
            caretakers: [],
            stepCounts: [],
            heartRates: [],
            alerts: [],
            analysis: '',
            zipCode: -1,
        };
    }

    componentWillMount = () => {
        this.getUserProfile();
        this.getAccessToken();
    };

    changeEditStatus = () => {
        this.setState({
            editing: !this.state.editing,
        });
    };

    makeGraphQLQuery = async query => {
        let response = await axios.post(
            '/graphql',
            { query },
            { headers: this.headerObject() }
        );
        return response;
    };

    editProfile = async () => {
        let firstName = this.firstName.value;
        let lastName = this.lastName.value;
        let email = this.emailAddress.value;

        let graphqlQuery = `
            mutation {
                updateUser(username: "${this.state.username}", updateUser: {
                    firstName: "${firstName}"
                    lastName: "${lastName}"
                    email: "${email}"
                }) {
                    username
                }
            }
        `;

        // let response = await axios.post('/graphql', { query: graphqlQuery });
        let response = await this.makeGraphQLQuery(graphqlQuery);
        if (response.status === 200) {
            this.changeEditStatus();
            this.getUserProfile();
        } else {
            console.log('error in graphql mutation');
        }
    };

    toggleAddingCaretaker = () => {
        this.setState({
            addingCaretaker: !this.state.addingCaretaker,
        });
    };

    addCaretaker = async () => {
        let role = this.caretakerRole.value;
        let email = this.caretakerEmail.value;
        let phone = this.caretakerPhone.value;

        let graphqlQuery = `
            mutation {
                addCaretaker(username: "${this.state.username}", caretaker: {
                    email: "${email}",
                    role: "${role}",
                    phone: "${phone}"
                }) {
                    email
                }
            }
        `;

        let response = await this.makeGraphQLQuery(graphqlQuery);
        if (response.status === 200) {
            this.setState(
                {
                    addingCaretaker: false,
                },
                () => {
                    this.getUserProfile();
                }
            );
        }
    };

    toggleAddingMedicine = () => {
        this.setState({
            addingMedicine: !this.state.addingMedicine,
        });
    };

    addMedicine = async () => {
        let name = this.medicineName.value;
        let dosage = this.medicineDosage.value;
        let frequency = this.medicineFrequency.value;
        let additionalInstructions = this.medicineAdditionalInstructions.value;
        let sideEffects = this.medicineSideEffects.value;

        if (!additionalInstructions) {
            additionalInstructions = '';
        }

        if (!sideEffects) {
            sideEffects = '';
        }

        let graphqlQuery = `
            mutation {
                addMedicine(username: "${this.state.username}", medicine: {
                    name: "${name}",
                    dosage: "${dosage}",
                    frequency: "${frequency}",
                    additionalInstructions: [${additionalInstructions}],
                    sideEffects: [${sideEffects}]
                }) {
                    name
                }
            }
        `;

        let response = await this.makeGraphQLQuery(graphqlQuery);
        if (response.status === 200) {
            this.setState(
                {
                    addingMedicine: false,
                },
                () => {
                    this.getUserProfile();
                }
            );
        }
    };

    headerObject = () => {
        return { Authorization: `Bearer ${sessionStorage.getItem('token')}` };
    };

    getUserProfile = async () => {
        let graphqlQuery = `
            {
                user(username: "${this.state.username}") {
                    firstName
                    lastName
                    email
                    zipCode
                    medicines {
                        name
                    }
                    caretakers {
                        email
                    }
                    data {
                        stepCounts
                        heartRates
                        stepCountStdDev
                        heartRateStdDev
                    }
                    alerts {
                        date
                        priority
                        contact
                        message
                    }
                }
            }
        `;

        let response = await this.makeGraphQLQuery(graphqlQuery);

        if (response.status === 200) {
            let {
                firstName,
                lastName,
                email,
                medicines,
                caretakers,
                data,
                zipCode,
                alerts,
            } = response.data.data.user;
            this.setState(
                {
                    firstName,
                    lastName,
                    email,
                    medicines: medicines.map(medicine => medicine.name),
                    caretakers: caretakers.map(caretaker => caretaker.email),
                    stepCounts: data.stepCounts.map(Number),
                    heartRates: data.heartRates.map(Number),
                    stepCountStdDev: data.stepCountStdDev,
                    heartRateStdDev: data.heartRateStdDev,
                    zipCode,
                    alerts,
                },
                () => {
                    this.drawStepChart();
                    this.drawHeartRateChart();
                    this.runAnalysis();
                }
            );
        } else {
            console.error('Error from GraphQL server.');
        }
    };

    getAccessToken = async () => {
        try {
            let response = await axios.get('/user/profile', {
                headers: this.headerObject(),
            });
            let { auth_token } = response.data;

            this.setState(state => {
                return {
                    ...state,
                    access_token: auth_token,
                };
            });
        } catch (e) {
            console.error('Not authorized');
        }
    };

    getFitbitData = async () => {
        // let dataType = this.dataType.value;
        // let dateRange = this.dateRange.value;
        // let selectedDate = this.selectedDate.value;

        let response = await axios.post(
            '/api/fitbit',
            {},
            // {
            //     dataType,
            //     dateRange,
            //     selectedDate,
            // },
            { headers: this.headerObject() }
        );

        let { stepCounts, heartRates } = response.data;

        stepCounts = stepCounts['activities-steps']
            .slice(-14)
            .map(step => parseInt(step.value));

        heartRates = heartRates['activities-heart']
            .slice(-14)
            .map(
                heart =>
                    (heart.value.restingHeartRate
                        ? parseInt(heart.value.restingHeartRate)
                        : null)
            );

        this.setState(
            {
                stepCounts,
                heartRates,
            },
            () => {
                this.drawHeartRateChart();
                this.drawStepChart();
                this.runAnalysis();
            }
        );
    };

    drawStepChart = () => {
        let labels = _.range(0, this.state.stepCounts.length)
            .reverse()
            .map(index => {
                let newDate = new Date();
                newDate = new Date(newDate.setDate(newDate.getDate() - index));
                return newDate.toDateString();
            });

        let { stdDevUpper, stdDevLower } = convertToArray(
            this.state.stepCountStdDev,
            this.state.stepCounts
        );

        this.stepCountChart = new Chart(this.stepChart, {
            type: 'line',
            data: {
                type: 'line',
                labels,
                datasets: [
                    {
                        label: 'Step Count',
                        data: this.state.stepCounts,
                        borderColor: 'rgba(255, 159, 64, 1)',
                        fill: false,
                        pointRadius: 5,
                    },
                    {
                        label: 'Step Count + STD',
                        data: stdDevUpper,
                        borderColor: 'rgba(50, 153, 255,0.4)',
                        fill: false,
                        pointRadius: 0,
                    },
                    {
                        label: 'Step Count - STD',
                        data: stdDevLower,
                        borderColor: 'rgba(50, 153, 255,0.4)',
                        fill: false,
                        pointRadius: 0,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    yAxes: [
                        {
                            scaleLabel: {
                                display: true,
                                labelString: 'Step Count (n)',
                            },
                        },
                    ],
                },
            },
        });

        this.stepCountChart.update();
    };

    drawHeartRateChart = () => {
        let labels = _.range(0, this.state.stepCounts.length)
            .reverse()
            .map(index => {
                let newDate = new Date();
                newDate = new Date(newDate.setDate(newDate.getDate() - index));
                return newDate.toDateString();
            });

        let { stdDevUpper, stdDevLower } = convertToArray(
            this.state.heartRateStdDev,
            this.state.heartRates
        );

        this.heartChart = new Chart(this.heartRateChart, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Heart Rate',
                        data: this.state.heartRates,
                        borderColor: 'rgba(255, 159, 64, 1)',
                        fill: false,
                        pointRadius: 5,
                    },
                    {
                        label: 'Heart Rate + STD',
                        data: stdDevUpper,
                        borderColor: 'rgba(50, 153, 255,0.4)',
                        fill: false,
                        pointRadius: 0,
                    },
                    {
                        label: 'Heart Rate - STD',
                        data: stdDevLower,
                        borderColor: 'rgba(50, 153, 255,0.4)',
                        fill: false,
                        pointRadius: 0,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    yAxes: [
                        {
                            scaleLabel: {
                                display: true,
                                labelString: 'Heart Rate (bpm)',
                            },
                        },
                    ],
                },
            },
        });

        this.heartChart.update();
    };

    runAnalysis = async () => {
        let data = {
            steps: this.state.stepCounts,
            heartRates: this.state.heartRates,
            drug: this.state.medicines.length ? this.state.medicines[0] : 'N/A',
            zip: this.state.zipCode,
        };

        try {
            let response = await axios.post('/analysis/step', { data });
            this.setState({
                analysis: response.data,
            });
        } catch (err) {
            console.error(err);
        }
    };

    signOut = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('email');

        this.props.router.push('/');
    };

    render = () => {
        let analysisContent = null;
        if (this.state.analysis) {
            let alertClass = this.state.analysis.search('AND') === -1
                ? 'alert-info'
                : 'alert-warning';
            analysisContent = (
                <div style={{ width: '50%', margin: '0 auto' }}>
                    <div
                        className={`alert ${alertClass}`}
                        dangerouslySetInnerHTML={{
                            __html: this.state.analysis,
                        }}
                    />
                </div>
            );
        }

        return (
            <div className="container-fluid">
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div className="container-fluid clearfix">
                        <div className="navbar-header">
                            <a href="/">
                                <img
                                    src="/img/logo.png"
                                    alt=""
                                    height="50px"
                                    width="auto"
                                    style={{ padding: 5, margin: '0 auto' }}
                                />
                            </a>
                        </div>
                        <a
                            href="#"
                            className="btn btn-warning navbar-btn navbar-right"
                            onClick={this.signOut}
                        >
                            Sign Out
                        </a>
                    </div>
                </nav>

                <div className="content">
                    <div id="profileBody">
                        <div id="banner">
                            <h2>
                                Welcome,
                                {' '}
                                <span id="userName">{this.state.username}</span>
                            </h2>
                        </div>

                        <div
                            className="list-group"
                            style={{ margin: '0 auto', width: '40%' }}
                        >
                            <div className="list-group-item clearfix">
                                <span className="pull-left">
                                    <strong>First Name</strong>
                                </span>
                                <span className="pull-right">
                                    {this.state.editing
                                        ? <input
                                              type="text"
                                              ref={firstName =>
                                                  this.firstName = firstName}
                                              defaultValue={
                                                  this.state.firstName
                                              }
                                          />
                                        : <span
                                              ref={firstName =>
                                                  this.firstName = firstName}
                                          >
                                              {this.state.firstName}
                                          </span>}
                                </span>
                            </div>
                            <div className="list-group-item clearfix">
                                <span className="pull-left">
                                    <strong>Last Name</strong>
                                </span>
                                <span className="pull-right">
                                    {this.state.editing
                                        ? <input
                                              type="text"
                                              ref={lastName =>
                                                  this.lastName = lastName}
                                              defaultValue={this.state.lastName}
                                          />
                                        : <span
                                              ref={lastName =>
                                                  this.lastName = lastName}
                                          >
                                              {this.state.lastName}
                                          </span>}
                                </span>
                            </div>
                            <div className="list-group-item clearfix">
                                <span className="pull-left">
                                    <strong>Email Address</strong>
                                </span>
                                <span className="pull-right">
                                    {this.state.editing
                                        ? <input
                                              type="text"
                                              ref={emailAddress =>
                                                  this.emailAddress = emailAddress}
                                              defaultValue={this.state.email}
                                          />
                                        : <span
                                              ref={emailAddress =>
                                                  this.emailAddress = emailAddress}
                                          >
                                              {this.state.email}
                                          </span>}
                                </span>
                            </div>
                            <div className="list-group-item clearfix">
                                <span className="pull-left">
                                    <strong>Emergency Contact(s)</strong>
                                </span>
                                <span
                                    className="pull-right"
                                    ref={emergencyContacts =>
                                        this.emergencyContacts = emergencyContacts}
                                >
                                    {this.state.caretakers.length
                                        ? this.state.caretakers.join(', ')
                                        : 'None provided'}
                                    {this.state.editing
                                        ? <div
                                              style={{ marginLeft: 10 }}
                                              className="btn btn-default"
                                              onClick={
                                                  this.toggleAddingCaretaker
                                              }
                                          >
                                              Add
                                          </div>
                                        : null}
                                    <Modal
                                        isOpen={this.state.addingCaretaker}
                                        style={{
                                            content: {
                                                width: '40%',
                                                margin: '75px auto 0 auto',
                                                height: '75vh',
                                            },
                                        }}
                                        shouldCloseOnOverlayClick={false}
                                        onRequestClose={
                                            this.toggleAddingCaretaker
                                        }
                                        contentLabel="Add Caretaker"
                                    >
                                        <div className="form-content">
                                            <div
                                                className="btn btn-danger"
                                                onClick={
                                                    this.toggleAddingCaretaker
                                                }
                                            >
                                                Close
                                            </div>
                                            <h2>Adding a Caretaker</h2>
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    Role
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    ref={caretakerRole =>
                                                        this.caretakerRole = caretakerRole}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    Email
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    ref={caretakerEmail =>
                                                        this.caretakerEmail = caretakerEmail}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    Phone
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Optional"
                                                    ref={caretakerPhone =>
                                                        this.caretakerPhone = caretakerPhone}
                                                />
                                            </div>
                                            <button
                                                className="btn btn-success"
                                                onClick={this.addCaretaker}
                                            >
                                                Add Caretaker
                                            </button>
                                        </div>
                                    </Modal>
                                </span>
                            </div>
                            <div className="list-group-item clearfix">
                                <span className="pull-left">
                                    <strong>Medicine(s)</strong>
                                </span>
                                <span
                                    className="pull-right"
                                    ref={medicines =>
                                        this.medicines = medicines}
                                >
                                    {this.state.medicines.length
                                        ? this.state.medicines.join(', ')
                                        : 'None provided'}
                                    {this.state.editing
                                        ? <div
                                              style={{ marginLeft: 10 }}
                                              className="btn btn-default"
                                              onClick={
                                                  this.toggleAddingMedicine
                                              }
                                          >
                                              Add
                                          </div>
                                        : null}
                                    <Modal
                                        isOpen={this.state.addingMedicine}
                                        style={{
                                            content: {
                                                width: '40%',
                                                margin: '75px auto 0 auto',
                                                height: '75vh',
                                            },
                                        }}
                                        shouldCloseOnOverlayClick={false}
                                        onRequestClose={
                                            this.toggleAddingMedicine
                                        }
                                        contentLabel="Add Medicine"
                                    >
                                        <div className="form-content">
                                            <div
                                                className="btn btn-danger"
                                                onClick={
                                                    this.toggleAddingMedicine
                                                }
                                            >
                                                Close
                                            </div>
                                            <h2>Adding a Medicine</h2>
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    Name
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    ref={medicineName =>
                                                        this.medicineName = medicineName}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    Dosage
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    ref={medicineDosage =>
                                                        this.medicineDosage = medicineDosage}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    Frequency
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    ref={medicineFrequency =>
                                                        this.medicineFrequency = medicineFrequency}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    Additional Instructions
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    ref={medicineAdditionalInstructions =>
                                                        this.medicineAdditionalInstructions = medicineAdditionalInstructions}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    Side Effects
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    ref={medicineSideEffects =>
                                                        this.medicineSideEffects = medicineSideEffects}
                                                />
                                            </div>
                                            <button
                                                className="btn btn-success"
                                                onClick={this.addMedicine}
                                            >
                                                Add Medicine
                                            </button>
                                        </div>
                                    </Modal>
                                </span>
                            </div>
                        </div>

                        <div
                            className="row"
                            style={{
                                textAlign: 'center',
                                marginLeft: 0,
                                marginRight: 0,
                            }}
                        >
                            {this.state.alerts && this.state.alerts.length
                                ? <button
                                      className="btn btn-success"
                                      onClick={() =>
                                          this.props.router.push('/alerts')}
                                      style={{ margin: 20 }}
                                  >
                                      Alert History
                                  </button>
                                : null}
                            {this.state.editing
                                ? <div
                                      className="btn btn-success"
                                      onClick={this.editProfile}
                                      style={{ margin: 20 }}
                                  >
                                      Save Changes
                                  </div>
                                : <div
                                      className="btn btn-warning"
                                      onClick={this.changeEditStatus}
                                      style={{ margin: 20 }}
                                  >
                                      Edit Profile
                                  </div>}
                            {!this.state.access_token
                                ? <a
                                      href="/auth/fitbit"
                                      className="btn btn-primary"
                                      style={{ margin: 20 }}
                                  >
                                      Authorize FitBit
                                  </a>
                                : <button
                                      className="btn btn-info"
                                      style={{ margin: 20 }}
                                      onClick={this.getFitbitData}
                                  >
                                      Get FitBit Data
                                  </button>}
                        </div>
                        {/*
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
                    </div>*/}

                        <div className="alert-content">
                            {analysisContent}
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <h4>Step Counts</h4>
                                <div className="chart-container">
                                    <div>
                                        <canvas
                                            style={{
                                                margin: '0 auto',
                                                width: '100% !important',
                                                maxWidth: 800,
                                                height: 'auto !important',
                                            }}
                                            className="profile-chart"
                                            ref={stepChart =>
                                                this.stepChart = stepChart}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <h4>Heart Rates</h4>
                                <div className="chart-container">
                                    <div>
                                        <canvas
                                            style={{
                                                margin: '0 auto',
                                                width: '100% !important',
                                                maxWidth: 800,
                                                height: 'auto !important',
                                            }}
                                            className="profile-chart"
                                            ref={heartRateChart =>
                                                this.heartRateChart = heartRateChart}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="footer">
                        Copyright © GreatCatch.com
                    </div>
                </div>
            </div>
        );
    };
}

export default withRouter(Dashboard);
