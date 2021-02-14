import React from 'react'
import { BASEURL, USERS } from '../../api/APIEndpoints';
import APIServices from '../../api/APIServices';
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../../commonComponents/FormInput';

export default function UserForm(props) {
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
    return (
        <>
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
                        props.closeModal()
                        props.updateData(req.results)
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
                        <FormInput 
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
                        <FormInput 
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
