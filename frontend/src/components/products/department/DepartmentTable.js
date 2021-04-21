import React, { useState } from 'react'
import { BASEURL, DELETEBULK, DEPARTMENT } from '../../../api/APIEndpoints'
import APIServices from '../../../api/APIServices'
import Modal from '../../../commonComponents/Modal'
import Tables from '../../../commonComponents/Tables'

export default function DepartmentTable(props) {
    const [header]=useState([
        {headerName:"Name"},
        {headerName:"Description"},
        {headerName:"Action"},
    ])
    const [check,setCheck]=useState({})
    const [allChecked,setAllChecked]=useState(false)
    const [deleteModal,setDeleteModal]=useState(false)

    const handleCheck=(e,data)=>{
        if(allChecked){
            setCheck({...check,[data._id]:!check[data._id]})
            setAllChecked(!allChecked)
        }else{
            setCheck({...check,[data._id]:!check[data._id]})
        }
    }
    const checkAll=()=>{
        const arr=props.data.map(data=>(
            {[data._id]:!allChecked}
        ))
        const obj=Object.assign({},...arr)
        setCheck({...check,...obj})
        setAllChecked(!allChecked)
    }
    const deleteAll=()=>{
        setDeleteModal(Object.keys(check).length>0 ? true : false)
    }
    const deleteCategorySuccess=async()=>{
        let arr=[]
        const obj=Object.keys(check).map(key=>key)
        if(obj.length>0){
            obj.map(data=>{
                if(check[data]){
                    arr.push(data)
                }
            })
            const url=BASEURL+DEPARTMENT+DELETEBULK
            const data={
                deleteData:arr
            }
            const req=await new APIServices().post(url,data)
            if(!req.error){
                props.updateState(req.results)
                setAllChecked(false)
                setCheck({})
                setDeleteModal(false)
            }
        }
    }
    const deleteModalClose=()=>{
        setDeleteModal(false)
    }
    return (
        <>
            <Tables 
                header={header}
                checkbox={true}
                handleChange={checkAll}
                checked={allChecked}
                deleteAll={deleteAll}
            >
                {props.data.map(data=>(
                    <tr key={data._id} className="dataRow">
                        <td>
                            <input type="checkbox" checked={check[data._id]} onChange={(e)=>handleCheck(e,data)} />
                        </td>
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
            {deleteModal &&
                <Modal
                    outSideClick={deleteModalClose}
                    closeModal={deleteModalClose}
                    size="small"
                    name="Bulk Delete Category"
                >
                    <p>Are you sure you want to delete all selected category?</p>
                    <button
                        className="primaryDeleteButton modalButton"
                        onClick={deleteCategorySuccess}
                    >
                        Delete
                    </button>
                    <button
                        className="secondaryDeleteButton modalButton"
                        onClick={deleteModalClose}
                    >
                        Cancel
                    </button>
                </Modal>
            }
        </>
    )
}
