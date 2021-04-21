import React, { useEffect, useState } from 'react'
import APIServices from '../../../api/APIServices';
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../../../commonComponents/FormInput';
import TextBox from '../../../commonComponents/TextBox';
import { BASEURL, SUBDEPARTMENT,DEPARTMENT } from '../../../api/APIEndpoints';
import FormDropdown from '../../../commonComponents/FormDropdown';
import Toaster from '../../../commonComponents/Toaster';

export default function SubCategoryForm(props) {

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .trim()
            .required("This Field is Required"),

        category: Yup.string()
            .trim()
            .required("This Field is Required"),
    
        description: Yup.string()
            .trim()
            .required("This Field is Required")
    })
    return (
        <>
            <Formik
                initialValues={{
                    name:props.editFlag ? props.editData.name : '',
                    category:props.editFlag ? props.editData.category : '',
                    description:props.editFlag ? props.editData.description : ''
                }}

                validationSchema={validationSchema}

                onSubmit={async(values, { setSubmitting, resetForm }) => {
                    setSubmitting(true)
                    if(props.editFlag){
                        const url=BASEURL+SUBDEPARTMENT+'/'+props.editData._id
                        const data={
                            category:values.category,
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
                        }
                    }else{
                        const url=BASEURL+SUBDEPARTMENT
                        const data={
                            name:values.name,
                            category:values.category,
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
                        }
                    }
                }}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <form
                        autoComplete="off"
                        className="mt-3"
                        onSubmit={handleSubmit}
                        onKeyDown={(e)=>{
                            if(e.keyCode === 13){
                                e.preventDefault()
                                return false
                            }
                        }}
                    >
                        <FormDropdown
                            label="Category"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.category}
                            name="category"
                            touched={touched.category}
                            message={errors.category}
                            placeholder="Select Category"
                            disabled={props.editFlag}
                        >
                            <option></option>
                            {props.category && props.category.map(data =>(
                                <option key={data._id} value={data._id}>{data.name}</option>
                            ))}
                        </FormDropdown>

                        <FormInput 
                            label="Sub-Category Name"
                            type="text"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.name}
                            placeholder="Enter Sub-Category Name"
                            name="name"
                            touched={touched.name}
                            message={errors.name}
                            disabled={props.editFlag}
                        />

                        <TextBox 
                            label="Sub-Category Description"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.description}
                            placeholder="Enter Sub-Category Description"
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
