import React, { useRef } from 'react'
import useClickOutSide from '../customHook/useClickOutsSde';
import Toaster from './Toaster';

export default function Modal(props) {
    const ref=useRef()

    useClickOutSide(ref,()=>{
        if(ref.current){
            // props.outSideClick()
            console.log('click outside')
        }
    });

    return (
        <div className="modalBackground">
            <div className={`modalBox ${props.size ==="small" ? 'col-lg-6 col-md-8 col-10' : props.size==="medium" ? 'col-lg-8 col-md-10 col-12' : props.size==="large" && 'col-md-10 col-12'} `} ref={ref}>
                <div className="d-flex justify-content-between align-items-center formHeader">
                    <p className="modalName">{props.name}</p>
                    <img src="/icons/close.svg" className="cursor" onClick={props.closeModal}/>
                </div>
                <div className="modalContent">
                    {props.children}
                </div>
            </div>
        </div>
    )
}
