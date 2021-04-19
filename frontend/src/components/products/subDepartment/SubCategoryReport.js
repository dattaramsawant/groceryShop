import React, { useEffect } from 'react'
import { useState } from 'react'
import { BASEURL, SUBDEPARTMENTREPORT,  } from '../../../api/APIEndpoints'
import APIServices from '../../../api/APIServices'
import Pagination from '../../../commonComponents/Pagination'
import SearchButton from '../../../commonComponents/SearchButton'
import Toaster from '../../../commonComponents/Toaster'
import AdminTopBar from '../../nav/AdminTopBar'
import SubCategoryReportTable from './SubCategoryReportTable'

export default function SubCategoryReport() {
    const [data,setData]=useState([])
    const [search,setSearch]=useState("")
    const [toasterMsg,setToasterMsg]=useState('')
    const [toaster,setToaster]=useState(false)
    const [toasterStatus,setToasterStatus]=useState('')
    const [page,setPage]=useState(0)
    const [limit,setLimit]=useState(10)
    const [totalCount,setTotalCount]=useState()
    const [currentCount,setCurrentCount]=useState()
    const [updateState,setUpdateState]=useState()

    const searchHandle=(e)=>{
        setSearch(e.target.value)
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
    
    const fetchData=async()=>{
        const url=BASEURL+SUBDEPARTMENTREPORT+`?page=${page}&limit=${limit}&name=${search}`
        const res=await new APIServices().get(url)
        if(!res.error){
            setTotalCount(res.results.totalCount)
            setCurrentCount(res.results.currentCount)
            setData(res.results.subDepartmentReport)
        }
    }

    useEffect(()=>{
        let searchTimer=setTimeout(()=>{
            fetchData()
        },1000)
        
        return ()=>clearTimeout(searchTimer);
    },[search,updateState,page,limit])

    const deleteReport=async(data)=>{
        const url=BASEURL+SUBDEPARTMENTREPORT+`/${data._id}`
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
            setToasterMsg(`${data.fileName} is deleted successfully`)
            setToasterStatus("success")
            setTimeout(()=>{
                setToaster(false)
                setToasterMsg('')
                setToasterStatus('')
            },5000)
            setUpdateState(data)
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
                    pageName="Sub-Category Report"
                >
                    <div className="d-flex">
                        <SearchButton
                            tooltip="Search"
                            placeholder="Search Category Report..."
                            onChange={searchHandle}
                            value={search}
                        />
                    </div>
                </AdminTopBar>
                <div className='dashboardPage'>
                    <SubCategoryReportTable
                        data={data}
                        deleteReport={(data)=>deleteReport(data)}
                        updateState={(data)=>setUpdateState(data)}
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
        </>
    )
}
