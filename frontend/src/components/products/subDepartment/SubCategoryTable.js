import React, { useState } from 'react'
import { BASEURL, SUBDEPARTMENT } from '../../../api/APIEndpoints'
import APIServices from '../../../api/APIServices'
import Tables from '../../../commonComponents/Tables'

export default function SubCategoryTable(props) {
    const [header]=useState([
        {headerName:"Category"},
        {headerName:"Sub-Category"},
        {headerName:"Description"},
        {headerName:"Action"},
    ])

    return (
        <>
            <Tables 
                header={header}
            >
                {props.data.map(data=>(
                    <tr key={data._id} className="dataRow">
                        <td>{data.category.name}</td>
                        <td>{data.name}</td>
                        <td>{data.description}</td>
                        <td>
                            <div className="d-flex align-items-center">
                                <img src='/icons/pencil.svg' className="editIcon cursor" onClick={()=>props.editClick(data)}/>
                                <img src='/icons/delete.svg'className="deleteIcon cursor" onClick={()=>props.deleteSubDepartment(data)} />
                            </div>
                        </td>
                    </tr>
                ))}
            </Tables>
        </>
    )
}
