import React from 'react'
import { withRouter,NavLink } from 'react-router-dom'

function BottomNav(props) {
    var role = JSON.parse(window.localStorage.getItem('groceryUser'))

    const dashboard=()=>{
        props.history.push('/dashboard');
        window.location.reload()
    }
    return (
        <div className='container-fluid bottomNav'>
            <div className="row h-100">
                <div className="col-md-2 p-0 h-100">
                    <div className=" d-flex flex-row catButton align-items-center justify-content-around h-100">
                        <img src='/icons/catLight.svg' />
                        <p className="catText">select category</p>
                    </div>
                </div>
                <div className="col-md-10 d-flex flex-row align-items-center ">
                    <NavLink to="/" exact activeClassName="active" className="topNavTag">Home</NavLink>
                    <NavLink to="/demo" activeClassName="active" className="topNavTag">Contact Us</NavLink>
                    {role && role.role==="admin" &&
                        <p onClick={dashboard} className="topNavTag">Dashboard</p>
                    }
                </div>
            </div>
        </div>
    )
}
export default withRouter(BottomNav)