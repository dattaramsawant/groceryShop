import React, { useEffect, useRef, useState } from 'react'
import APIServices from '../../../api/APIServices';
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../../../commonComponents/FormInput';
import { BASEURL, BRAND } from '../../../api/APIEndpoints';
import ErrorValidation from '../../../commonComponents/ErrorValidation';
import useClickOutSide from '../../../customHook/useClickOutsSde'

export default function BrandForm(props) {
    const [dropdown,setDropdown]=useState(false)
    const [brandCategoryData,setBrandCategoryData]=useState([])
    const [brandCategoryAllData,setBrandCategoryAllData]=useState([])

    const ref=useRef()
    // console.log(Object.keys(categoryInputClick).length === 0)

    const validationSchema = Yup.object().shape({
        brandName: Yup.string()
            .trim()
            .required("This Field is Required"),
    
        brandCategory: Yup.string()
            .trim()
            .required("This Field is Required")
    })

    const brandCategoryDropdown=()=>{
        setDropdown(!dropdown)
    }

    useClickOutSide(ref,()=>{
        setDropdown(false)
    });
    const brandCategoryChange=(values,data)=>{
        if(brandCategoryData.includes(data._id)){
            const brand=[]
            const brandName=[]
            brandCategoryData.filter(category=>{
                if(category !== data._id){
                    brand.push(category)
                }
            })
            brandCategoryAllData.filter(category=>{
                if(category.name !== data.name){
                    brandName.push(category)
                }
            })
            setBrandCategoryData(brand)
            setBrandCategoryAllData(brandName)
            values.brandCategory=brand
        }else{
            setBrandCategoryData([...brandCategoryData,data._id])
            setBrandCategoryAllData([...brandCategoryAllData,data])
            values.brandCategory=[...values.brandCategory,data._id]
        }
    }
    useEffect(() => {
        if(props.editFlag){
            const brandId=[]
            const brandName=[]
            props.editData.brandCategory.map(data=>{
                brandId.push(data._id)
                brandName.push(data)
            })
            setBrandCategoryData(brandId)
            setBrandCategoryAllData(brandName)
        }
    }, [props.editFlag])

    return (
        <>
            <Formik
                initialValues={{
                    brandName:props.editFlag ? props.editData.brandName : '',
                    brandCategory:props.editFlag ? props.editData.brandCategory : []
                }}

                validationSchema={validationSchema}

                onSubmit={async(values, { setSubmitting, resetForm }) => {
                    setSubmitting(true)
                    if(props.editFlag){
                        const url=BASEURL+BRAND+'/'+props.editData._id
                        const data={
                            // brandName:values.brandName,
                            brandCategory:values.brandCategory
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
                        }
                    }else{
                        const url=BASEURL+BRAND
                        const data={
                            brandName:values.brandName,
                            brandCategory:values.brandCategory
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
                            label="Brand Name"
                            type="text"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.brandName}
                            placeholder="Enter Brand Name"
                            name="brandName"
                            touched={touched.brandName}
                            message={errors.brandName}
                            disabled={props.editFlag ? true : false}
                        />

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <p className="label col-6 p-0">Brand Category</p>
                            <span className="col-6 p-0" ref={ref}>
                                <div className='formInput categorySelectData' onClick={brandCategoryDropdown}>
                                    {values.brandCategory.length === 0 ?
                                        <span className='brandCategoryDropdownPlaceholder'>Select Brand Category</span>:
                                        // <span>
                                            brandCategoryAllData.map((data,i)=>(
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
                                        {props.brandCategory.map(data =>(
                                            <div className='d-flex align-items-center' key={data._id}>
                                                <input 
                                                    type='checkbox'
                                                    checked={brandCategoryData.includes(data._id)}
                                                    onBlur={handleBlur}
                                                    value={data._id}
                                                    onChange={()=>brandCategoryChange(values,data)}
                                                    id={`${data._id}`}
                                                />
                                                <label htmlFor={`${data._id}`}>{data.name}</label>
                                            </div>
                                        ))}
                                    </div>
                                }
                               <ErrorValidation touched={touched.brandCategory} message={errors.brandCategory}/>
                            </span>
                        </div>

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
