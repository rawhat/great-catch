import React, { Component } from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';

class Alerts extends Component {
    state = {
        firstName: '',
        lastName: '',
        email: '',
        alerts: [],
    };

    componentDidMount() {
        let username = sessionStorage.getItem('username');
        this.setState(
            {
                username,
            },
            () => {
                this.getUserProfile();
            }
        );
    }

    makeGraphQLQuery = async query => {
        let response = await axios.post(
            '/graphql',
            { query },
            { headers: this.headerObject() }
        );
        return response;
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
                alerts,
            } = response.data.data.user;

            this.setState({
                firstName,
                lastName,
                email,
                alerts,
            });
        } else {
            console.error('Error from GraphQL server.');
        }
    };

    signOut = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('email');

        this.props.router.push('/');
    };

    render() {
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
                    <div style={{ textAlign: 'center' }}>
                        <button
                            className="btn btn-danger"
                            onClick={() => this.props.router.push('/dashboard')}
                        >
                            Back
                        </button>
                        <h2>
                            Hello,
                            {' '}
                            {this.state.firstName}
                            .  This is your alert history.
                        </h2>
                    </div>
                    <div style={{ width: '60%', margin: '0 auto' }}>
                        {this.state.alerts && this.state.alerts.length
                            ? <table className="table table-bordered table-hover">
                                  <thead>
                                      <tr>
                                          <th>Date</th>
                                          <th>Severity</th>
                                          <th>Message</th>
                                          <th>Contact</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {this.state.alerts.map((alert, index) => (
                                          <tr key={index}>
                                              <td>{alert.date}</td>
                                              <td>{alert.priority}</td>
                                              <td
                                                  dangerouslySetInnerHTML={{
                                                      __html: alert.message,
                                                  }}
                                              />
                                              <td>{alert.contact}</td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                            : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Alerts);
