import React, { useCallback, useEffect, useState } from 'react'

export default function Carousel(props) {
    const [ticking,setTicking]=useState(false)
    const [dot,setDot]=useState([])
    const [activeIdx,setActiveIdx]=useState()

    const length=props.length && props.length
    const slideScreen=props.noOfSlidePerScreen
    const noOfSlidePerScreen=length >= slideScreen ? slideScreen : length
    const activeButton=length === noOfSlidePerScreen ? false :true

    const prevClick=()=>{
        if(!ticking){
            setTicking(true)
            props.setKeys(prev=>(prev.map((_,i)=>prev[(i + 1 + prev.length) % prev.length])))
        }
    }
    const nextClick=()=>{
        if(!ticking){
            setTicking(true)
            props.setKeys(prev=>(prev.map((_,i)=>prev[(i - 1 + prev.length) % prev.length])))
        }
    }

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    useEffect(()=>{
        props.setKeys(Array.from(Array(length).keys()))
        
        const data=[]
        for(let i=1;i<=length;i++){
            data.push(i)
        }
        setDot(data)
    },[length])

    useEffect(()=>{
        setActiveIdx((length - (props.keys[0] % length)) % length)
    },[props.keys])
    
    useEffect(()=>{
        if (ticking) sleep(1000).then(() => setTicking(false))
    },[ticking])

    const handleDot=(data)=>{
        setActiveIdx(data)
        if(data < activeIdx){
            if(!ticking){
                setTicking(true)
                props.setKeys(prev=>(prev.map((_,i)=>prev[(i + 1 + prev.length) % prev.length])))
            }
        }
        if(data > activeIdx){
            if(!ticking){
                setTicking(true)
                props.setKeys(prev=>(prev.map((_,i)=>prev[(i - 1 + prev.length) % prev.length])))
            }
        }
    }

    return (
        <div className="carouselMain">
            <i 
                className={`fa fa-angle-left ${activeButton ? 'carouselButton' : 'carouselButton disableButton'}`}
                onClick={activeButton && prevClick} 
            />
            <div className="carouselBox">
                <ul className="carouselWrapper" style={{width:`calc((100% * ${length}) / ${noOfSlidePerScreen})`}}>
                    {props.children}
                </ul>
                <div className='carouselDots'>
                    {dot && dot.slice(0,dot.length).map((a,i) =>(
                        <div
                            key={i}
                            id={i}
                            onClick={()=>handleDot(i)}
                            className={i===activeIdx ? 'dot activeDot':'dot'}
                        />
                    ))}
                </div>
            </div>
            <i 
                className={`fa fa-angle-right ${activeButton ? 'carouselButton' : 'carouselButton disableButton'}`}
                onClick={activeButton && nextClick} 
            />
        </div>
    )
}
