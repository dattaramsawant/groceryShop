import React, { useState,useEffect } from 'react'
import APIServices from '../../api/APIServices';
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../../commonComponents/FormInput';
import TextBox from '../../commonComponents/TextBox';
import FormDropdown from '../../commonComponents/FormDropdown';
import ErrorValidation from '../../commonComponents/ErrorValidation';
import { BASEURL, PRODUCT } from '../../api/APIEndpoints';

export default function ProductForm(props) {
    const [files, setFiles] = useState([])
    const [fileValue, setFileValue] = useState("")
    const [brandCategory,setBrandCategory]=useState([])
    const [errorFileCount, setErrorFileCount] = useState(0)
    const [errorSize, setErrorSize] = useState(0)
    const [category,setCategory]=useState('')
    const [subCategory,setSubCategory]=useState('')
    const [subCategoryFilter,setSubCategoryFilter]=useState([])
    const [imgURL,setImgURL]=useState([])
    const [imgDB,setImgDB]=useState([])
    const [imgURLDB,setImgURLDB]=useState([])
    const [measurement]=useState([
        {value:'kg',name:'Kilogram(kg)'},
        {value:'gm',name:'Gram(gm)'},
        {value:'l',name:'Liter(l)'},
        {value:'ml',name:'Milliliter(ml)'}
    ])
    const [otherWeight,setOtherWeight]=useState([])
    const [error,setError]=useState()
    
    const imgToFile=()=>{
        let imgArray=[]
        props.editData.productImg.forEach((data)=>{
            const url=data
            let img=new Image()
            img.crossOrigin="Anonymous"
            fetch(data)
            .then(res=>res.blob())
            .then(blob=>{
                const metadata={
                    type:blob.type
                }
                const imgToFile=new File([blob],url,metadata)
                imgArray.push(imgToFile)
            })
            
        })
        setImgDB(imgArray)
    }
    useEffect(() => {
        if(props.editFlag){
            imgToFile()
            setImgURLDB(props.editData.productImg)
        }
    },[])

    const onFileChange = (e,data) => {
        if(e.target.files.length > 0){
            const filesSelected = Array.from(e.target.files);
            Promise.all(filesSelected.map(file => {
                return (new Promise((resolve,reject) => {
                    const reader = new FileReader();
                    reader.addEventListener('load', (ev) => {
                        resolve(ev.target.result);
                    });
                    reader.addEventListener('error', reject);
                    reader.readAsDataURL(file);
                }));
            }))
            .then(images => {
                setImgURL(images)

            }, error => {        
                console.error(error);
            });
            if(props.editFlag){
                const imgArray=[...imgDB]
                filesSelected.forEach(data=>imgArray.push(data))
                setImgDB(imgArray)
            }else{
                setFiles(filesSelected)
                data.files=filesSelected
            }
        }
    }
    const handleInputClick = () => {
        setErrorFileCount(0)
        setErrorSize(0)
        setFileValue("")
    }

    const removeImg=(values,i)=>{
        const filesArray=files.filter((data,index)=>{
            if(files.length-1 ===i){
                props.openModal()
                return index!==i
            }else{
                return index!==i
            }
        });
        const imgURLArray=imgURL.filter((data,index)=>{
            if(imgURL.length-1 ===i){
                props.openModal()
                return index!==i
            }else{
                return index!==i
            }
        });
        setFiles(filesArray)
        setImgURL(imgURLArray)
        values.files=filesArray
    }

    const removeImgDB=(values,i)=>{
        const filesArray=[]
        const imgURLArray=[]

        imgDB.filter((data,index)=>{
            if(i !== index){
                filesArray.push(data)
            }
        })
        imgURLDB.filter((data,index)=>{
            if(i !== index){
                imgURLArray.push(data)
            }
        });
        setImgDB(filesArray)
        setImgURLDB(imgURLArray)
        values.files=filesArray
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("This Field is Required"),

        brandName: Yup.string()
            .required("This Field is Required"),
    
        category: Yup.string()
            .required("This Field is Required"),
    
        subCategory: Yup.string()
            .required("This Field is Required"),
    
        price: Yup.number()
            .min(0,"Positive Number is Required")
            .positive("Positive Number is Required")
            .required("This Field is Required"),

        quantity:Yup.number()
            .min(0,"Positive Number is Required")
            .positive("Positive Number is Required")
            .required("This Field is Required"),

        available:Yup.boolean()
            .required("This Field is Required"),

        description:Yup.string()
            .required("This Field is Required"),

        // files:Yup.array()
        //     .max(5,"Maximum 5 Image is Required")
        //     .required("This Field is Required"),

        weight:Yup.number()
            .min(0,"Positive Number is Required")
            .positive("Positive Number is Required")
            .required("This Field is Required"),

        measurement:Yup.string()
            .required("This Field is Required"),

        productCode:Yup.string()
            .required("This Field is Required"),
    })

    const changeBrand=(e,data)=>{
        setBrandCategory(e.target.value)
        data.brandName=e.target.value
    }

    const changeCategory=(e,data)=>{
        setCategory(e.target.value)
        data.category=e.target.value
        const subCategoryFilter=[]
        
        props.subCategory.filter(subCategory=>{
            if(subCategory.category._id === e.target.value){
                subCategoryFilter.push(subCategory)
            }
        })
        setSubCategoryFilter(subCategoryFilter)
    }

    useEffect(()=>{
        if(props.editFlag){
            props.subCategory.filter(subCategory=>{
                if(subCategory.category._id ===props.editData.category._id){
                    subCategoryFilter.push(subCategory)
                }
            })
            setSubCategoryFilter(subCategoryFilter)
        }
    },[props.editFlag])
    const changeSubCategory=(e,data)=>{
        setSubCategory(e.target.value)
        data.subCategory=e.target.value
    }

    const addOtherWeight=(values)=>{
        if(values.otherWeightNumber!=="" &&  values.otherMeasurement!==""){
            const data={
                weight:values.otherWeightNumber,
                measurement:values.otherMeasurement
            }
            setOtherWeight([...otherWeight,data])
            setError('')
            values.otherWeightNumber=""
            values.otherMeasurement=""
        }else{
            setError('This field is required')
        }
    }
    const removeOtherWeight=(data)=>{
        const otherWeightFilter=[]
        otherWeight.filter((weight,i) => {
            if(i !== data){
                otherWeightFilter.push(weight)
            }
        })
        setOtherWeight(otherWeightFilter)
    }
    
    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    brandName:props.editFlag ? props.editData.brandName._id : '',
                    name:props.editFlag ? props.editData.name : '',
                    category:props.editFlag ? props.editData.category._id : '',
                    subCategory:props.editFlag ? props.editData.subCategory._id : '',
                    price:props.editFlag ? props.editData.price : '',
                    quantity:props.editFlag ? props.editData.quantity : '',
                    available:props.editFlag ? props.editData.available : '',
                    description:props.editFlag ? props.editData.description : '',
                    files:props.editFlag ? imgDB : [],
                    weight:props.editFlag ? props.editData.weight:'',
                    otherWeightNumber:'',
                    otherMeasurement:'',
                    measurement:props.editFlag ? props.editData.measurement:'',
                    productCode:props.editFlag ? props.editData.productCode:''
                }}

                // validationSchema={validationSchema}

                onSubmit={async(values, { setSubmitting, resetForm }) => {
                    setSubmitting(true)
                    if(props.editFlag){
                        const url=BASEURL+PRODUCT+'/'+props.editData._id
                        const data={
                            brandName:values.brandName,
                            name:values.name,
                            category:values.category,
                            subCategory:values.subCategory,
                            price:values.price,
                            quantity:values.quantity,
                            available:values.available,
                            description:values.description,
                            productImg:values.files,
                            weight:values.weight,
                            measurement:values.measurement
                        }
                        const formData= new FormData()
                        Object.keys(data).map((d,i)=>(
                            // formData.append(d,data[d])
                            d === 'productImg' ? 
                            data[d].map(img =>(
                                formData.append(d,img)
                            ))
                            :
                            formData.append(d,data[d])
                        ))
                        const req=await new APIServices().patch(url,formData,'form-data')

                        if(req.error){
                            console.log(req)
                        }else{
                            props.closeModal()
                            props.updateData(req.results)
                        }
                    }else{
                        const url=BASEURL+PRODUCT
                        const data={
                            brandName:values.brandName,
                            name:values.name,
                            category:values.category,
                            subCategory:values.subCategory,
                            price:values.price,
                            quantity:values.quantity,
                            available:values.available,
                            description:values.description,
                            productImg:values.files,
                            weight:values.weight,
                            measurement:values.measurement,
                            offer:true,
                            offerValue:20,
                            productCode:values.productCode
                        }
                        const formData= new FormData()
                        Object.keys(data).map((d,i)=>(
                            // formData.append(d,data[d])
                            d === 'productImg' ? 
                            data[d].map(img =>(
                                formData.append(d,img)
                            ))
                            :
                            formData.append(d,data[d])
                        ))
                        const req=await new APIServices().post(url,formData,'form-data')

                        if(req.error){
                            console.log(req)
                        }else{
                            props.closeModal()
                            props.updateData(req.results)
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
                        <FormDropdown
                            label="Brand Name"
                            onBlur={handleBlur}
                            // onChange={(e)=>changeBrand(e,values)}
                            onChange={handleChange}
                            value={values.brandName}
                            name="brandName"
                            touched={touched.brandName}
                            message={errors.brandName}
                            placeholder="Select Brand Name"
                            disabled={props.editFlag ? true :false}
                        >
                            <option></option>
                            {props.brand.map(data =>(
                                <option key={data._id} value={data._id}>{data.brandName}</option>
                            ))}
                        </FormDropdown>

                        <FormInput 
                            label="Product Name"
                            type="text"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.name}
                            placeholder="Enter Product Name"
                            name="name"
                            touched={touched.name}
                            message={errors.name}
                            disabled={props.editFlag ? true :false}
                        />
                        
                        <FormDropdown
                            label="Category"
                            onBlur={handleBlur}
                            onChange={(e)=>changeCategory(e,values)}
                            value={values.category}
                            name="category"
                            touched={touched.category}
                            message={errors.category}
                            placeholder="Select Category"
                            disabled={props.editFlag ? true : values.brandName === "" ? true : false}
                        >
                            <option></option>
                            {props.brand.map(data => {
                                if(data._id.includes(values.brandName)){
                                    return(
                                        data.brandCategory.map(category=>(
                                            <option key={category._id} value={category._id}>{category.name}</option>
                                        ))
                                    )
                                }
                            })}
                        </FormDropdown>
                        
                        <FormDropdown
                            label="Sub Category"
                            onBlur={handleBlur}
                            onChange={(e)=>changeSubCategory(e,values)}
                            value={values.subCategory}
                            name="subCategory"
                            touched={touched.subCategory}
                            message={errors.subCategory}
                            placeholder="Select Sub Category"
                            disabled={props.editFlag ? true : values.category === "" ? true : false}
                        >
                            <option></option>
                            {subCategoryFilter && subCategoryFilter.map(data =>{
                                if(data.category._id === values.category){
                                    return <option key={data._id} value={data._id}>{data.name}</option>
                                }
                            })}
                        </FormDropdown>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <p className="label col-6 p-0">Weight</p>
                            <span className="col-6 p-0 d-flex">
                                <div className='col-6 p-0'>
                                    <input 
                                        className="formInput" 
                                        type="text"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.weight}
                                        placeholder="Enter Product Weight"
                                        name="weight"
                                    />
                                </div>
                                <div className='col-6 p-0'>
                                    <select 
                                        className="formInput formDropdown" 
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.measurement}
                                        name="measurement"
                                    >
                                        <option></option>
                                        {measurement.map(data=>(
                                            <option key={data.value} value={data.value}>{data.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </span>
                        </div>

                        {otherWeight.length > 0 &&
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <p className="label col-6 p-0">Other Available Weight</p>
                                <span className="col-6 p-0 d-flex flex-wrap">
                                    {otherWeight.map((data,i) =>(
                                        <div key={i} className="addDataBox">
                                            <span className="addDataMainText">{data.weight}</span>
                                            <span className="addDataSecondaryText">{data.measurement}</span>
                                            <i className="fa fa-close addDataCloseIcon" onClick={()=>removeOtherWeight(i)} />
                                        </div>
                                    ))}
                                </span>
                            </div>
                        }

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            {otherWeight.length === 0 &&
                                <p className="label col-6 p-0">Other Available Weight</p>
                            }
                            <span className={`col-6 p-0 d-flex ${otherWeight.length > 0 && 'offset-6'}`}>
                                <div className='col-5 p-0'>
                                    <input 
                                        className="formInput" 
                                        type="text"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.otherWeightNumber}
                                        placeholder="Enter Product Weight"
                                        name="otherWeightNumber"
                                    />
                                    <ErrorValidation touched={touched.otherWeightNumber} message={errors.otherWeightNumber}/>
                                </div>
                                <div className='col-5 p-0'>
                                    <select 
                                        className="formInput formDropdown" 
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.otherMeasurement}
                                        name="otherMeasurement"
                                    >
                                        <option></option>
                                        {measurement.map(data=>(
                                            <option key={data.value} value={data.value}>{data.name}</option>
                                        ))}
                                    </select>
                                    <ErrorValidation touched={touched.otherMeasurement} message={errors.otherMeasurement}/>
                                </div>
                                <div className="col-2 p-0 ml-2">
                                    <button type="button" className="addDataPrimaryButton" onClick={()=>addOtherWeight(values)}>
                                        <i className='fa fa-plus' />
                                    </button>
                                </div>
                            </span>
                        </div>
                        {error &&
                            <div className="row marginFormCustom">
                                <div className="col-6 offset-6 p-0">
                                    <p className='invalid'>{error}</p>
                                </div>
                            </div>
                        }

                        <FormInput 
                            label="Price"
                            type="number"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.price}
                            placeholder="Enter Product Price"
                            name="price"
                            touched={touched.price}
                            message={errors.price}
                            min='0'
                        />

                        <FormInput 
                            label="Quantity"
                            type="number"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.quantity}
                            placeholder="Enter Product Quantity"
                            name="quantity"
                            touched={touched.quantity}
                            message={errors.quantity}
                            min='0'
                        />

                        <FormDropdown
                            label="Available"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.available}
                            name="available"
                            touched={touched.available}
                            message={errors.available}
                        >
                            <option></option>
                            <option value={true}>True</option>
                            <option value={false}>False</option>
                        </FormDropdown>

                        <TextBox 
                            label="Product Description"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.description}
                            placeholder="Enter Product Description"
                            name="description"
                            touched={touched.description}
                            message={errors.description}
                        />

                        <FormInput 
                            label="Product Code"
                            type="text"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.productCode}
                            placeholder="Enter Product Code"
                            name="productCode"
                            touched={touched.productCode}
                            message={errors.productCode}
                            // disabled={props.edit ? true : false}
                            // readOnly={props.edit ? true : false}
                            disabled={props.editFlag ? true : false}
                            readOnly={props.editFlag ? true : false}
                        />

                        <div>
                            <input
                                accept=".jpg,png,.jpeg,.svg"
                                // className={classes.input}
                                id="contained-button-file"
                                type="file"
                                multiple
                                name='files'
                                onChange={(e)=>onFileChange(e,values)}
                                value={fileValue}
                                onClick={handleInputClick}
                                style={{display:'none'}}
                            />
                            <label htmlFor="contained-button-file" className="addDataPrimaryButton">
                                Choose images
                            </label>
                        </div>
                        <ErrorValidation touched={touched.files} message={errors.files}/>
                        <div className="d-flex flex-wrap">
                            {imgURL.length>0 && imgURL.map((data,i)=>(
                                <div key={i} className='imgPreviewMain'>
                                    <img src={data} className="uploadImgPreview mr-2 mb-2 mt-2" />
                                    <img src='/icons/close.svg' className="imgRemoveIcon cursor" onClick={()=>removeImg(values,i)} />
                                </div>
                            ))}

                            {props.editFlag && imgURLDB.map((data,i)=>(
                                <div key={i} className='imgPreviewMain'>
                                    <img src={data} className="uploadImgPreview mr-2 mb-2 mt-2" />
                                    <img src='/icons/close.svg' className="imgRemoveIcon cursor" onClick={()=>removeImgDB(values,i)} />
                                </div>
                            ))}
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
