import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
    const [searchClick,setSearchClick]=useState(false)

    const handleChange=(e)=>{

    }

    const handleSearchClick=()=>{
        setSearchClick(!searchClick)
    }
    return (
        <div className="container-fluid">
            <div className="topNavbar row">
                <div className="col-md-6 d-flex align-items-center">
                    <Link to="/" className="navLogo align-self-start">
                        <img src='/logoSuperMarket.png' className="logo"/>
                    </Link>
                </div>

                <div className='align-self-center topNavRight col-md-6 justify-content-end'>
                    <Link to="/signin" className="topNavTag">Sign In</Link>
                    <Link to="/signup" className="topNavTag">Sign Up</Link>
                </div>
            </div>
        </div>
    )
}
