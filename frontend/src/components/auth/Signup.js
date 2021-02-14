import React, { useEffect } from 'react'
import { Formik } from 'formik'
import Input from '../../commonComponents/Input'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'
import { BASEURL, USERS } from '../../api/APIEndpoints'
import APIServices from '../../api/APIServices'

export default function Signup(props) {
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("This Field is Required"),

        email: Yup.string()
            .email("Must be a valid email address")
            .required("This Field is Required"),

        password: Yup.string()
            .min(8,"minimum 8 Charater is Required")
            .required("This Field is Required"),
    })
    useEffect(()=>{
        var login = window.localStorage.getItem('grocery');
        if( login){
            props.history.push("/demo")
        }
    },[])
    return (
        <div className="authPage">
            <img src='/logoSuperMarket.png' className="authLogo"/>
            <div className="authBox">
                <p className="formName">Sign Up</p>

                <Formik
                    initialValues={{
                        name:'',
                        email:'',
                        password:''
                    }}

                    validationSchema={validationSchema}

                    onSubmit={async(values, { setSubmitting, resetForm }) => {
                        setSubmitting(true)
                        const url=BASEURL+USERS
                        const data={
                            name:values.name,
                            email:values.email,
                            password:values.password
                        }
                        const req=await new APIServices().post(url,data)
                        console.log(req)
                        if(!req.error){
                            const accessToken=req.results.token;
                            const allDetails=req.results.user;
                            if(accessToken !== undefined){
                                window.localStorage.setItem("grocery", accessToken);
                                window.localStorage.setItem("groceryUser", JSON.stringify(allDetails));
                                props.history.push('/demo')
                                setTimeout(() => {
                                    window.location.reload()
                                }, 500)
                            }else{
                                setSubmitting(false)
                            }
                        }
                    }}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                        <form
                            autoComplete="off"
                            className=""
                            onSubmit={handleSubmit}
                        >
                            <Input 
                                label="Full Name"
                                type="text"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.name}
                                placeholder="Enter Full Name"
                                name="name"
                                touched={touched.name}
                                message={errors.name}
                            />
                            <Input 
                                label="Email"
                                type="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                placeholder="Enter Email"
                                name="email"
                                touched={touched.email}
                                message={errors.email}
                            />
                            <Input 
                                label="Password"
                                type="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                                placeholder="Enter Password"
                                name="password"
                                touched={touched.password}
                                message={errors.password}
                            />

                            <button
                                type="submit"
                                className="primaryButton"
                                disabled={isSubmitting}
                            >
                                Sign Up
                            </button>
                        </form>
                    )}
                </Formik>
            </div>
            <div className="authOther">
                I have an account? <Link to="/signin" className="authOtherText">Sign In</Link>
            </div>
        </div>
    )
}