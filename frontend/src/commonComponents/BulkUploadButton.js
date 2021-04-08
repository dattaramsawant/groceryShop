import React from 'react'

export default function BulkUploadButton(props) {
    return (
        <button className="addDataPrimaryButton ml-2" onClick={props.openModal}>
            <i className="fa fa-upload"></i>
            <span className="tooltipText positionBottom">{props.tooltip}</span>
        </button>
    )
}
