import React, { useState } from 'react'
import { BASEURL, BULK, DEPARTMENT } from '../../../api/APIEndpoints'
import APIServices from '../../../api/APIServices'

export default function DepartmentBulkUpload(props) {
    const [file,setFile]=useState(null)

    const onFileChange=(e)=>{
        setFile(e.target.files[0])
    }
    const cancel=()=>{
        setFile(null)
    }
    const submit=async()=>{
        const url=BASEURL+DEPARTMENT+BULK
        const formData=new FormData()
        formData.append('csv',file)
        const req=await new APIServices().post(url,formData,'form-data')
        if(!req.error){
            props.updateState(req.results)
            props.closeModal()
        }
    }
    return (
        <div className="textCenter">
            <p className="uploadText">To upload your category click here to choose file.</p>
            <div>
                <input
                    accept=".csv"
                    className='d-none'
                    id="contained-button-file"
                    type="file"
                    onChange={onFileChange}
                    value=''
                />
                <label htmlFor="contained-button-file">
                    <div className='primaryButton bulkUploadButton'>
                        Choose File
                    </div>
                </label>
                {file && <p className="bulkFileName">{file.name}</p>}
            </div>
            <p className="uploadNoteText"><a href="/files/category-sample-file.csv" download className="linkText">Click here</a>to download sample format file.</p>
            <p className="uploadNoteText"><b>Note: </b><span>Only .csv file is required.</span></p>
            {file &&
                <div>
                    <button className="primaryButton modalButton bulkSubmitBtn" onClick={submit}>
                        Upload
                    </button>
                    <button className="primaryButton modalButton bulkCancelBtn" onClick={cancel}>
                        Cancel
                    </button>
                </div>
            }
        </div>
    )
}
