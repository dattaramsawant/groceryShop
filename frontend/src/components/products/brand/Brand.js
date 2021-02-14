import React, { useEffect, useState } from 'react'
import { BASEURL,BRAND, DEPARTMENT, SUBDEPARTMENT } from '../../../api/APIEndpoints'
import APIServices from '../../../api/APIServices'
import AddButton from '../../../commonComponents/AddButton'
import Modal from '../../../commonComponents/Modal'
import Pagination from '../../../commonComponents/Pagination'
import SearchButton from '../../../commonComponents/SearchButton'
import AdminTopBar from '../../nav/AdminTopBar'
import BrandForm from './BrandForm'
import BrandTable from './BrandTable'

export default function Brand() {
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
    const [brandCategory,setBrandCategory]=useState([])
    const [brandSubCategory,setBrandSubCategory]=useState([])
    const [toasterMsg,setToasterMsg]=useState('')
    const [toaster,setToaster]=useState(false)
    const [toasterStatus,setToasterStatus]=useState('')
    const [deleteModal,setDeleteModal]=useState(false)
    const [deleteData,setDeleteData]=useState({})

    const openModal=()=>{
        setModal(!modal)
    }
    const closeModal=()=>{
        setModal(false)
        setEditFlag(false)
    }

    const fetchCategoryData=async()=>{
        const url=BASEURL+DEPARTMENT+`?page=${page}&limit=${limit}&name=${search}`
        const res=await new APIServices().get(url)
        setBrandCategory(res.results.department)
    }
    const fetchSubCategoryData=async()=>{
        const url=BASEURL+SUBDEPARTMENT+`?page=${page}&limit=${limit}&name=${search}`
        const res=await new APIServices().get(url)
        setBrandSubCategory(res.results.subDepartment)
    }

    const fetchData=async()=>{
        const url=BASEURL+BRAND+`?page=${page}&limit=${limit}&name=${search}`
        const res=await new APIServices().get(url)
        setData(res.results.brand)
        setTotalCount(res.results.totalCount)
        setCurrentCount(res.results.currentCount)
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
        fetchCategoryData()
        fetchSubCategoryData()
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
                const url=BASEURL+BRAND+`?name=${search}&page=${page}&limit=${limit}`
                const res=await new APIServices().get(url)
                setData(res.results.brand)
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
    const deleteBrand=(data)=>{
        setDeleteModal(true)
        setDeleteData(data)
    }
    const deleteBrandSuccess=async()=>{
        const url=BASEURL+BRAND+'/'+deleteData._id
        const req=await new APIServices().delete(url)
        console.log(req)
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
            setToasterMsg(`${deleteData.brandName} is deleted successfully`)
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
            <div className="dashboardMiddleContent">
                <AdminTopBar
                    pageName="Brand"
                >
                    <div className="d-flex">
                        <SearchButton 
                            tooltip="Search"
                            placeholder="Search Brand..."
                            onChange={searchHandle}
                            value={search}
                        />
                        <AddButton 
                            openModal={openModal}
                            tooltip="Add Brand"
                        />
                    </div>
                </AdminTopBar>
                <div className='dashboardPage'>
                    <BrandTable 
                        data={data}
                        editClick={(data)=>editClick(data)}
                        updateState={(data)=>setUpdateState(data)}
                        deleteBrand={(data)=>deleteBrand(data)}
                        
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
                    name={editFlag ? "Edit Brand":"Add Brand"}
                    toaster={toaster}
                    toasterMsg={toasterMsg}
                    toasterStatus={toasterStatus}
                >
                    <BrandForm
                        updateState={(data)=>setUpdateState(data)}
                        closeModal={closeModal}
                        editFlag={editFlag}
                        editData={editDataState}
                        brandCategory={brandCategory}
                        brandSubCategory={brandSubCategory}
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
                    name="Delete Brand"
                    toaster={toaster}
                    toasterMsg={toasterMsg}
                    toasterStatus={toasterStatus}
                >
                    <p>Are you sure you want to delete <b>{deleteData.brandName}</b> brand?</p>
                    <p>If you delete this brand, their product will also be deleted.</p>
                    <button
                        className="primaryDeleteButton modalButton"
                        onClick={deleteBrandSuccess}
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
