import React, { useRef, useState } from 'react'
import { BASEURL, PRODUCTIMG } from '../../api/APIEndpoints'
import APIServices from '../../api/APIServices'
import Toaster from '../../commonComponents/Toaster'

export default function ProductImageUpload() {
    const [fileValue,setFileValue]=useState("")
    const [files,setFiles]=useState([])
    const [toaster,setToaster]=useState(false)
    const [toasterStatus,setToasterStatus]=useState(undefined)
    const [toasterMsg,setToasterMsg]=useState(undefined)
    const [errorSizeImg,setErrorSizeImg]=useState([])
    const [successImg,setSuccessImg]=useState([])
    const [successImgUpload,setSuccessImgUpload]=useState([])
    const [errorDimensionImg,setErrorDimensionImg]=useState([])
    const [imgUpload,setImgUpload]=useState(false)
    const [imgUploadSuccess,setImgUploadSuccess]=useState([])
    const [imgUploadError,setImgUploadError]=useState([])
    const ref = useRef()

    const onFileChange=(e)=>{
        e.preventDefault();

        if(e.target.files.length > 0){
            setFiles(e.target.files)
            let selectedImages=e.target.files
            const errorImgSize=[]
            const errorImgURL=[]
            const successImg=[]
            const successImgData=[]
            const errorImgDimension=[]
            const errorImgDimensionData=[]
            Array.from(selectedImages).forEach(img =>{
                // check image size
                if(img.size > 2000000){
                    errorImgSize.push(img)
                }else{
                    successImg.push(img)
                }

                // check image dimension
                // let image=new Image()
                // image.src = window.URL.createObjectURL(img);
                // image.onload=function(){
                //     window.URL.revokeObjectURL(image.src);

                //     if(this.width==1080 && this.height==1079){

                //     }else{
                //         errorImgDimension.push(img)
                //     }
                // }
            })
            errorImgSize.map(data=>{
                const errorImg={
                    // url:URL.createObjectURL(data),
                    imgName:data.name
                }
                errorImgURL.push(errorImg)
            })

            successImg.map(data=>{
                const successImg={
                    imgName:data.name
                }
                successImgData.push(successImg)
            })

            // errorImgDimension.map(data=>{
            //     console.log(data)
            //     const errorImg={
            //         url:URL.createObjectURL(data),
            //         imgName:data.name
            //     }
            //     errorImgDimensionData.push(errorImg)
            // })
            setErrorSizeImg(errorImgURL)
            setSuccessImg(successImgData)
            setSuccessImgUpload(successImg)
            // setErrorDimensionImg(errorImgDimensionData)
        }
    }

    const handleInputClick=()=>{
        
    }

    const mouseEnter=()=>{
        
    }

    const submit=async()=>{
        if(successImg.length>0){
            const url=BASEURL+PRODUCTIMG
            let formData=new FormData()
            successImgUpload.forEach(data=>{
                formData.append('productImg',data)
            })
            const req=await new APIServices().post(url,formData,'form-data')
            console.log(req)
            if(req.error){

            }else{
                setImgUpload(true)
                setImgUploadSuccess(req.results.success)
                setImgUploadError(req.results.error)

                setToaster(true)
                setToasterMsg('Images upload successfully')
                setToasterStatus('success')
                setTimeout(()=>{
                    setToaster(false)
                    setToasterMsg(undefined)
                    setToasterStatus(undefined)
                },5000)
            }
            
        }else{
            setToaster(true)
            setToasterMsg('At least 1 image is required')
            setToasterStatus('error')
            setTimeout(()=>{
                setToaster(false)
                setToasterMsg(undefined)
                setToasterStatus(undefined)
            },5000)
        }
    }

    const cancel=()=>{
        setImgUpload(false)
        setImgUploadSuccess([])
        setImgUploadError([])
        setFiles([])
    }
    return (
        <div className={files.length>0 ? 'productUploadPage':undefined}>
            {toaster &&
                <Toaster 
                    status={toasterStatus && toasterStatus}
                    msg={toasterMsg && toasterMsg}
                />
            }

            {files.length > 0 ?
                imgUpload ? 
                    <div className="p-3 h-100">
                        <div className="productDataBox">
                            <p className="productImageUploadStatus">Unsuccess Images:</p>
                            <div className='row w-100 m-0'>
                                {Array.from(imgUploadError).map((data,i) =>(
                                    <div ref={ref} onMouseEnter={mouseEnter} key={i} className="col-md-2 col-sm-6 col-12 mb-4 productImgHover">
                                        <p className="productImgName">{data}</p>
                                        <span className="tooltipText positionBottom">{data}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="productDataBox">
                            <p className="productImageUploadStatus">Success Images:</p>
                            <div className='row w-100 m-0'>
                                {Array.from(imgUploadSuccess).map((data,i) =>(
                                    <div key={i} className="col-md-2 col-sm-6 col-12 mb-4 productImgHover">
                                        <p className="productImgName">{data}</p>
                                        <span className="tooltipText positionBottom">{data}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                        <button className="primaryButton modalButton dashCancelButton2" onClick={cancel}>
                            Cancel
                        </button>
                        </div>
                    </div>
                :
                <div className="p-3 h-100">
                    <div className="productDataBox">
                        <p className="productImageUploadStatus">Unsuccess Images:</p>
                        <div className='row w-100 m-0'>
                            {Array.from(errorSizeImg).map((data,i) =>(
                                <div key={i} className="col-md-2 col-sm-6 col-12 mb-4 productImgHover">
                                    <p className="productImgName">{data.imgName}</p>
                                    <span className="tooltipText positionBottom">{data.imgName}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="productDataBox">
                        <p className="productImageUploadStatus">Success Images:</p>
                        <div className='row w-100 m-0'>
                            {Array.from(successImg).map((data,i) =>(
                                <div key={i} className="col-md-2 col-sm-6 col-12 mb-4 productImgHover">
                                    <p className="productImgName">{data.imgName}</p>
                                    <span className="tooltipText positionBottom">{data.imgName}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                    <button className="primaryButton modalButton dashSubmitButton" onClick={submit}>
                        Upload
                    </button>
                    <button className="primaryButton modalButton dashCancelButton" onClick={cancel}>
                        Cancel
                    </button>
                    </div>
                </div>
            :
                <div className='uploadProductImageBox d-flex justify-content-center align-items-center text-center'>
                    <div>
                    <p className="uploadText">To upload  your design click here on Choose Images.</p>
                    <div>
                        <input
                            accept=".jpg,png,.jpeg,.gif"
                            className='d-none'
                            id="contained-button-file"
                            type="file"
                            multiple
                            onChange={onFileChange}
                            value={fileValue}
                            onClick={handleInputClick}
                        />
                        <label htmlFor="contained-button-file">
                            <div className='primaryButton bulkUploadButton'>
                                Choose images
                            </div>
                        </label>
                    </div>
                    <div className="uploadGuideline">
                        <p>Design image Parameters guideline for uploading images:</p>
                        <p>Size of image &nbsp;&nbsp;   - &nbsp;Maximum <b>2 MB</b></p>
                        <p>image dimensions&nbsp;&nbsp; - &nbsp;<b>1000px * 1000px</b></p>
                    </div>
                    <p className="uploadNoteText"><b>Note:</b><span> The design name must be as per the PRODUCTCODE of products,
                    which are  already uploaded for eg. <b>PRODUCTCODE_1</b> </span> </p>
                    </div>
                </div>
            }
        </div>
    )
}
