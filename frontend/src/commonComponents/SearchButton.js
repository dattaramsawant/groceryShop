import React, { useState } from 'react'

export default function SearchButton(props) {
    const [search,setSearch]=useState(false)

    const searchClick=()=>{
        setSearch(!search)
    }
    return (
        <div className='position-relative'>
            <input type='text' className={`searchBox ${search ? 'searchClick':'searchUnclick'}`} {...props} />  
            <button className="addDataPrimaryButton ml-2" onClick={searchClick}>
                <i className="fa fa-search"></i>
                <span className="tooltipText positionBottom">{props.tooltip}</span>
            </button> 
        </div>
    )
}
