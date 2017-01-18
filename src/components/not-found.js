import React from 'react';
import { Link } from 'react-router';

export default () => {
    return (
        <div>
            <h2>404: Path not found.</h2>
            <Link to='/' className="btn btn-warning">Return</Link>
        </div>
    );
};
