import React from 'react'

export default function AddButton(props) {
    return (
        <button className="addDataPrimaryButton ml-2" onClick={props.openModal}>
            <i className="fa fa-plus"></i>
            <span className="tooltipText positionBottom">{props.tooltip}</span>
        </button>
    )
}
