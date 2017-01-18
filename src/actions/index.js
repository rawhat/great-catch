import axios from 'axios';

import { FETCH_DATA, USER_LOGIN_SUCCESS } from './types';

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

export function fetchData() {
    return (dispatch) => {
        dispatch({
            type: FETCH_DATA,
            payload: [{ username: 'amanning', password: 'password' }]
        });
    };
}
