import React, { useState } from 'react'
import { carouselCard } from '../customHook/useCarouselCard'

export default function ProductCarouselCard({noOfSlidePerScreen,items,keys}) {
    return (
        <>
            {keys.map((data,i)=>{
                const item=carouselCard(data,i,noOfSlidePerScreen,items)
                return(
                    <li 
                        key={i} 
                        style={item.styles}
                        className='productCarouselImg'
                    >
                        <img 
                            src={item.data}
                            className='productImgModal'
                        />
                    </li>
                )
            })}
        </>
    )
}
