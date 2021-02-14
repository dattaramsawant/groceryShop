import React, { useEffect, useState } from 'react'

export default function Toaster(props) {
    const [icon,setIcon]=useState()
    const [status,setStatus]=useState()
    const [position,setPosition]=useState()

    const iconCase=()=>{
        const status=props.status

        if(status==="success"){
            setIcon('fa-check')
            setStatus('success')
        }else{
            setIcon('fa-exclamation-circle')
            setStatus('error')
        }
    }

    const positionCase=()=>{
        const position=props.position !==undefined ? props.position : 'top-right'

        if(position==='top-right'){
            setPosition(position)
        }else if(position==='top-center'){
            setPosition(position)
        }else if(position==='top-left'){
            setPosition(position)
        }else if(position==='bottom-right'){
            setPosition(position)
        }else if(position==='bottom-center'){
            setPosition(position)
        }else if(position==='bottom-left'){
            setPosition(position)
        }else{
            setPosition('top-right')
        }
    }
    
    useEffect(()=>{
        iconCase()
        positionCase()
    },[props.status,props.position])
    
    return (
        <div className={`toasterBox ${status} ${position}`}>
            <i className={`fa ${icon} toasterIcon`} />
            <p className="toasterMsg">{props.msg}</p>
        </div>
    )
}

