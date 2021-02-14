import React, { useEffect, useState } from 'react'
import UserTable from './UserTable'
import { BASEURL, USERS } from '../../api/APIEndpoints'
import APIServices from '../../api/APIServices'
import AdminTopBar from '../nav/AdminTopBar'
import Modal from '../../commonComponents/Modal'
import UserForm from './UserForm'
import Pagination from '../../commonComponents/Pagination'
import SearchButton from '../../commonComponents/SearchButton'
import AddButton from '../../commonComponents/AddButton'

export default function User() {
    const [data,setData]=useState([])
    const [updateState,setUpdateState]=useState(0)
    const [modal,setModal]=useState(false)
    const [search,setSearch]=useState("")
    const [totalCount,setTotalCount]=useState()
    const [currentCount,setCurrentCount]=useState()
    const [page,setPage]=useState(0)
    const [limit,setLimit]=useState(10)

    const fetchUser=async()=>{
        const url=BASEURL+USERS+`?page=${page}&limit=${limit}&name=${search}`
        const res=await new APIServices().get(url)
        if(!res.error){
            setData(res.results.user)
            setTotalCount(res.results.totalCount)
            setCurrentCount(res.results.currentCount)
        }
    }

    useEffect(()=>{
        fetchUser()
    },[updateState,page,limit])

    const openModal=()=>{
        setModal(!modal)
    }
    const closeModal=()=>{
        setModal(false)
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

    const searchHandle=(e)=>{
        setSearch(e.target.value)
    }
    useEffect(()=>{
        let searchTimer=setTimeout(async()=>{
            if(search){
                const url=BASEURL+USERS+`?name=${search}&page=${page}&limit=${limit}`
                const res=await new APIServices().get(url)
                setData(res.results.user)
                setTotalCount(res.results.totalCount)
                setCurrentCount(res.results.currentCount)
            }else{
                fetchUser()
            }
        },1000)
        return ()=>clearTimeout(searchTimer);
    },[search])
    console.log(updateState)
    const updateStateClick=(data)=>{
        setUpdateState(updateState+1)
    }
    return (
        <>
            <div className='dashboardMiddleContent'>
                <AdminTopBar
                    pageName="User Management"
                >
                    <div className="d-flex">
                        <SearchButton
                            tooltip="Search"
                            placeholder="Search Users..."
                            onChange={searchHandle}
                            value={search}
                        />
                        <AddButton
                            openModal={openModal}
                            tooltip="Add User"
                        />
                    </div>
                </AdminTopBar>
                <div className='dashboardPage'>
                    <UserTable 
                        user={data}
                        // updateState={(data)=>setUpdateState(data)}
                        updateState={(data)=>updateStateClick(data)}
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
                    name="Add User"
                >
                    <UserForm
                        closeModal={()=>setModal(false)}
                        updateData={(data)=>setUpdateState(data)}
                    />
                </Modal>
            }
        </>
    )
}
