import React, { useState } from 'react'
import { BASEURL, BRAND } from '../../../api/APIEndpoints'
import APIServices from '../../../api/APIServices'
import Modal from '../../../commonComponents/Modal'
import Tables from '../../../commonComponents/Tables'

export default function BrandTable(props) {
    const [header]=useState([
        {headerName:"Brand Name"},
        {headerName:"Brand Category"},
        {headerName:"Action"},
    ])

    const deleteBrand=(data)=>{
        props.deleteBrand(data)
    }
    
    // const deleteBrand=async(data)=>{
    //     const url=BASEURL+BRAND+'/'+data._id
    //     const req=await new APIServices().delete(url)
    //     if(req.error){
    //         console.log(req)
    //     }else{
    //         props.updateState(data)
    //     }
    // }
    return (
        <>
            <Tables 
                header={header}
            >
                {props.data.map(data=>(
                    <tr key={data._id} className="dataRow">
                        <td className="width20">{data.brandName}</td>
                        <td>
                            <ul className='m-0 pl-3'>
                                {data.brandCategory.map((category,i) =>(
                                    <li key={i}>
                                        {category.name}
                                    </li>
                                ))}
                            </ul>
                        </td>
                        <td>
                            <div className="d-flex align-items-center">
                                <img src='/icons/pencil.svg' className="editIcon cursor" onClick={()=>props.editClick(data)}/>
                                <img src='/icons/delete.svg'className="deleteIcon cursor" onClick={()=>deleteBrand(data)} />
                            </div>
                        </td>
                    </tr>
                ))}
            </Tables>
        </>
    )
}
