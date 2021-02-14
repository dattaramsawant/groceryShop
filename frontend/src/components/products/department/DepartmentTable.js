import React, { useState } from 'react'
import { BASEURL, DEPARTMENT } from '../../../api/APIEndpoints'
import APIServices from '../../../api/APIServices'
import Tables from '../../../commonComponents/Tables'

export default function DepartmentTable(props) {
    const [header]=useState([
        {headerName:"Name"},
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
                        <td className="width20">{data.name}</td>
                        <td>{data.description}</td>
                        <td>
                            <div className="d-flex align-items-center">
                                <img src='/icons/pencil.svg' className="editIcon cursor" onClick={()=>props.editClick(data)}/>
                                <img src='/icons/delete.svg'className="deleteIcon cursor" onClick={()=>props.deleteDepartment(data)} />
                            </div>
                        </td>
                    </tr>
                ))}
            </Tables>
        </>
    )
}
