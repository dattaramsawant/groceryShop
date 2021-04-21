import React, { useEffect, useRef, useState } from 'react'
import { withRouter,NavLink } from 'react-router-dom'
import useClickOutSide from '../../customHook/useClickOutsSde';
import MenuConfig from './MenuConfig';

function AdminNavbar(props) {
    const [closeNavClick,setCloseNavClick]=useState(false)
    const [dropdownClick,setDropdownClick]=useState({})
    const [dropdownOver,setDropdownOver]=useState(false)
    const ref=useRef()
    const logoClick=()=>{
        props.history.push('/');
        window.location.reload()
    }

    const arrowClick=()=>{
        setCloseNavClick(!closeNavClick)
    }
    const dropdownNavClick=(route,i)=>{
        if(!closeNavClick){
            setDropdownClick({[route.groupName]:!dropdownClick[route.groupName]})
        }
    }
    const dropdownMouseOver=()=>{
        setDropdownOver(true)
    }
    const dropdownMouseOut=()=>{
        setDropdownOver(false)
    }
    const handleRemove = e => {
        if (ref.current && !ref.current.contains(e.target)) {
            setDropdownOver(false)
        }
      };
    
      useEffect(() => {
        document.addEventListener("mouseOut", handleRemove);
    
        return () => {
          document.removeEventListener("mouseOut", handleRemove);
        };
      });
    return (
        // <div className="adminNav">
            <div className={`${closeNavClick ?'closeSideBar':'sideBar'}`}>
                <div className={`d-flex align-items-center p-3 ${closeNavClick ? 'justify-content-center' :'adminNavbarSize justify-content-between'}`}>
                    {!closeNavClick && <img src='/logoSuperMarket.png' onClick={logoClick} className="logo"/>}
                    <i className={`navBarArrow ${closeNavClick ?'fa fa-angle-double-right':'fa fa-angle-double-left'}`} onClick={arrowClick}></i>
                </div>
                <div className="sideBarMain">
                    {/* <NavLink to="/dashboard" exact activeClassName="activeDash" className="topNavTag dashNav d-flex justify-content-center align-items-center">Dashboard</NavLink>
                    <NavLink to="/dashboard/user" activeClassName='activeDash' className='topNavTag dashNav d-flex justify-content-center align-items-center'>User Management</NavLink>
                    <NavLink to="/dashboard/department" activeClassName='activeDash' className='topNavTag dashNav d-flex justify-content-center align-items-center'>Department</NavLink>
                    <NavLink to="/dashboard/product" activeClassName='activeDash' className='topNavTag dashNav d-flex justify-content-center align-items-center'>Product</NavLink> */}
                    {MenuConfig.aside.items.map((route,i)=>{
                        return(
                            route.groupName!== undefined && route.group !==undefined ?
                            <div className='adminGroupNav cursor' ref={ref}>
                                <div 
                                    className={`topNavTag dashNav d-flex align-items-center ${closeNavClick ? 'justify-content-center' : undefined}`}
                                    onClick={()=>dropdownNavClick(route,i)}
                                    // onMouseOver={closeNavClick && dropdownMouseOver} 
                                    // onMouseOut={closeNavClick && dropdownMouseOut} 
                                >
                                    <i className={`navBarIcon ${!closeNavClick ? 'mr-3' : undefined} ${route.icon}`} /> 
                                    <p className="adminNavTag">{!closeNavClick && route.groupName}</p> 
                                    <i className={` ${!dropdownClick[route.groupName] ? 'fa fa-sort-down navDropdownIconDown' : 'fa fa-sort-up navDropdownIconUp'}`} />
                                </div>

                                {(dropdownClick[route.groupName]) &&
                                    route.group.map((data,i)=>(
                                        <NavLink
                                            key={i}
                                            to={data.path}
                                            exact
                                            activeClassName="activeDash"
                                            className={`topNavTag dashNav groupDashNav d-flex align-items-center ${closeNavClick ? 'justify-content-center' : undefined}`}
                                        >
                                            <i className="fa fa-circle groupDashNavIcon" />
                                            <p>{!closeNavClick && data.name}</p>
                                            {closeNavClick && <span className="tooltipText positionRight">{data.name}</span>}
                                        </NavLink>
                                    ))
                                }
                            </div>
                            :
                            <NavLink
                                key={i} 
                                to={route.path} 
                                exact 
                                activeClassName='activeDash' 
                                className={`topNavTag dashNav d-flex align-items-center ${closeNavClick ? 'justify-content-center' : undefined}`}
                            >
                                <i className={`navBarIcon ${!closeNavClick ? 'mr-3' : undefined} ${route.icon}`} />
                                <p className="adminNavTag">{!closeNavClick && route.name}</p> 
                                {closeNavClick && <span className="tooltipText positionRight">{route.name}</span>}
                            </NavLink>
                        )
                    })}
                </div>
            </div>
        // </div>
    )
}
export default withRouter(AdminNavbar)