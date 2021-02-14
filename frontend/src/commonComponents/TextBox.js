import React from 'react'
import ErrorValidation from './ErrorValidation'

export default function TextBox(props) {
    return (
        <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="label col-6 p-0">{props.label}</p>
            <span className="col-6 p-0">
                <textarea className="formInput formTextBox" {...props} />
                <ErrorValidation touched={props.touched} message={props.message}/>
            </span>
        </div>
    )
}
