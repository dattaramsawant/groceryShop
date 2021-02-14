import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { BASEURL, PROFILE, USERS, BASEURL_FRONT } from '../../api/APIEndpoints'
import APIServices from '../../api/APIServices'
import ErrorValidation from '../../commonComponents/ErrorValidation'
import Modal from '../../commonComponents/Modal'
import AdminTopBar from '../nav/AdminTopBar'
import * as Yup from 'yup'
import MultiForm from '../../commonComponents/MultiForm'
import ChangePassword from '../auth/ChangePassword'

export default function Profile() {
    const [profile,setProfile]=useState({})
    const [profileModal,setProfileModal]=useState(false)
    const [avatar]=useState([
        {id:1,src:"/icons/male.svg"},
        {id:2,src:"/icons/male_2.svg"},
        {id:3,src:"/icons/male_3.svg"},
        {id:4,src:"/icons/female.svg"},
        {id:5,src:"/icons/female_2.svg"},
        {id:6,src:"/icons/female_3.svg"},
        {id:7,src:"/icons/female_4.svg"}
    ])
    const [avatarSelect,setAvavatarSelect]=useState(null)
    const [updateState,setUpdateState]=useState(0)
    const [files, setFiles] = useState(null)
    const [fileValue, setFileValue] = useState("")
    const [imgURL,setImgURL]=useState(null)
    const [mobileNumber,setMobileNumber]=useState(false)
    const [editFlag,setEditFlag]=useState(false)
    const [formName]=useState([
        {id:1,name:'Change Password'}
    ])
    const [formSelect,setFormSelect]=useState()

    const selectForm=(id)=>{
        if(id !== formSelect){
            setFormSelect(id)
        }else{
            setFormSelect()
        }
    }
    const fetchProfile=async()=>{
        const url=BASEURL+USERS+PROFILE
        const res=await new APIServices().get(url);
        setProfile(res.results);
    }

    useEffect(()=>{
        fetchProfile()
    },[updateState])

    const addProfileClick=()=>{
        setProfileModal(true)
    }
    const closeModal=()=>{
        setProfileModal(false)
    }

    const handleChange=(e)=>{
        setAvavatarSelect(BASEURL_FRONT + e.target.value)
        setFileValue("")
        setFiles(null)
        setImgURL(null)
    }

    function srcToFile(src, fileName, mimeType){
        return (fetch(src)
            .then(function(res){return res.arrayBuffer();})
            .then(function(buf){return new File([buf], fileName, {type:mimeType});})
        );
    }

    const handleInputClick = () => {
        setFileValue("")
    }

    const onFileChange=(e)=>{
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
        setAvavatarSelect(null)
        setFiles(e.target.files[0])
    }

    const handleSubmit=async()=>{
        if(avatarSelect!==null){
            const imgName= avatarSelect.split('/')[4]
            srcToFile(avatarSelect, imgName, 'image/svg+xml')
                .then(async function(file){
                    console.log(file)
                    let formData=new FormData()
                    const data={
                        profileImg:file
                    }
                    formData.append('profileImg',file)
                    console.log(data)
                    const url=BASEURL+USERS+PROFILE+'/'+profile._id
                    const req=await new APIServices().patch(url,formData,'form-data')
                    setUpdateState(updateState+1)
                    setProfileModal(false)
                })
        }else{
            let formData=new FormData()
            const data={
                profileImg:files
            }
            formData.append('profileImg',files)
            console.log(data)
            const url=BASEURL+USERS+PROFILE+'/'+profile._id
            const req=await new APIServices().patch(url,formData,'form-data')
            setUpdateState(updateState+1)
        }
    }

    const addMobilNumberClick=()=>{
        setMobileNumber(true)
    }

    const editMobilNumberClick=()=>{
        setMobileNumber(true)
        setEditFlag(true)
    }

    const closeForm=()=>{
        setMobileNumber(false)
        setEditFlag(false)
    }

    const validationSchema = Yup.object().shape({
        mobileNumber: Yup.number()
            .test('len', 'Invalid Mobile Number', val => !val || (val && val.toString().length === 10))
            .required("Mobile Number is Required"),
    })

    const formSelectSwitchCase=()=>{
        switch (formSelect) {
            case 1:
                return(
                    <ChangePassword 
                        user={profile._id}
                    />
                )
        
            default:
                break;
        }
    }

    return (
        <>
            <div className="dashboardMiddleContent">
                <AdminTopBar
                    pageName="Profile"
                />
                <div className='dashboardPage nonUserProfileBox'>
                    <div className="nonUserProfileMain">
                        {profile.profileImg!== undefined ?
                            <div className='position-relative'>
                                <img src={profile.profileImg} className="nonUserAvatar nonUserAvatarImg cursor" onClick={addProfileClick} />
                                <i className="fa fa-camera cameraProfile cameraProfileImg cursor"></i>
                            </div>:
                            <>
                                <div className='position-relative'>
                                    <p className="nonUserAvatar cursor" onClick={addProfileClick}>
                                        {String(profile.name).charAt(0).toUpperCase()}
                                    </p>
                                    <i className="fa fa-camera cameraProfile cursor"></i>
                                </div>
                            </>
                        }
                        <p className="userName">{profile.name}</p>
                        <div className="profileBox">
                            <div className="d-flex align-items-center mb-4">
                                <i className="fa fa-envelope profileDetailIcon" />
                                <p className="userEmail">{profile.email}</p>
                            </div>
                            <div className="d-flex align-items-center">
                                <i className="fa fa-id-badge profileDetailIcon" />
                                <div className="userEmail d-flex">
                                    {mobileNumber ?
                                        <Formik
                                            initialValues={{
                                                mobileNumber:editFlag ? profile.mobileNumber : ''
                                            }}
                    
                                            validationSchema={validationSchema}

                                            onSubmit={async(values,{setSubmitting})=>{
                                                const url=BASEURL+USERS+PROFILE+'/'+profile._id
                                                const data={
                                                    mobileNumber:values.mobileNumber
                                                }
                                                const req=await new APIServices().patch(url,data)
                                                if(!req.error){
                                                    setUpdateState(updateState+1)
                                                    setEditFlag(false)
                                                    setMobileNumber(false)
                                                }
                                            }}
                                        >
                                            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                                                <form
                                                    autoComplete="off"
                                                    // className="mt-3"
                                                    onSubmit={handleSubmit}
                                                >
                                                    <div className='d-flex'>
                                                        <input 
                                                            type="number"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            value={values.mobileNumber}
                                                            placeholder="Enter Mobile Number"
                                                            name="mobileNumber"
                                                            className="formInput profileInput"
                                                        />
                                                        <button 
                                                            type='submit'
                                                            disabled={isSubmitting}
                                                            className='profileSubmitButton'
                                                        >
                                                            <i className="fa fa-check addProfileDetailIcon addProfileFormIcon cursor" />
                                                        </button>
                                                        <i className="fa fa-close addProfileDetailIcon closeProfileDetailIcon cursor" onClick={closeForm}/>
                                                    </div>
                                                    <ErrorValidation touched={touched.mobileNumber} message={errors.mobileNumber}/>
                                                </form>
                                            )}
                                        </Formik>:
                                        profile.mobileNumber ? 
                                        <>
                                            {profile.mobileNumber} <i className="fa fa-pencil addProfileDetailIcon cursor" onClick={editMobilNumberClick} />
                                        </>: 
                                        <>
                                            <p>add your mobile number</p>
                                            <i className='fa fa-plus addProfileDetailIcon cursor' onClick={addMobilNumberClick} />
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <MultiForm
                        formName={formName}
                        formSelect={formSelect}
                        activeNumber={formSelect}
                        selectForm={(id)=>selectForm(id)}
                    >
                        {formSelectSwitchCase()}
                    </MultiForm>
                </div>
            </div>

            {profileModal &&
                <Modal
                    outSideClick={closeModal}
                    closeModal={closeModal}
                    size="small"
                    name="Add Profile"
                >
                    <div className="row" >
                        {avatar.map(data=>(
                            <label key={data.id} className="profileAvatar col-md-3 col-4 cursor">
                                <input
                                    type='radio' 
                                    name='avatarSelect' 
                                    value={data.src} 
                                    onChange={handleChange} 
                                    className="avatarRadioButton"
                                />
                                <img src={data.src} className="profileAvatarImg w-100" />
                                {avatarSelect === BASEURL_FRONT + data.src && <i className="fa fa-check selectAvatar" />}
                            </label>
                        ))}
                        {imgURL !== null ?
                        <div className="profileAvatar col-md-3 col-4">
                            <label className="">
                                <input 
                                    type="file" 
                                    accept=".jpg,png,.jpeg,.svg"
                                    name='files'
                                    onChange={(e)=>onFileChange(e)}
                                    value={fileValue}
                                    onClick={handleInputClick}
                                    className="uploadProfile"
                                />
                                <img src={imgURL} className="addProfileImg" />
                                <i className="fa fa-check selectAvatar" />
                                <span className="tooltipText positionTop">Upload Profile Photo</span>
                            </label>
                        </div>:
                            <div className="profileAvatar col-md-3 col-4">
                                <label className="addProfileIcon">
                                    <input 
                                        type="file" 
                                        accept=".jpg,png,.jpeg,.svg"
                                        name='files'
                                        onChange={(e)=>onFileChange(e)}
                                        value={fileValue}
                                        onClick={handleInputClick}
                                        className="uploadProfile"
                                    />
                                    <span className="horizontalLine"></span>
                                    <span className="verticalLine"></span>
                                    <span className="tooltipText positionTop">Upload Profile Photo</span>
                                </label>
                            </div>
                        }
                    </div>
                    <button 
                        className="primaryButton modalButton"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </Modal>
            }
        </>
    )
}
