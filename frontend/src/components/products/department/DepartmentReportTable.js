import React, { useState } from 'react'
import { BASEURL, DEPARTMENTREPORT,DELETEBULK } from '../../../api/APIEndpoints'
import APIServices from '../../../api/APIServices'
import Modal from '../../../commonComponents/Modal'
import Tables from '../../../commonComponents/Tables'

export default function DepartmentReportTable(props) {
    const [header]=useState([
        {headerName:"File Name"},
        {headerName:"Created At"},
        {headerName:"Action"},
    ])
    const [check,setCheck]=useState({})
    const [allChecked,setAllChecked]=useState(false)
    const [deleteModal,setDeleteModal]=useState(false)
    const [viewModal,setViewModal]=useState(false)
    const [viewReportData,setViewReportData]=useState({})
    const [headerCSV,setHeaderCSV]=useState([])
    const [reportData,setReportData]=useState([])

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
    const deleteCategoryReportSuccess=async()=>{
        let arr=[]
        const obj=Object.keys(check).map(key=>key)
        if(obj.length>0){
            obj.map(data=>{
                if(data){
                    arr.push(data)
                }
            })
            const url=BASEURL+DEPARTMENTREPORT+DELETEBULK
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

    const viewDocument=async(data)=>{
        setViewModal(true)
        setViewReportData(data)

        const req=await new APIServices().getReport(data.file);
        if(!req.error){
            setHeaderCSV(req.results.headers)
            setReportData(req.results.results)
        }
    }
    const closeViewModal=()=>{
        setViewModal(false)
        setViewReportData({})
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
                {props.data.map(data=>{
                    const dateTime=new Date(data.createdAt)
                    const date=('0' + dateTime.getDate()).slice(-2)
                    const month=dateTime.getMonth()
                    const year=dateTime.getFullYear()
                    let hour=dateTime.getHours()
                    const min=('0' + dateTime.getMinutes()).slice(-2)
                    const monthArr=['January','February','March','April','May','June','July','August','September','October','November','December']
                    const ampm=hour>=12?'pm':'am'
                    hour=(hour%12) || 12
                    hour=('0' + hour).slice(-2)
                    const fullDate=date+'-'+monthArr[month]+'-'+year+' '+hour+':'+min+ampm

                    return (
                        <tr key={data._id} className="dataRow">
                            <td>
                                <input type="checkbox" checked={check[data._id]} onChange={(e)=>handleCheck(e,data)} />
                            </td>
                            <td>{data.fileName}</td>
                            <td>{fullDate}</td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <i className="fa fa-eye cursor" onClick={()=>viewDocument(data)}></i>
                                    <a href={data.file} download>
                                        <i className="fa fa-download cursor"></i>
                                    </a>
                                    <img src='/icons/delete.svg'className="deleteIcon cursor" onClick={()=>props.deleteReport(data)} />
                                </div>
                            </td>
                        </tr>
                    )
                })}
            </Tables>
            {deleteModal &&
                <Modal
                    outSideClick={deleteModalClose}
                    closeModal={deleteModalClose}
                    size="small"
                    name="Bulk Delete Category Report"
                >
                    <p>Are you sure you want to delete all selected category report?</p>
                    <button
                        className="primaryDeleteButton modalButton"
                        onClick={deleteCategoryReportSuccess}
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

            {viewModal &&
                <Modal
                    outSideClick={closeViewModal}
                    closeModal={closeViewModal}
                    size="large"
                    name={`Report ${viewReportData.fileName}`}
                >
                    <Tables
                        header={headerCSV}
                    >
                        {reportData &&
                            reportData.map((data,i)=>(
                                <tr key={i} className="dataRow">
                                    <td>{data.name}</td>
                                    <td>{data.description}</td>
                                    <td>{data.status}</td>
                                    <td>{data.message}</td>
                                </tr>
                            ))
                        }
                    </Tables>
                </Modal>
            }
        </>
    )
}
