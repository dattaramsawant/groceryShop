import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import Input from '../../commonComponents/Input'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'
import { AUTH, BASEURL } from '../../api/APIEndpoints'

export default function SignIn(props) {
    const [error,setError]=useState()
    useEffect(()=>{
        var login = window.localStorage.getItem('grocery')
        if( login){
            props.history.push("/demo")
        }
    },[])
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Must be a valid email address")
            .required("This Field is Required"),

        password: Yup.string()
            .required("This Field is Required"),
    })
    return (
        <div className="authPage">
            <img src='/logoSuperMarket.png' className="authLogo"/>
            <div className="authBox">
                <p className="formName">Sign In</p>

                {error &&
                    <div className="authErrorBox">
                        <i className="fa fa-exclamation-circle authErrorIcon" />
                        <p className="authErrorText">{error}</p>
                    </div>
                }

                <Formik
                    initialValues={{
                        email:'',
                        password:''
                    }}

                    validationSchema={validationSchema}

                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        setSubmitting(true)
                        const url=BASEURL+AUTH
                        fetch(url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                email: values.email,
                                password: values.password
                            })
                        })
                        .then((response) => response.json())
                        .then(res=>{
                            const accessToken=res.token;
                            const allDetails=res.user;
                            if(accessToken !== undefined){
                                window.localStorage.setItem("grocery", accessToken);
                                window.localStorage.setItem("groceryUser", JSON.stringify(allDetails));
                                props.history.push('/demo')
                                setTimeout(() => {
                                    window.location.reload()
                                }, 500)
                            }else{
                                console.log('err')
                                setError(res)
                                setSubmitting(false)
                            }
                        })
                        .catch(error => {
                            setSubmitting(false);
                        });
                    }}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                        <form
                            autoComplete="off"
                            className=""
                            onSubmit={handleSubmit}
                        >
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
                                Sign In
                            </button>
                            <p className='signInOR'>or</p>
                            <div className='signInOTP'>
                                <Link to='/otpLogin'>
                                    login via otp
                                </Link>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
            <div className="authOther">
                Don't have an account? <Link to='/signup' className="authOtherText">Sign Up</Link>
            </div>
        </div>
    )
}
