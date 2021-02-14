import React from 'react'
import ErrorValidation from './ErrorValidation'

export default function Input(props) {
    return (
        <div className="formInputMain">
           <p className="label">{props.label}</p>
           <input className="formInput" {...props} />
           <ErrorValidation touched={props.touched} message={props.message}/>
        </div>
    )
}
