import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom';
import useClickOutSide from '../../customHook/useClickOutsSde';

export default function ProfileButton() {
    const [dropdown,setDropdown]=useState(false)
    const userInfo=JSON.parse(window.localStorage.getItem('groceryUser'))
    const ref=useRef()

    useClickOutSide(ref,()=>{
        setDropdown(false)
    });
    const dropdownClick=()=>{
        setDropdown(!dropdown)
    }

    const signOut=()=>{
        window.localStorage.clear();
        window.location.replace("/");
    }
    return (
        <div className='position-relative' ref={ref}>
            <div className="profileAvatarButton" onClick={dropdownClick}>
                <p className="navUserName">{userInfo.name}</p>
                <div className="textIcon">{userInfo.name.charAt(0).toUpperCase()}</div>
            </div>
            {dropdown &&
                <div className="profileDropdown">
                    <NavLink activeClassName="activeDash" to={userInfo.role === 'user' ? '/profile' : '/dashboard/profile'} className="topNavTag dashNav d-flex align-items-center cursor dropdownProfileMain">
                        <i className="fa fa-user navBarIcon mr-3"></i>
                        <p className="dropdownProfileFont">My Profile</p>
                    </NavLink>

                    <div className="topNavTag dashNav d-flex align-items-center cursor dropdownProfileMain" onClick={signOut}>
                        <i className="fa fa-lock navBarIcon mr-3"></i>
                        <p className="dropdownProfileFont">Sign Out</p>
                    </div>
                </div>
            }
        </div>
    )
}
