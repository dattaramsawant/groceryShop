import React, { useState } from 'react'
import { BASEURL, PRODUCT } from '../../api/APIEndpoints'
import APIServices from '../../api/APIServices'
import Tables from '../../commonComponents/Tables'

export default function ProductTable(props) {
    const [header]=useState([
        {headerName:"Product Images"},
        {headerName:"Product Name"},
        {headerName:"Category"},
        {headerName:"Sub-Category"},
        {headerName:"Product Price"},
        {headerName:"Quantity"},
        {headerName:"Available"},
        {headerName:"Action"}
    ])

    return (
        <>
            <Tables
                header={header}
            >
                {props.data.map(data=>(
                    <tr key={data._id} className="dataRow">
                        <td>
                            {data.productImg.length>0 &&
                                <img 
                                    src={data.productImg[0]} 
                                    className="productImgInTable" 
                                    loading="lazy"
                                    onClick={()=>props.productImgClick(data)}
                                />                           
                            }
                        </td>
                        <td>{data.name}</td>
                        <td>{data.category.name}</td>
                        <td>{data.subCategory.name}</td>
                        <td>{data.price}</td>
                        <td>{data.quantity}</td>
                        <td>{data.available.toString()}</td>
                        <td>
                            <div className="d-flex align-item-center w-100">
                                <img src='/icons/pencil.svg' className="editIcon cursor" onClick={()=>props.editClick(data)}/>
                                <img src='/icons/delete.svg'className="deleteIcon cursor" onClick={()=>props.deleteProduct(data)} />
                            </div>
                        </td>
                    </tr>
                ))}
            </Tables>
        </>
    )
}
