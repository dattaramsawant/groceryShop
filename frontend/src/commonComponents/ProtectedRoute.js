import React from 'react'
import { Route, Redirect } from 'react-router-dom'

export const ProtectedRoute=({component:Component,...rest}) => {
    var login = window.localStorage.getItem('grocery');
        return (
            <Route
                {...rest}
                render={props => {
                    if(login){
                    return <Component {...props}/>;
                    }else{
                        return(
                            <Redirect
                                to={{
                                    pathname:'/',
                                    state:{
                                        from:props.location
                                    }
                                }}
                            />
                        )
                    }
                }}
                />
        )
}