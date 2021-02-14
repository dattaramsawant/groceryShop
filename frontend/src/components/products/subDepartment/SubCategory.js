import React, { useEffect, useState } from 'react'
import { BASEURL,DEPARTMENT,SUBDEPARTMENT } from '../../../api/APIEndpoints'
import APIServices from '../../../api/APIServices'
import AddButton from '../../../commonComponents/AddButton'
import Modal from '../../../commonComponents/Modal'
import Pagination from '../../../commonComponents/Pagination'
import SearchButton from '../../../commonComponents/SearchButton'
import AdminTopBar from '../../nav/AdminTopBar'
import SubCategoryForm from './SubCategoryForm'
import SubCategoryTable from './SubCategoryTable'

export default function SubCategory() {
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
    const [category,setCategory]=useState([])
    const [toasterMsg,setToasterMsg]=useState('')
    const [toaster,setToaster]=useState(false)
    const [toasterStatus,setToasterStatus]=useState('')
    const [deleteModal,setDeleteModal]=useState(false)
    const [deleteData,setDeleteData]=useState({})

    const openModal=()=>{
        setModal(!modal)
    }
    const closeModal=()=>{
        console.log('object')
        setModal(false)
        setEditFlag(false)
    }

    const fetchData=async()=>{
        const url=BASEURL+SUBDEPARTMENT+`?page=${page}&limit=${limit}&name=${search}`
        const res=await new APIServices().get(url)
        console.log(res)
        setData(res.results.subDepartment)
        setTotalCount(res.results.totalCount)
        setCurrentCount(res.results.currentCount)
    }
    const fetchCategory=async()=>{
        const url=BASEURL+DEPARTMENT
        const res=await new APIServices().get(url)
        setCategory(res.results.department)
    }

    const editClick=(editData)=>{
        setEditDataState(editData)
        setEditFlag(true)
        setModal(true)
    }

    useEffect(()=>{
        fetchData()
    },[updateState,page,limit])

    useEffect(()=>{
        fetchCategory()
    },[])

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

    useEffect(()=>{
        let searchTimer=setTimeout(async()=>{
            if(search){
                const url=BASEURL+SUBDEPARTMENT+`?name=${search}&page=${page}&limit=${limit}`
                const res=await new APIServices().get(url)
                console.log(res)
                setData(res.results.subDepartment)
                setTotalCount(res.results.totalCount)
                setCurrentCount(res.results.currentCount)
            }else{
                fetchData()
            }
        },1000)
        return ()=>clearTimeout(searchTimer);
    },[search])

    const closeDeleteModal=()=>{
        setDeleteModal(false)
        setDeleteData({})
    }
    const deleteSubDepartment=(data)=>{
        setDeleteModal(true)
        setDeleteData(data)
    }
    const deleteSubCategorySuccess=async()=>{
        const url=BASEURL+SUBDEPARTMENT+'/'+deleteData._id
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
            setUpdateState(deleteData)
            setDeleteModal(false)
        }
    }
    return (
        <>
            <div className="dashboardMiddleContent">
                <AdminTopBar
                    pageName="Sub-Category"
                >
                    <div className="d-flex">
                        <SearchButton 
                            tooltip="Search"
                            placeholder="Search SubCategory..."
                            onChange={searchHandle}
                            value={search}
                        />
                        <AddButton 
                            openModal={openModal}
                            tooltip="Add SubDepartment"
                        />
                    </div>
                </AdminTopBar>
                <div className='dashboardPage'>
                    <SubCategoryTable 
                        data={data}
                        editClick={(data)=>editClick(data)}
                        updateState={(data)=>setUpdateState(data)}
                        deleteSubDepartment={(data)=>deleteSubDepartment(data)}
                        
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
                    name={editFlag ? "Edit Sub-Category":"Add Sub-Category"}
                    toaster={toaster}
                    toasterMsg={toasterMsg}
                    toasterStatus={toasterStatus}
                >
                    <SubCategoryForm
                        updateState={(data)=>setUpdateState(data)}
                        closeModal={closeModal}
                        editFlag={editFlag}
                        editData={editDataState}
                        category={category}
                        setToaster={(data)=>setToaster(data)}
                        setToasterMsg={(data)=>setToasterMsg(data)}
                        setToasterStatus={(data)=>setToasterStatus(data)}
                    />
                </Modal>
            }
            {deleteModal &&
                <Modal
                    outSideClick={closeDeleteModal}
                    closeModal={closeDeleteModal}
                    size="small"
                    name="Delete Sub-Category"
                >
                    <p>Are you sure you want to delete <b>{deleteData.name}</b> sub-category?</p>
                    <p>If you delete this sub-category, their product will also be deleted.</p>
                    <button
                        className="primaryDeleteButton modalButton"
                        onClick={deleteSubCategorySuccess}
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
