import React, { useState } from 'react'
import Tables from '../../../commonComponents/Tables'

export default function TypeTable(props) {
    const [header]=useState([
        {headerName:"Type"},
        {headerName:"Type Details"},
        {headerName:"Action"},
    ])

    const deleteType=(data)=>{
        props.deleteType(data)
    }
    return (
        <>
            <Tables
                header={header}
            >
                {props.data.map(data=>(
                    <tr key={data._id} className="dataRow">
                        <td className="width20">{data.name}</td>
                        <td>
                            {data.typeDetails.length>0 && 
                                data.typeDetails.map((typeDetail,i)=>(
                                    <div key={typeDetail._id}>
                                        <p className="textBold">{i+1 + '. ' +typeDetail.category.name}</p>
                                        <ul>
                                            {typeDetail.subCategory.map(subCat=>(
                                                <li key={subCat._id}>
                                                    {subCat.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            }
                        </td>
                        <td>
                            <div className="d-flex align-items-center">
                                <img src='/icons/pencil.svg' className="editIcon cursor" onClick={()=>props.editClick(data)}/>
                                <img src='/icons/delete.svg'className="deleteIcon cursor" onClick={()=>deleteType(data)} />
                            </div>
                        </td>
                    </tr>
                ))}
            </Tables>
        </>
    )
}
