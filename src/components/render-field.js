import React from 'react';

const renderField = ({ input, label, type, labelText, meta: { touched, error, warning }}) => {
    return (
        <div className={`form-group ${touched && error ? 'has-danger' : ''}`}>
            <label>{labelText}</label>
            <input className='form-control' type={type} {...input} />
            {touched &&
                ((error && <span className='text-help'>{error}</span>)
                || (warning && <span className='text-help'>{warning}</span>))
            }
        </div>
    );
};

export default renderField;
