import React from 'react'
import { Link } from 'react-router-dom'

export default function PageNotFound() {
    return (
        <div className="pageNotFoundMain">
            <div className='row align-items-center h-100'>
                <div className="col-md-6 col-12">
                    <div className='pageNotFoundCircle'>
                        <div className="errorTextMain">
                            <p className="errorNumber">404</p>
                            <p className="errorText">Page Not Found</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-12">
                    <p className="notFoundText">Oops!</p>
                    <p className="notFoundMsgTag">page not found on server</p>
                    <p className='notFoundMsg'>
                        The link you followed is either outdated, inaccurate, or the server has been instructed not to let 
                        you have it.
                    </p>
                    <div className="mainPageLink">
                        <Link to='/' exact>
                            Go to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
