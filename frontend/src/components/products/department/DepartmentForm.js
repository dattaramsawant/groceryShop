import React, { useEffect, useRef, useState } from 'react'
import APIServices from '../../../api/APIServices';
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../../../commonComponents/FormInput';
import TextBox from '../../../commonComponents/TextBox';
import { BASEURL, DEPARTMENT } from '../../../api/APIEndpoints';
import useClickOutSide from '../../../customHook/useClickOutsSde';
import ErrorValidation from '../../../commonComponents/ErrorValidation';

export default function DepartmentForm(props) {
    const [dropdown,setDropdown]=useState(false)
    const [subCategoryData,setSubCategoryData]=useState([])
    const [subCategoryAllData,setSubCategoryAllData]=useState([])
    const ref=useRef()

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .trim()
            .required("This Field is Required"),

        subCategory: Yup.string()
            .trim()
            .required("This Field is Required"),
    
        description: Yup.string()
            .trim()
            .required("This Field is Required")
    })

    const subCategoryDropdown=()=>{
        setDropdown(!dropdown)
    }
    useClickOutSide(ref,()=>{
        setDropdown(false)
    });

    const subCategoryChange=(values,data)=>{
        if(subCategoryData.includes(data._id)){
            const subCategory=[]
            const subCategoryName=[]
            subCategoryData.filter(category=>{
                if(category !== data._id){
                    subCategory.push(category)
                }
            })
            subCategoryAllData.filter(category=>{
                if(category.name !== data.name){
                    subCategoryName.push(category)
                }
            })
            setSubCategoryData(subCategory)
            setSubCategoryAllData(subCategoryName)
            values.subCategory=subCategory
        }else{
            setSubCategoryData([...subCategoryData,data._id])
            setSubCategoryAllData([...subCategoryAllData,data])
            values.subCategory=[...values.subCategory,data._id]
        }
    }

    useEffect(() => {
        if(props.editFlag){
            const subCategoryId=[]
            const subCategoryName=[]
            props.editData.subCategory.map(data=>{
                subCategoryId.push(data._id)
                subCategoryName.push(data)
            })
            setSubCategoryData(subCategoryId)
            setSubCategoryAllData(subCategoryName)
        }
    }, [props.editFlag])

    return (
        <>
            <Formik
                initialValues={{
                    name:props.editFlag ? props.editData.name : '',
                    subCategory:props.editFlag ? props.editData.subCategory : [],
                    description:props.editFlag ? props.editData.description : ''
                }}

                validationSchema={validationSchema}

                onSubmit={async(values, { setSubmitting, resetForm }) => {
                    setSubmitting(true)
                    if(props.editFlag){
                        const url=BASEURL+DEPARTMENT+'/'+props.editData._id
                        const data={
                            subCategory:values.subCategory,
                            description:values.description
                        }
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
                            props.setToaster(true)
                            props.setToasterMsg('Category added successfully')
                            props.setToasterStatus("success")
                            setTimeout(()=>{
                                props.setToaster(false)
                                props.setToasterMsg('')
                                props.setToasterStatus('')
                            },5000)
                        }
                    }else{
                        const url=BASEURL+DEPARTMENT
                        const data={
                            name:values.name,
                            subCategory:values.subCategory,
                            description:values.description
                        }
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
                            props.setToaster(true)
                            props.setToasterMsg('Category added successfully')
                            props.setToasterStatus("success")
                            setTimeout(()=>{
                                props.setToaster(false)
                                props.setToasterMsg('')
                                props.setToasterStatus('')
                            },5000)
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
                            label="Category Name"
                            type="text"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.name}
                            placeholder="Enter Category Name"
                            name="name"
                            touched={touched.name}
                            message={errors.name}
                            disabled={props.editFlag}
                        />

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <p className="label col-6 p-0">Sub-Category</p>
                            <span className="col-6 p-0" ref={ref}>
                                <div className='formInput categorySelectData' onClick={subCategoryDropdown}>
                                    {values.subCategory.length === 0 ?
                                        <span className='brandCategoryDropdownPlaceholder'>Select Sub-Category</span>:
                                        // <span>
                                            subCategoryAllData.map((data,i)=>(
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
                                        {props.subCategory.map(data =>(
                                            <div className='d-flex align-items-center' key={data._id}>
                                                <input 
                                                    type='checkbox'
                                                    checked={subCategoryData.includes(data._id)}
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
                               <ErrorValidation touched={touched.subCategory} message={errors.subCategory}/>
                            </span>
                        </div>

                        <TextBox 
                            label="Category Description"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.description}
                            placeholder="Enter Category Description"
                            name="description"
                            touched={touched.description}
                            message={errors.description}
                            cols='50'
                            rows='4'
                        />
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
