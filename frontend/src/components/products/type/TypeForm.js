import React, { useEffect, useRef, useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../../../commonComponents/FormInput'
import useClickOutSide from '../../../customHook/useClickOutsSde'
import FormDropdown from '../../../commonComponents/FormDropdown'
import Tables from '../../../commonComponents/Tables'
import { BASEURL, TYPE } from '../../../api/APIEndpoints'
import APIServices from '../../../api/APIServices'

export default function TypeForm(props) {
    const [dropdown,setDropdown]=useState(false)
    const [typeDetails,setTypeDetails]=useState({
        category:null,
        subCategory:[]
    })
    const [typeDetailsData,setTypeDetailsData]=useState({
        category:{name:null,id:null},
        subCategory:[]
    })
    const [editFlag,setEditFlag]=useState(false)
    const [finalTypeDetails,setFinalTypeDetails]=useState([])
    const [finalTypeDetailsData,setFinalTypeDetailsData]=useState([])
    const [subCategory,setSubCategory]=useState([])
    const [currentSubCategory,setCurrentSubCategory]=useState([])
    const [header]=useState([
        {headerName:"Category"},
        {headerName:"Sub-Category"},
        {headerName:"Action"},
    ])

    const ref=useRef()

    useClickOutSide(ref,()=>{
        setDropdown(false)
    });
    const subCategoryDropdown=()=>{
        setDropdown(!dropdown)
    }

    const changeCategory=(e,value)=>{
        setTypeDetails({category:e.target.value,subCategory:[]})
        const subCat=[]
        let category=''
        let categoryId=''
        props.subCategory.map(data=>{
            if(data.category._id === e.target.value){
                category=data.category.name
                categoryId=data.category._id
                subCat.push(data)
            }
        })
        setSubCategory([])
        setCurrentSubCategory(subCat)
        setTypeDetailsData({category:{name:category,id:categoryId},subCategory:[]})
        value.category=e.target.value
    }

    const subCategoryChange=(value,data)=>{
        if(typeDetails.subCategory.includes(data._id)){
            const subCat=typeDetails.subCategory
            const newSubCat=[]
            const newSubCat2=[]
            subCat.filter(subCatFilter=>{
                if(subCatFilter !== data._id){
                    newSubCat.push(subCatFilter)
                }
            })
            subCategory.filter(subCatFilter=>{
                if(subCatFilter._id !== data._id){
                    newSubCat2.push(subCatFilter)
                }
            })
            setSubCategory(newSubCat2)
            setTypeDetails({...typeDetails,subCategory:newSubCat})
            setTypeDetailsData({...typeDetailsData,subCategory:newSubCat2})
        }else{
            const subCat=typeDetails.subCategory
            const subCat2=typeDetailsData.subCategory
            setTypeDetails({...typeDetails,subCategory:[...subCat,data._id]})
            setTypeDetailsData({...typeDetailsData,subCategory:[...subCat2,data]})
            setSubCategory([...subCategory,data])
        }
    }

    const addOtherDetails=()=>{
        if(editFlag){
            const newFinalType=[]
            const newFinalTypeData=[]

            finalTypeDetails.filter(data=>{
                if(data.category === typeDetails.category){
                    newFinalType.push(typeDetails)
                }else{
                    newFinalType.push(data)
                }
            })
            finalTypeDetailsData.filter(data=>{
                if(data.category.id === typeDetailsData.category.id){
                    newFinalTypeData.push(typeDetailsData)
                }else{
                    newFinalTypeData.push(data)
                }
            })
            setFinalTypeDetails(newFinalType)
            setFinalTypeDetailsData(newFinalTypeData)
            setTypeDetails({
                category:null,
                subCategory:[]
            })
            setTypeDetailsData({
                category:{name:null,id:null},
                subCategory:[]
            })
            setSubCategory([])
            setCurrentSubCategory([])
            setDropdown(false)
            setEditFlag(false)
        }else{
            setFinalTypeDetails([...finalTypeDetails,typeDetails])
            setFinalTypeDetailsData([...finalTypeDetailsData,typeDetailsData])
            setTypeDetails({
                category:null,
                subCategory:[]
            })
            setTypeDetailsData({
                category:{name:null,id:null},
                subCategory:[]
            })
            setSubCategory([])
            setCurrentSubCategory([])
            setDropdown(false)
            setEditFlag(false)
        }
    }

    const deleteTypeDetail=(data,i)=>{
        const newFinalTypeDetails=[]
        const newFinalTypeDetailsData=[]
        
        finalTypeDetails.map((a,index)=>{
            if(index !== i){
                newFinalTypeDetails.push(a)
            }
        })
        finalTypeDetailsData.map((a,index)=>{
            if(index !== i){
                newFinalTypeDetailsData.push(a)
            }
        })
        setFinalTypeDetails(newFinalTypeDetails)
        setFinalTypeDetailsData(newFinalTypeDetailsData)
        setSubCategory([])
        setCurrentSubCategory([])
        setDropdown(false)
        setEditFlag(false)
        setTypeDetails({
            category:null,
            subCategory:[]
        })
        setTypeDetailsData({
            category:{name:null,id:null},
            subCategory:[]
        })
    }
    const editClick=(data,i)=>{
        const subCat=[]
        const subCatData=[]
        data.subCategory.map(a=>{
            subCat.push(a._id)
        })
        console.log(data)
        props.subCategory.map(a=>{
            if(a.category._id === data.category.id){
                subCatData.push(a)
            }
        })
        setEditFlag(true)
        setCurrentSubCategory(subCatData)
        setSubCategory(data.subCategory)
        setTypeDetails({
            category:data.category.id,
            subCategory:subCat
        })
        setTypeDetailsData(data)
    }

    useEffect(()=>{
        if(props.editFlag){
            const newFinalTypeDetailsData=[]
            const newFinalTypeDetails=[]

            props.editData.typeDetails.map(data=>{
                const subCatData=[]
                data.subCategory.map(subCat=>{
                    subCatData.push(subCat._id)
                })
                const a={
                    category:{
                        name:data.category.name,
                        id:data.category._id
                    },
                    subCategory:data.subCategory
                }
                const b={
                    category:data.category._id,
                    subCategory:subCatData
                }
                newFinalTypeDetailsData.push(a)
                newFinalTypeDetails.push(b)
            })
            setFinalTypeDetailsData(newFinalTypeDetailsData)
            setFinalTypeDetails(newFinalTypeDetails)
        }
    },[props.editFlag])
    return (
        <>
            <Formik
                initialValues={{
                    name:props.editFlag ? props.editData.name : '',
                    category:''
                }}

                // validationSchema={validationSchema}

                onSubmit={async(values, { setSubmitting, resetForm }) => {
                    setSubmitting(true)
                    if(props.editFlag){
                        const data={
                            name:values.name,
                            typeDetails:finalTypeDetails
                        }
                        const url=BASEURL+TYPE+'/'+props.editData._id
                        const req=await new APIServices().patch(url,data)
                        if(req.error){
                            props.setToaster(true)
                            props.setToasterMsg(req.results.message)
                            props.setToasterStatus("error")
                            setTimeout(()=>{
                                props.setToaster(false)
                                props.setToasterMsg('')
                                props.setToasterStatus('')
                            },5000)
                        }else{
                            props.updateState(req.results)
                            props.closeModal()
                        }
                    }else{
                        const data={
                            name:values.name,
                            typeDetails:finalTypeDetails
                        }
                        const url=BASEURL+TYPE
                        const req=await new APIServices().post(url,data)
                        if(req.error){
                            props.setToaster(true)
                            props.setToasterMsg(req.results.message)
                            props.setToasterStatus("error")
                            setTimeout(()=>{
                                props.setToaster(false)
                                props.setToasterMsg('')
                                props.setToasterStatus('')
                            },5000)
                        }else{
                            props.updateState(req.results)
                            props.closeModal()
                        }
                    }
                }}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <form
                        autoComplete="off"
                        className="mt-3"
                        onSubmit={handleSubmit}
                    >
                        <FormInput
                            label="Type Name"
                            type="text"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.name}
                            placeholder="Enter Type Name"
                            name="name"
                            touched={touched.name}
                            message={errors.name}
                        />

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <p className="label col-6 p-0 textBold">Type Details</p>
                        </div>

                        <FormDropdown
                            label="Category"
                            onBlur={handleBlur}
                            onChange={(e)=>changeCategory(e,values)}
                            value={typeDetails.category===null ? '' : typeDetails.category}
                            name="category"
                            touched={touched.category}
                            message={errors.category}
                            placeholder="Select Category"
                            disabled={editFlag}
                        >
                            <option></option>
                            {props.category && props.category.map(data =>(
                                <option disabled={finalTypeDetails.some(a=>a.category===data._id)} key={data._id} value={data._id}>{data.name}</option>
                            ))}
                        </FormDropdown>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <p className="label col-6 p-0">Sub-Category</p>
                            <span className="col-6 p-0" ref={ref}>
                                <div className='formInput categorySelectData' onClick={subCategoryDropdown}>
                                    {typeDetails.subCategory.length === 0 ?
                                        <span className='brandCategoryDropdownPlaceholder'>Select Brand Category</span>:
                                        // <span>
                                            subCategory.map((data,i)=>(
                                                <span key={i} className="brandCategorySelectedData">
                                                    <span>
                                                        {0 === i ? '' : ','}
                                                    </span>
                                                    {data.name}
                                                </span>
                                            ))
                                        // {/* </span> */}
                                    }
                                    <span className='brandCategoryDropdownIcon'></span>
                                </div>
                                {dropdown &&
                                    <div className="brandCategoryDropdown">
                                        {currentSubCategory.map(data =>(
                                            <div className='d-flex align-items-center' key={data._id}>
                                                <input 
                                                    type='checkbox'
                                                    checked={typeDetails.subCategory.includes(data._id)}
                                                    onBlur={handleBlur}
                                                    value={data._id}
                                                    onChange={()=>subCategoryChange(values,data)}
                                                    id={`${data._id}`}
                                                />
                                                <label htmlFor={`${data._id}`}>{data.name}</label>
                                            </div>
                                        ))}
                                    </div>
                                }
                               {/* <ErrorValidation touched={touched.brandCategory} message={errors.brandCategory}/> */}
                                <button
                                    className="addTypeDetailsButton"
                                    disabled={typeDetails.subCategory.length>0 && typeDetails.category!==null ? false : true}
                                    onClick={addOtherDetails}
                                >
                                   Add Other Type Details
                                </button>
                            </span>
                        </div>

                        {finalTypeDetailsData.length>0 &&
                            <div>
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            {header.map((data,i)=>(
                                                <th className="tableHeader" scop="col" key={i}>{data.headerName}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {finalTypeDetailsData && finalTypeDetailsData.map((data,i)=>(
                                            <tr key={i}>
                                                <td>
                                                    {data.category.name}
                                                </td>
                                                <td>
                                                    <ul>
                                                        {data.subCategory.map(subCat=>(
                                                            <li key={subCat._id}>{subCat.name}</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img src='/icons/pencil.svg' className="editIcon cursor" onClick={()=>editClick(data,i)}/>
                                                        <img src='/icons/delete.svg'className="deleteIcon cursor" onClick={()=>deleteTypeDetail(data,i)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        }
                        <button
                            type="submit"
                            className="primaryButton modalButton"
                            disabled={isSubmitting}
                        >
                            Submit
                        </button>
                    </form>
                )}
            </Formik>
        </>
    )
}
