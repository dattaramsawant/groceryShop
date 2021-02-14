import React from 'react'
import ProfileButton from '../../commonComponents/profile/ProfileButton'

export default function AdminTopBar(props) {
    return (
        <div className="adminTopBar">
            <div className="d-flex justify-content-between align-items-center h-100 pl-3 pr-3">
                <p className="pageName">{props.pageName}</p>
                <div className="d-flex align-items-center">
                    {props.children}
                    <ProfileButton />
                </div>
            </div>
        </div>
    )
}
