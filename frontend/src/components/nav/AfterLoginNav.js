import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function AfterLoginNav() {
    const [searchClick,setSearchClick]=useState(false)

    const handleChange=(e)=>{

    }

    const handleSearchClick=()=>{
        setSearchClick(!searchClick)
    }
    var userInfo = JSON.parse(window.localStorage.getItem('groceryUser'))
    console.log(userInfo)
    return (
        <div className="container-fluid sticky-top">
            <div className="topNavbar row">
                <Link to="/demo" className="logo navLogo col-md-4 align-self-start">
                    <img src='/logoSuperMarket.png' className="logo"/>
                </Link>

                <div className='align-self-center topNavRight'>
                    <div className='searchBox' style={{width:searchClick && "100%",transition: searchClick &&"width 1s cubic-bezier(0.000, 0.795, 0.000, 1.000)"}}>
                        <input 
                            type='text' 
                            name="search" 
                            onChange={handleChange} 
                            // value="search" 
                            className="searchInput" 
                            placeholder="Search for products" 
                            style={{display:searchClick && 'block',transition: searchClick &&"width 1s cubic-bezier(0.000, 0.795, 0.000, 1.000)"}}
                        />
                        <img 
                            src="/icons/search.svg" 
                            className="searchIcon"
                            onClick={handleSearchClick}
                        />
                    </div>
                    <div className="userNavTag">
                        <img src="/icons/person.svg" className="personIcon" />
                        <p className="userName">
                            {userInfo.name}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
