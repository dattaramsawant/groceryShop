import React from 'react';

const ErrorValidation =({touched,message})=>{
    if(!touched){
        return <div className="form-message invalid"></div>
    }
    if(message){
        return <div className="form-message2 invalid">{message}</div>
    }
    return <div className="form-message3 valid"></div>
}

export default ErrorValidation;