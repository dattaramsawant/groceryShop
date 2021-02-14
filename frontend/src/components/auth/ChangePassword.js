import React, { useState } from 'react'
import Input from '../../commonComponents/Input'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { AUTH, BASEURL, CHANGEPASSWORD } from '../../api/APIEndpoints'
import APIServices from '../../api/APIServices'
import Toaster from '../../commonComponents/Toaster'

export default function ChangePassword(props) {
    const [error,setError]=useState(undefined)
    const [toaster,setToaster]=useState(false)
    const [toasterMsg,setToasterMsg]=useState(undefined)
    const [toasterStatus,setToasterStatus]=useState(undefined)

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .required("This field is required"),

        newPassword: Yup.string()
            .min(8,"minimum 8 charater is required")
            .required("This field is required"),
        
        confirmPassword:Yup.string()
            .test('passwords-match', 'Password not match', function(value) {
                return this.parent.newPassword === value;
            })
            .required("This field is required")
    })

    return (
        <>
            <p className="multiformPageName">Change Password</p> 
            {error !== undefined &&
                <div className="authErrorBox">
                    <i className="fa fa-exclamation-circle authErrorIcon" />
                    <p className="authErrorText">{error}</p>
                </div>
            }
            {toaster && 
                <Toaster 
                    status={toasterStatus && toasterStatus}
                    msg={toasterMsg && toasterMsg}
                />
            }
            <Formik
                initialValues={{
                    password:'',
                    newPassword:'',
                    confirmPassword:''
                }}

                validationSchema={validationSchema}

                onSubmit={async(values, { setSubmitting, resetForm }) => {
                    const url=BASEURL+AUTH+CHANGEPASSWORD+props.user
                    const data={
                        password:values.password,
                        newPassword:values.newPassword
                    }
                    const req=await new APIServices().patch(url,data)

                    if(req.error){
                        setSubmitting(false)
                        setError(req.results)
                    }else{
                        setError(undefined)
                        setSubmitting(true)
                        setToaster(true)
                        setToasterMsg(req.results)
                        setToasterStatus('success')
                        setTimeout(()=>{
                            setToaster(false)
                            setToasterMsg(undefined)
                            setToasterStatus(undefined)
                        },5000)
                        resetForm(true)
                    }
                }}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <form
                        autoComplete="off"
                        className="changePasswordForm"
                        onSubmit={handleSubmit}
                    >
                        <Input 
                            label="Current Password"
                            type="text"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            placeholder="Enter password"
                            name="password"
                            touched={touched.password}
                            message={errors.password}
                        />

                        <Input 
                            label="New Passowrd"
                            type="text"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.newPassword}
                            placeholder="Enter new passowrd"
                            name="newPassword"
                            touched={touched.newPassword}
                            message={errors.newPassword}
                        />

                        <Input
                            label="Confirm Password"
                            type="text"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.confirmPassword}
                            placeholder="Enter confirm password"
                            name="confirmPassword"
                            touched={touched.confirmPassword}
                            message={errors.confirmPassword}
                        />

                        <button
                            type="submit"
                            className="primaryButton"
                            disabled={isSubmitting}
                        >
                            Change Password
                        </button>
                    </form>
                )}
            </Formik>
        </>
    )
}
