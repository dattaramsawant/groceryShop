const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');
const paginatedResults=require('../middleware/paginatedResults');

const SubDepartment=require('../models/SubDepartment');
const Department=require('../models/Department');
const Product = require('../models/Product');
const SubDepartmentReport=require('../models/SubDepartmentReport');
const Type=require('../models/Type');
const multer=require('multer');
const csv=require('csvtojson');
const fs = require('fs');

const currentDate=new Date()
const date=currentDate.getDate()
const month=currentDate.getMonth()
const year=currentDate.getFullYear()
const hour=currentDate.getHours()
const min=currentDate.getMinutes()
const sec=currentDate.getSeconds()
const fullTime=date+'/'+month+'/'+year+'T'+hour+':'+min+':'+sec
console.log(fullTime)
const storage = multer.diskStorage({  
    destination:(req,file,cb)=>{  
        cb(null,'./uploads/subCategory');  
    },  
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString() + file.originalname); 
    }  
});  
const fileFilter=(req,file,cb)=>{
    if (file.mimetype === 'text/csv') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
  
const uploads = multer({storage:storage,fileFilter:fileFilter});  

router.get('/',auth,(req,res)=>{
    const perPage=parseInt(req.query.limit)
    const page=parseInt(req.query.page)
    const search=req.query.name;
    // search array of object {name:{$elemMatch:{subCatName:new RegExp(search,"i")}}}
    SubDepartment.find({name:new RegExp(search,"i")})
        .skip(perPage * page)
        .limit(perPage)
        .populate('category','_id name')
        .sort({createdAt:-1})
        .then(subDepartment=>{
            SubDepartment.countDocuments().then(count=>{
                return res.status(200).json({
                    totalCount:count,
                    currentCount:subDepartment.length,
                    subDepartment
                })
            })
        })
})

router.post('/',auth,(req,res,next)=>{
    const {name,description,category}=req.body;

    // if(!name,!description){
    //     return res.status(400).json({message:'Please enter all details'});
    // }
    SubDepartment.findOne({name,category})
        .then(subDepartment=>{
            if(subDepartment){
                if(subDepartment.category == category && subDepartment.name == name) {
                    return res.status(400).json({message:'Sub-Category name already exists'});
                }
            } else{
                const departentAdd=new SubDepartment({name,description,category});
                departentAdd.save()
                    .then(()=>res.status(201).json({message:'subDepartment added successfully'}))
                    .catch(next);
            }
        })
})

router.patch('/:id',auth,(req,res,next)=>{
    const {name,category}=req.body
    SubDepartment.findOne({name,category})
        .then(dep=>{
            if(dep){
                if(dep.category == category && dep.name == name) {
                    return res.status(400).json({message:'Sub-Category name already exists'});
                }
            } else{
                SubDepartment.findByIdAndUpdate(req.params.id)
                .then(subDepartment=>{
                    subDepartment.description=req.body.description
                    subDepartment.name=req.body.name
        
                    subDepartment.save()
                        .then(()=>res.status(200).json({message:"SubDepartment update successfully"}))
                        .catch(next)
                })
            }
        })
})

router.put('/:id',auth,(req,res,next)=>{
    const {name}=req.body
    SubDepartment.findOne({name})
        .then(dep=>{
            if(dep){
                if(dep.category == category && dep.name == name) {
                    return res.status(400).json({message:'Sub-Category name already exists'});
                }
            } else{
                SubDepartment.findByIdAndUpdate(req.params.id)
                .then(subDepartment=>{
                    subDepartment.description=req.body.description
        
                    subDepartment.save()
                        .then(()=>res.status(200).json({message:"SUbDepartment update successfully"}))
                        .catch(next)
                })
            }
        })
})

router.delete('/:id',auth,async(req,res)=>{
    const product=await Product.find();
    const productFilter=product.filter(prd=>prd.subCategory == req.params.id)

    const type=await Type.find();
    const typeFilter=type.filter(a=>a.typeDetails.filter(b=>b.subCategory.filter(c=>c._id==req.params.id)))
    
    if(typeFilter.length>0){
        typeFilter.map(data=>{
            const id=data._id
            const typeDetails=[]
            const subCategory=[]
            data.typeDetails.map(data2=>{
                data2.subCategory.filter(data3=>{
                    if(data2.subCategory.includes(req.params.id)){
                        if(data3 != req.params.id){
                            subCategory.push(data3)
                        }
                    }
                })
                if(!data2.subCategory.includes(req.params.id)){
                    typeDetails.push({
                        category:data2.category,
                        subCategory:data2.subCategory
                    })
                }else{
                    if(data2.subCategory.length>1){
                        typeDetails.push({
                            category:data2.category,
                            subCategory
                        })
                    }
                }
            })
            if(typeDetails.length>0){
                Type.findByIdAndUpdate(id)
                    .then(data4=>{
                        data4.typeDetails=typeDetails
            
                        data4.save()
                    })
            }else{
                Type.findByIdAndDelete(id)
                    .then(data5=>{
                        data5.remove()
                    })
            }
        })
    }

    Product.remove({subCategory:req.params.id},function(err,results){

    })
    // if(productFilter.length > 0){
    //     productFilter.map(data=>{
    //         Product.deleteOne({_id:data._id},function(err,results){
    //         });
    //     })
    // }
    SubDepartment.findByIdAndDelete(req.params.id)
        .then(subDepartment=>
            subDepartment.remove()
            .then(()=>res.status(204).json({message:"SubDepartment delete successfully"}))
            .catch(err=>res.status(404).json({message:err}))
        )
        .catch(err=>res.status(404).json({message:err}))
})

router.get('/:id',auth,(req,res)=>{
    SubDepartment.findById(req.params.id)
        .populate('category','_id name')
        .then(subDepartment=>res.status(200).json(subDepartment))
        .catch(err=>res.status(404).json({message:err}))
})

router.post('/bulk',uploads.single('csv'),auth,async(req,res)=>{
    var report={
        success:[],
        error:[]
    }
    const base_url="http://localhost:5000/"

    const subDepartment=await SubDepartment.find();
    const department=await Department.find()
    if(req.file.fieldname === 'csv'){
        const csv1=await csv().fromFile(req.file.path)
            csv1.map(async(subCat)=>{
                const check = subDepartment.filter(a=>a.name.toLowerCase().trim() ===subCat.name.toLowerCase().trim())
                const checkCat=department.filter(a=>a.name.toLowerCase().trim() == subCat.category.toLowerCase().trim())
                const nameCheck=report.success.some(a=>a.name.toLowerCase().trim() ==subCat.name.toLowerCase().trim())
                
                if(subCat.name && subCat.description && subCat.category){
                    if(check.length>0 || nameCheck){
                        if(checkCat.length===0){
                            report.error.push(
                                {
                                    name:subCat.name,
                                    category:subCat.category,
                                    description:subCat.description,
                                    status:"Failed",
                                    message:`Category not exist.`
                                }
                            )
                        }else{
                            report.error.push(
                                {
                                    name:subCat.name,
                                    category:subCat.category,
                                    description:subCat.description,
                                    status:"Failed",
                                    message:`${subCat.name} is already exist.`
                                }
                            )
                        }
                    }else{
                        if(checkCat.length == 0){
                            report.error.push(
                                {
                                    name:subCat.name,
                                    category:subCat.category,
                                    description:subCat.description,
                                    status:"Failed",
                                    message:`Category not exist.`
                                }
                            )
                        }else{
                            const subDepartmentData=new SubDepartment({
                                name:subCat.name,
                                category:checkCat[0]._id,
                                description:subCat.description
                            })
            
                            subDepartmentData.save()
                            report.success.push(
                                {
                                    name:subCat.name,
                                    category:subCat.category,
                                    description:subCat.description,
                                    status:"Success",
                                    message:`${subCat.name} is successfully added.`
                                }
                            )
                        }
                    }
                }else{
                    const name=subCat.name ? '' :'name'
                    const category=subCat.category ? '' : 'category'
                    const description=subCat.description ? '':'description'
                    const both=(subCat.name || subCat.category || subCat.description) ? '' : 'name , category and description'
                    report.error.push(
                        {
                            name:subCat.name,
                            category:subCat.category,
                            description:subCat.description,
                            status:"Failed",
                            message:`${both || category || description || name} is required`
                        }
                    )
                }
            })
            const data=report.success.concat(report.error)
            const objectToCSV=function(data){
                const csvRows=[]
                const headers=Object.keys(data[0]);
                csvRows.push(headers.join(','));
                for(const row of data){
                    const values=headers.map(header=>{
                        const escaped=(row[header].toString()).replace(/"/g, '\\"');
                        return `"${escaped}"`
                    })
                    csvRows.push(values.join(','));
                }
                return csvRows.join('\n')
            }
            const csvData=objectToCSV(data)
            fs.writeFileSync(`./uploads/subCategory/report/${req.file.filename}`,csvData)
            const subDepartmentReportData=new SubDepartmentReport({
                fileName:req.file.filename,
                file:base_url+`uploads/subCategory/report/${req.file.filename}`
            })
            subDepartmentReportData.save()
                .then(()=>res.status(201).json({message:"Successful"}))
                .catch((err)=>res.status(400).json({error:err}))
            // res.status(201).json({report})
    }else{
        return res.status(400).json({message:"Only csv file is required."})
    }
})

router.post('/deleteBulk',auth,async(req,res)=>{
    const {deleteData}=req.body

    if(deleteData.length>0){
        let subDepartment=true
        let product=true
        let typeFlag=true

        SubDepartment.deleteMany({_id:deleteData},function(err,results){
            if(err!==null){
                subDepartment=false
            }
        })
        Product.deleteMany({subDepartment:deleteData},function(err,results){
            if(err!==null){
                product=false
            }
        })

        // deleteData.map(delData=>{

        // })

        if(subDepartment && product){
            return res.status(201).json({message:"Successfully"})
        }else{
            return res.status(400).json({message:"Error"})
        }
    }
})

module.exports=router;