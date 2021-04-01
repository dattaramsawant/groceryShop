import { Formik } from 'formik'
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import { AUTH, BASEURL, OTPSEND, OTPVERIFY } from '../../api/APIEndpoints'
import APIServices from '../../api/APIServices'
import Input from '../../commonComponents/Input'

export default function SignInOTP(props) {
    const [error,setError]=useState(false)
    const [errorMessage,setErrorMessage]=useState()
    const [otpScreen,setOtpScreen]=useState(false)
    const [email,setEmail]=useState()
    const [otp,setOtp]=useState({
        otp1:'',
        otp2:'',
        otp3:'',
        otp4:''
    })
    const [otpNumber,setOtpNumber]=useState('')
    const otp1=useRef(null);
    const otp2=useRef(null);
    const otp3=useRef(null);
    const otp4=useRef(null);

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Must be a valid email address")
            .required("This Field is Required")
    })

    const handleOTP=(e)=>{
        const numberCheck = /^[0-9\b]+$/;

        if(e.target.value==="" || numberCheck.test(e.target.value)){
            setOtp({...otp,[e.target.name]:e.target.value})
        }
    }
    const otpKeyUp=(e)=>{
        const numberCheck = /^[0-9\b]+$/;
        if(numberCheck.test(e.target.value) || e.keyCode === 8 || e.keyCode === 37 || e.keyCode===39){
            if(e.target.name === "otp1"){
                otp2.current.focus();
                if(e.keyCode === 8 || e.keyCode===37){
                    otp1.current.focus();
                }

                if(e.keyCode === 39){
                    otp2.current.focus();
                }
            }
            if(e.target.name==="otp2"){
                otp3.current.focus();
                if(e.keyCode === 8 || e.keyCode===37){
                    otp1.current.focus();
                }

                if(e.keyCode === 39){
                    otp3.current.focus();
                }
            }
            if(e.target.name==="otp3"){
                otp4.current.focus();
                if(e.keyCode === 8 || e.keyCode===37){
                    otp2.current.focus();
                }

                if(e.keyCode === 39){
                    otp4.current.focus();
                }
            }
            if(e.target.name==="otp4"){
                if(e.keyCode === 8 || e.keyCode===37){
                    otp3.current.focus();
                }
            }
        }

        if(otp.otp1!=="" && otp.otp2!=="" && otp.otp3!=="" && otp.otp4!==""){
            const otpFinal=otp.otp1+otp.otp2+otp.otp3+otp.otp4
            setOtpNumber(parseInt(otpFinal))
        }

    }
    const otpPaste=(e)=>{
        const numberCheck = /^[0-9\b]+$/;
        const pastedValue=e.clipboardData.getData('Text');
        if(numberCheck.test(pastedValue)){
            const splitValue=pastedValue.split("");
            splitValue.forEach((element,i) => {
                setOtp(otp=>({...otp,[`otp${i+1}`]:element}))
            });
        }
        otp4.current.focus();
        if(otp.otp1!=="" && otp.otp2!=="" && otp.otp3!=="" && otp.otp4!==""){
            const otpFinal=otp.otp1+otp.otp2+otp.otp3+otp.otp4
            setOtpNumber(parseInt(otpFinal))
        }
    }

    const signInClick=()=>{
        if(otp.otp1!=="" && otp.otp2!=="" && otp.otp3!=="" && otp.otp4!==""){
            const otpFinal=otp.otp1+otp.otp2+otp.otp3+otp.otp4
            const url=BASEURL+AUTH+OTPVERIFY
            fetch(url,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    otp: parseInt(otpFinal),
                    email: email
                })
            })
            .then((res)=>{
                return res.json()
            })
            .then((response) => {
                if(response.token === undefined){
                    setError(true)
                    setErrorMessage(response.message)
                }else{
                    const accessToken=response.token;
                    const allDetails=response.user;
                    window.localStorage.setItem("grocery", accessToken);
                    window.localStorage.setItem("groceryUser", JSON.stringify(allDetails));
                    props.history.push('/demo')
                    setTimeout(() => {
                        window.location.reload()
                    }, 500)
                    setError(false)
                }
            })
        }
    }

    const emailHandle=(e,values)=>{
        setEmail(e.target.value)
        values.email=e.target.value
    }

    return (
        <div className="authPage">
            <img src='/logoSuperMarket.png' className="authLogo"/>
            <div className="authBox">
                <p className="formName">Sign In</p>

                {error &&
                    <div className="authErrorBox">
                        <i className="fa fa-exclamation-circle authErrorIcon" />
                        <p className="authErrorText">{errorMessage}</p>
                    </div>
                }
                
                {!otpScreen ?
                    <Formik
                        initialValues={{
                            email:''
                        }}

                        validationSchema={validationSchema}

                        onSubmit={async(values, { setSubmitting, resetForm }) => {
                            setSubmitting(true)
                            const url=BASEURL+AUTH+OTPSEND
                            const data={
                                email:values.email
                            }
                            const req=await new APIServices().post(url,data)
                            console.log(req)
                            if(req.status===201){
                                setError(false)
                                setOtpScreen(true)
                            }else{
                                setError(true)
                                setOtpScreen(false)
                            }
                            // fetch(url,{
                            //     method: "POST",
                            //     headers: {
                            //         "Content-Type": "application/json"
                            //     },
                            //     body: JSON.stringify({
                            //         email: values.email
                            //     })
                            // })
                            // .then((response) => {
                            //     console.log(response)
                            //     if(response.status===400){
                            //         setError(true)
                            //         return response.json()
                            //     }else{
                            //         setError(false)
                            //         return response.json()
                            //     }
                            // })
                            // .then(res=>{
                            //     console.log(error)
                            //     if(error){
                            //         console.log(res)
                            //         setErrorMessage(res)
                            //     }else{
                            //         setOtpScreen(true)
                            //     }
                            //     setSubmitting(false)
                            // })
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
                                    onChange={(e)=>emailHandle(e,values)}
                                    value={values.email}
                                    placeholder="Enter Email"
                                    name="email"
                                    touched={touched.email}
                                    message={errors.email}
                                />
                                <button
                                    type="submit"
                                    className="primaryButton"
                                    // disabled={isSubmitting}
                                >
                                    Get OTP
                                </button>
                                <p className='signInOR'>or</p>
                                <div className='signInOTP'>
                                    <Link to='/signin'>
                                        login via Email
                                    </Link>
                                </div>
                            </form>
                        )}
                    </Formik>:
                    <>
                        <div className='otpMain'>
                            <input 
                                className="otpInput"
                                onKeyUp={otpKeyUp}
                                onPaste={otpPaste}
                                ref={otp1}
                                onChange={handleOTP}
                                value={otp.otp1}
                                name='otp1'
                                minLength='1'
                                maxLength='1'
                            />
                            <input 
                                className="otpInput"
                                onKeyUp={otpKeyUp}
                                onPaste={otpPaste}
                                ref={otp2}
                                onChange={handleOTP}
                                value={otp.otp2}
                                name='otp2'
                                minLength='1'
                                maxLength='1'
                            />
                            <input 
                                className="otpInput"
                                onKeyUp={otpKeyUp}
                                onPaste={otpPaste}
                                ref={otp3}
                                onChange={handleOTP}
                                value={otp.otp3}
                                name='otp3'
                                minLength='1'
                                maxLength='1'
                            />
                            <input 
                                className="otpInput"
                                onKeyUp={otpKeyUp}
                                onPaste={otpPaste}
                                ref={otp4}
                                onChange={handleOTP}
                                value={otp.otp4}
                                name='otp4'
                                minLength='1'
                                maxLength='1'
                            />
                        </div>
                        <button
                            className="primaryButton"
                            onClick={signInClick}
                            // disabled={isSubmitting}
                        >
                            Sign In
                        </button>
                        <p className='signInOR'>or</p>
                        <div className='signInOTP'>
                            <Link to='/signin'>
                                login via Email
                            </Link>
                        </div>
                    </>
                }
            </div>   
            <div className="authOther">
                Don't have an account? <Link to='/signup' className="authOtherText">Sign Up</Link>
            </div>
        </div>
    )
}
