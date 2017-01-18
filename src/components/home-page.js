import React from 'react';
import { Link } from 'react-router';

export default function() {
    return (
        <div style={{ textAlign: 'center' }}>
            <h1>The Great Catch</h1>
            <Link to='/login' className='btn btn-success'>Login</Link>
            <Link to='/signup' className="btn btn-primary">Signup</Link>
        </div>
    );
}
