import React from 'react'
import APIServices from '../../../api/APIServices';
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../../../commonComponents/FormInput';
import TextBox from '../../../commonComponents/TextBox';
import { BASEURL, DEPARTMENT } from '../../../api/APIEndpoints';

export default function DepartmentForm(props) {
        const validationSchema = Yup.object().shape({
            name: Yup.string()
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
                    description:props.editFlag ? props.editData.description : ''
                }}

                validationSchema={validationSchema}

                onSubmit={async(values, { setSubmitting, resetForm }) => {
                    setSubmitting(true)
                    if(props.editFlag){
                        const url=BASEURL+DEPARTMENT+'/'+props.editData._id
                        const data={
                            name:values.name,
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
                            label="Department Name"
                            type="text"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.name}
                            placeholder="Enter Department Name"
                            name="name"
                            touched={touched.name}
                            message={errors.name}
                            disabled={props.editFlag}
                        />
                        <TextBox 
                            label="Department Description"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.description}
                            placeholder="Enter Department Description"
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
