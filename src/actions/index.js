import axios from 'axios';

import {
    FETCH_DATA,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_AUTH_REFRESH,
    USER_CREATE_SUCCESS,
    USER_CREATE_FAIL,
    FETCH_USER_DATA
} from './types';

const SERVER_URL = 'http://localhost:3333';

export function loginUser(formData) {
    // return (dispatch) => {
    //     return axios.get('http://jsonplaceholder.typicode.com/users')
    //     .then(res => {
    //         dispatch({
    //             type: FETCH_DATA,
    //             payload: res.data
    //         });
    //     });
    // };
    console.log(formData);
    return (dispatch) => {
        axios.post(`${SERVER_URL}/login`, formData)
        .then((response) => {
            console.log(response);
            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: response
            });
        });
    };
}

export function authExistingUser(token) {
    return {
        type: USER_AUTH_REFRESH,
        payload: token
    };
}

export function createUser(formData) {
    // REPLACE WITH AXIOS POST CALL
    return (dispatch) => {
        axios.post('/user/create', formData)
        .then((res) => {
            dispatch({
                type: USER_CREATE_SUCCESS,
                payload: res.data.token
            });
        });
    };
}

export function fetchUserData(token) {
    return (dispatch) => {
        axios.get('/user/profile', { headers: { Authorization: token }})
        .then((res) => {
            dispatch({ type: FETCH_USER_DATA, payload: res });
        });
    };
}

export function fetchData() {
    return (dispatch) => {
        dispatch({
            type: FETCH_DATA,
            payload: [{ username: 'amanning', password: 'password' }]
        });
    };
}