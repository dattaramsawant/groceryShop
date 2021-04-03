import React, { useEffect, useState } from 'react'
import { BASEURL,DEPARTMENT,SUBDEPARTMENT,TYPE } from '../../../api/APIEndpoints'
import APIServices from '../../../api/APIServices'
import AddButton from '../../../commonComponents/AddButton'
import Modal from '../../../commonComponents/Modal'
import Pagination from '../../../commonComponents/Pagination'
import SearchButton from '../../../commonComponents/SearchButton'
import AdminTopBar from '../../nav/AdminTopBar'
import TypeForm from './TypeForm'
import TypeTable from './TypeTable'

export default function Type() {
    const [modal,setModal]=useState(false)
    const [search,setSearch]=useState("")
    const [page,setPage]=useState(0)
    const [limit,setLimit]=useState(10)
    const [totalCount,setTotalCount]=useState()
    const [currentCount,setCurrentCount]=useState()
    const [editDataState,setEditDataState]=useState({})
    const [editFlag,setEditFlag]=useState(false)
    const [toasterMsg,setToasterMsg]=useState('')
    const [toaster,setToaster]=useState(false)
    const [toasterStatus,setToasterStatus]=useState('')
    const [data,setData]=useState([])
    const [deleteModal,setDeleteModal]=useState(false)
    const [deleteData,setDeleteData]=useState({})
    const [updateState,setUpdateState]=useState()
    const [category,setCategory]=useState([])
    const [subCategory,setSubCategory]=useState([])

    const searchHandle=(e)=>{
        setSearch(e.target.value)
    }
    const openModal=()=>{
        setModal(!modal)
    }
    const closeModal=()=>{
        setModal(false)
        setEditFlag(false)
    }
    const closeDeleteModal=()=>{
        setDeleteModal(false)
        setDeleteData({})
    }
    const handleChange=(e)=>{
        setLimit(e.target.value)
    }
    const next=()=>{
        setPage(page + 1)
    }
    const prev=()=>{
        setPage(page - 1)
    }

    const deleteType=(data)=>{
        setDeleteModal(true)
        setDeleteData(data)
    }
    const editClick=(editData)=>{
        setEditDataState(editData)
        setEditFlag(true)
        setModal(true)
    }
    const deleteTypeSuccess=async()=>{
        const url = BASEURL+TYPE+'/'+deleteData._id
        const req = await new APIServices().delete(url)
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

    const fetchData=async()=>{
        const url = BASEURL+TYPE+`?name=${search}&page=${page}&limit=${limit}`
        const res = await new APIServices().get(url)
        if(res.error){

        }else{
            setData(res.results.type)
            setTotalCount(res.results.totalCount)
            setCurrentCount(res.results.currentCount)
        }
    }
    const fetchCategory=async()=>{
        const url=BASEURL+DEPARTMENT
        const res=await new APIServices().get(url)
        if(!res.error){
            setCategory(res.results.department)
        }
    }
    const fetchSubCategory=async()=>{
        const url=BASEURL+SUBDEPARTMENT
        const res=await new APIServices().get(url)
        if(!res.error){
            setSubCategory(res.results.subDepartment)
        }
    }

    useEffect(()=>{
        fetchCategory()
        fetchSubCategory()
    },[])
    useEffect(()=>{
        let searchTimer=setTimeout(()=>{
            fetchData()
        },1000)
        
        return ()=>clearTimeout(searchTimer);
    },[search,updateState,limit,page])
    console.log(editDataState)
    return (
        <>
            <div className="dashboardMiddleContent">
                <AdminTopBar
                    pageName="Type"
                >
                    <div className="d-flex">
                        <SearchButton
                            tooltip="Search"
                            placeholder="Search Type..."
                            onChange={searchHandle}
                            value={search}
                        />
                        <AddButton
                            openModal={openModal}
                            tooltip="Add Type"
                        />
                    </div>
                </AdminTopBar>
                <div className='dashboardPage'>
                    <TypeTable 
                        data={data}
                        editClick={(data)=>editClick(data)}
                        deleteType={(data)=>deleteType(data)}
                        
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
                    name={editFlag ? "Edit Type":"Add Type"}
                    toaster={toaster}
                    toasterMsg={toasterMsg}
                    toasterStatus={toasterStatus}
                >
                    <TypeForm
                        updateState={(data)=>setUpdateState(data)}
                        closeModal={closeModal}
                        editFlag={editFlag}
                        editData={editDataState}
                        category={category}
                        subCategory={subCategory}
                        // brandCategory={brandCategory}
                        // brandSubCategory={brandSubCategory}
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
                    name="Delete Type"
                    toaster={toaster}
                    toasterMsg={toasterMsg}
                    toasterStatus={toasterStatus}
                >
                    <p>Are you sure you want to delete <b>{deleteData.name}</b> type?</p>
                    <button
                        className="primaryDeleteButton modalButton"
                        onClick={deleteTypeSuccess}
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
