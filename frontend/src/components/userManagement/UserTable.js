import React, { useState } from 'react'
import Tables from '../../commonComponents/Tables'
import {BASEURL, USERS} from '../../api/APIEndpoints'
import APIServices from '../../api/APIServices'

export default function UserTable(props) {
    const [header]=useState([
        {headerName:"Name"},
        {headerName:"Email"},
        {headerName:"Created At"},
        {headerName:"Updated At"},
        {headerName:"Role"}
    ])

    const handleChange=async(e,data)=>{
        if(e.target.value !==""){
            if(e.target.name==data._id){
                const url=BASEURL+USERS+'/'+data._id
                const data2={
                    role:e.target.value
                }
                const req=await new APIServices().patch(url,data2)
                // if(!req.error){
                    props.updateState(req.results)
                // }
            }
        }
    }
    return (
        <>
            <Tables header={header}>
                {props.user.map(data=>{
                    const createdAt=new Date(data.createdAt)
                    const createdAtDate=createdAt.getDate()+'/'+createdAt.getMonth()+'/'+createdAt.getFullYear()
                    const createdAtTime=createdAt.getHours()+':'+createdAt.getMinutes()+':'+createdAt.getSeconds()
                    const createdAtMain=createdAtDate + " " + createdAtTime

                    const updatedAt=new Date(data.updatedAt)
                    const updatedAtDate=updatedAt.getDate()+'/'+updatedAt.getMonth()+'/'+updatedAt.getFullYear()
                    const updatedAtTime=updatedAt.getHours()+':'+updatedAt.getMinutes()+':'+updatedAt.getSeconds()
                    const updatedAtMain=updatedAtDate + " " + updatedAtTime
                    return(
                        <tr key={data._id} className="dataRow">
                            <td>{data.name}</td>
                            <td>{data.email}</td>
                            <td>{createdAtMain}</td>
                            <td>{updatedAtMain}</td>
                            <td>
                                <select
                                    name={data._id}
                                    value={data.role}
                                    onChange={(e)=>handleChange(e,data)}
                                    className="roleDropdown"
                                >
                                    <option></option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                    <option value="moderator">Moderator</option>
                                </select>
                            </td>
                        </tr>
                    )
                })}
            </Tables>
        </>
    )
}
