import React, { useEffect, useState } from 'react'
import { BASEURL,DEPARTMENT } from '../../../api/APIEndpoints'
import APIServices from '../../../api/APIServices'
import AddButton from '../../../commonComponents/AddButton'
import BulkUploadButton from '../../../commonComponents/BulkUploadButton'
import Modal from '../../../commonComponents/Modal'
import Pagination from '../../../commonComponents/Pagination'
import SearchButton from '../../../commonComponents/SearchButton'
import Toaster from '../../../commonComponents/Toaster'
import AdminTopBar from '../../nav/AdminTopBar'
import DepartmentBulkUpload from './DepartmentBulkUpload'
import DepartmentForm from './DepartmentForm'
import DepartmentTable from './DepartmentTable'

export default function Department() {
    const [modal,setModal]=useState(false)
    const [data,setData]=useState([])
    const [updateState,setUpdateState]=useState()
    const [editDataState,setEditDataState]=useState({})
    const [editFlag,setEditFlag]=useState(false)
    const [page,setPage]=useState(0)
    const [limit,setLimit]=useState(10)
    const [totalCount,setTotalCount]=useState()
    const [currentCount,setCurrentCount]=useState()
    const [search,setSearch]=useState("")
    const [toasterMsg,setToasterMsg]=useState('')
    const [toaster,setToaster]=useState(false)
    const [toasterStatus,setToasterStatus]=useState('')
    const [deleteModal,setDeleteModal]=useState(false)
    const [deleteData,setDeleteData]=useState({})
    const [bulkModal,setBulkModal]=useState(false)

    const openModal=()=>{
        setModal(!modal)
    }
    const closeModal=()=>{
        setModal(false)
        setEditFlag(false)
    }

    const openBulkModal=()=>{
        setBulkModal(!bulkModal)
    }
    const bulkModalClose=()=>{
        setBulkModal(false)
    }

    const fetchData=async()=>{
        const url=BASEURL+DEPARTMENT+`?page=${page}&limit=${limit}&name=${search}`
        const res=await new APIServices().get(url)
        setData(res.results.department)
        setTotalCount(res.results.totalCount)
        setCurrentCount(res.results.currentCount)
    }

    const editClick=(editData)=>{
        setEditDataState(editData)
        setEditFlag(true)
        setModal(true)
    }

    useEffect(()=>{
        let searchTimer=setTimeout(()=>{
            fetchData()
        },1000)
        
        return ()=>clearTimeout(searchTimer);
    },[search,updateState,limit,page])

    const next=()=>{
        setPage(page + 1)
    }
    const prev=()=>{
        setPage(page - 1)
    }

    const handleChange=(e)=>{
        setLimit(e.target.value)
    }

    const searchHandle=(e)=>{
        setSearch(e.target.value)
    }

    const closeDeleteModal=()=>{
        setDeleteModal(false)
        setDeleteData({})
    }
    const deleteDepartment=(data)=>{
        setDeleteModal(true)
        setDeleteData(data)
    }
    const deleteCategorySuccess=async()=>{
        const url=BASEURL+DEPARTMENT+'/'+deleteData._id
        const req=await new APIServices().delete(url)
        if(req.error){
            setToaster(true)
            setToasterMsg(req.results.message)
            setToasterStatus("error")
            setTimeout(()=>{
                setToaster(false)
                setToasterMsg('')
                setToasterStatus('')
            },5000)
        }else{
            setToaster(true)
            setToasterMsg(`${deleteData.name} is deleted successfully`)
            setToasterStatus("success")
            setTimeout(()=>{
                setToaster(false)
                setToasterMsg('')
                setToasterStatus('')
            },5000)
            setUpdateState(data)
            setDeleteModal(false)
        }
    }

    return (
        <>
            {toaster && 
                <Toaster
                    status={toasterStatus && toasterStatus}
                    msg={toasterMsg && toasterMsg}
                />
            }
            <div className="dashboardMiddleContent">
                <AdminTopBar
                    pageName="Category"
                >
                    <div className="d-flex">
                        <SearchButton 
                            tooltip="Search"
                            placeholder="Search Category..."
                            onChange={searchHandle}
                            value={search}
                        />
                        <AddButton 
                            openModal={openModal}
                            tooltip="Add Category"
                        />
                        <BulkUploadButton 
                            openModal={openBulkModal}
                            tooltip="Bulk Upload Category"
                        />
                    </div>
                </AdminTopBar>
                <div className='dashboardPage'>
                    <DepartmentTable 
                        data={data}
                        editClick={(data)=>editClick(data)}
                        updateState={(data)=>setUpdateState(data)}
                        deleteDepartment={(data)=>deleteDepartment(data)}                  
                    />
                </div>
                <Pagination 
                    limit={limit}
                    handleChange={(e)=>handleChange(e)}
                    next={next}
                    prev={prev}
                    page={page}
                    count={totalCount}
                    currentCount={currentCount}
                />
            </div>
            {modal &&
                <Modal
                    outSideClick={closeModal}
                    closeModal={closeModal}
                    size="small"
                    name={editFlag ? "Edit Category":"Add Category"}
                >
                    <DepartmentForm
                        updateState={(data)=>setUpdateState(data)}
                        closeModal={closeModal}
                        editFlag={editFlag}
                        editData={editDataState}
                        setToaster={(data)=>setToaster(data)}
                        setToasterMsg={(data)=>setToasterMsg(data)}
                        setToasterStatus={(data)=>setToasterStatus(data)}
                    />
                </Modal>
            }
            {bulkModal &&
                <Modal
                    outSideClick={bulkModalClose}
                    closeModal={bulkModalClose}
                    size="small"
                    name="Bulk Upload Category"
                >
                    <DepartmentBulkUpload
                        updateState={(data)=>setUpdateState(data)}
                        closeModal={bulkModalClose}
                    />
                </Modal>
            }
            {deleteModal &&
                <Modal
                    outSideClick={closeDeleteModal}
                    closeModal={closeDeleteModal}
                    size="small"
                    name="Delete Category"
                >
                    <p>Are you sure you want to delete <b>{deleteData.name}</b> category?</p>
                    <p>If you delete this category, their product and sub-category will also be deleted.</p>
                    <button
                        className="primaryDeleteButton modalButton"
                        onClick={deleteCategorySuccess}
                    >
                        Delete
                    </button>
                    <button
                        className="secondaryDeleteButton modalButton"
                        onClick={closeDeleteModal}
                    >
                        Cancel
                    </button>
                </Modal>
            }
        </>
    )
}