import React, { useEffect, useState } from 'react'
import AdminTopBar from '../nav/AdminTopBar'
import ProductForm from './ProductForm'
import { BASEURL,BRAND,DEPARTMENT, PRODUCT, SUBDEPARTMENT } from '../../api/APIEndpoints'
import APIServices from '../../api/APIServices'
import Modal from '../../commonComponents/Modal'
import ProductTable from './ProductTable'
import Pagination from '../../commonComponents/Pagination'
import SearchButton from '../../commonComponents/SearchButton'
import AddButton from '../../commonComponents/AddButton'
import Carousel from '../../commonComponents/Carousel'
import ProductCarouselCard from '../../commonComponents/ProductCarouselCard'

export default function Products() {
    const [keys,setKeys]=useState([])
    const [modal,setModal]=useState(false)
    const [category,setCategory]=useState([])
    const [subCategory,setSubCategory]=useState([])
    // const [selectedCategory,setSelectedCategory]=useState()
    const [data,setData]=useState([])
    const [updateState,setUpdateState]=useState()
    const [editDataState,setEditDataState]=useState({})
    const [editFlag,setEditFlag]=useState(false)
    const [page,setPage]=useState(0)
    const [limit,setLimit]=useState(10)
    const [totalCount,setTotalCount]=useState()
    const [currentCount,setCurrentCount]=useState()
    const [search,setSearch]=useState("")
    const [productImg,setProductImg]=useState([])
    const [productImgName,setProductImgName]=useState()
    const [productImgModal,setProductImgModal]=useState(false)
    const [brand,setBrand]=useState([])
    const [deleteModal,setDeleteModal]=useState(false)
    const [deleteData,setDeleteData]=useState({})
    const [toasterMsg,setToasterMsg]=useState('')
    const [toaster,setToaster]=useState(false)
    const [toasterStatus,setToasterStatus]=useState('')
    
    // console.log(data)
    const openModal=()=>{
        setModal(true)
    }
    const closeModal=()=>{
        setModal(false)
        setEditFlag(false)
    }

    const fetchBrand=async()=>{
        const url=BASEURL+BRAND
        const res=await new APIServices().get(url)
        setBrand(res.results.brand)
    }

    const fetchCategory=async()=>{
        const url=BASEURL+DEPARTMENT
        const res=await new APIServices().get(url)
        setCategory(res.results.department)
    }

    const fetchSubCategory=async()=>{
        const url=BASEURL+SUBDEPARTMENT
        const res=await new APIServices().get(url)
        setSubCategory(res.results.subDepartment)
    }

    const fetchData=async()=>{
        const url=BASEURL+PRODUCT+`?name=${search}&page=${page}&limit=${limit}`
        const res=await new APIServices().get(url)
        setData(res.results.product)
        setTotalCount(res.results.totalCount)
        setCurrentCount(res.results.currentCount)
    }

    useEffect(()=>{
        fetchBrand()
        fetchCategory()
        fetchSubCategory()
    },[])
    useEffect(()=>{
        fetchData()
    },[updateState,page,limit])

    const editClick=(editData)=>{
        setEditDataState(editData)
        setEditFlag(true)
        setModal(true)
    }

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
                const url=BASEURL+PRODUCT+`?name=${search}&page=${page}&limit=${limit}`
                const res=await new APIServices().get(url)
                setData(res.results.product)
                setTotalCount(res.results.totalCount)
                setCurrentCount(res.results.currentCount)
            }else{
                fetchData()
            }
        },1000)
        return ()=>clearTimeout(searchTimer);
    },[search])

    const productImgClick=(data)=>{
        setProductImgModal(true)
        setProductImg(data.productImg)
        setProductImgName(data.name)
    }
    const productImgCloseModal=()=>{
        setProductImgModal(false)
        setProductImg([])
        setProductImgName()
    }

    const deleteProduct=(data)=>{
        setDeleteModal(true)
        setDeleteData(data)
    }

    const closeDeleteModal=()=>{
        setDeleteModal(false)
        setDeleteData({})
    }

    const deleteProductSuccess=async()=>{
        const url=BASEURL+PRODUCT+'/'+deleteData._id
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
        if(req.error){
            console.log(req)
        }else{
            setUpdateState(req)
        }
    }
    return (
        <>
            <div className='dashboardMiddleContent'>
                <AdminTopBar
                    pageName="Products"
                >
                    <div className="d-flex">
                        <SearchButton
                            tooltip="Search"
                            placeholder="Search Products..."
                            onChange={searchHandle}
                            value={search}
                        />
                        <AddButton
                            openModal={openModal}
                            tooltip="Add Product"
                        />
                    </div>
                </AdminTopBar>
                
                <div className="dashboardPage">
                    <ProductTable
                        data={data}
                        updateState={(data)=>setUpdateState(data)}
                        editClick={(data)=>editClick(data)}
                        productImgClick={(data)=>productImgClick(data)}
                        deleteProduct={(data)=>deleteProduct(data)}
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
                    name={editFlag ? "Update Product" : "Add Product"}
                >
                    <ProductForm
                        // updateState={(data)=>setUpdateState(data)}
                        closeModal={closeModal}
                        category={category}
                        subCategory={subCategory}
                        openModal={openModal}
                        updateData={(data)=>setUpdateState(data)}
                        editFlag={editFlag}
                        editData={editDataState}
                        brand={brand}
                    />
                </Modal>
            }
            {productImgModal &&
                <Modal
                    outSideClick={productImgCloseModal}
                    closeModal={productImgCloseModal}
                    size="small"
                    name={`${productImgName} images`}
                >
                    <Carousel
                        keys={keys}
                        setKeys={(data)=>setKeys(data)}
                        length={productImg && productImg.length}
                        noOfSlidePerScreen={1}
                    >
                        <ProductCarouselCard 
                            items={productImg}
                            noOfSlidePerScreen={1}
                            keys={keys}
                        /> 
                    </Carousel>
                </Modal>
            }

            {deleteModal &&
                <Modal
                    outSideClick={closeDeleteModal}
                    closeModal={closeDeleteModal}
                    size="small"
                    name="Delete Product"
                >
                    <p>Are you sure you want to delete <b>{deleteData.name}</b> Product?</p>
                    <button
                        className="primaryDeleteButton modalButton"
                        onClick={deleteProductSuccess}
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
