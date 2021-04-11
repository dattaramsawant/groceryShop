import React from 'react'

export default function Tables(props) {
    return (
        <div className='table-responsive'>
            <table className="table table-hover">
                <thead>
                    <tr>
                        {props.checkbox &&
                            <th className="tableHeader">
                                <input 
                                    type='checkbox' 
                                    onChange={props.handleChange} 
                                    checked={props.checked}
                                />
                                <i class="fa fa-trash cursor deleteAllIcon" aria-hidden="true" onClick={()=>props.deleteAll()}></i>
                            </th>
                        }
                        {props.header.map((data,i)=>(
                            <th className="tableHeader" scop="col" key={i}>{data.headerName}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.children}
                </tbody>
            </table>
        </div>
    )
}
