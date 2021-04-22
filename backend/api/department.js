const c = require('config');
const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');
const paginatedResults=require('../middleware/paginatedResults');

const Department=require('../models/Department');
const Product = require('../models/Product');
const SubDepartment = require('../models/SubDepartment');
const Type = require('../models/Type');
const DepartmentReport=require('../models/DepartmentReport');
const multer=require('multer');
const csv=require('csvtojson');
const fs = require('fs');
const Brand = require('../models/Brand');

const storage = multer.diskStorage({  
    destination:(req,file,cb)=>{  
        cb(null,'./uploads/category');  
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
    Department.find({name:new RegExp(search,"i")})
        .skip(perPage * page)
        .limit(perPage)
        .sort({createdAt:-1})
        .then(department=>{
            Department.countDocuments().then(count=>{
                return res.status(200).json({
                    totalCount:count,
                    currentCount:department.length,
                    department
                })
            })
        })
})

router.post('/',auth,(req,res,next)=>{
    const {name,description}=req.body;

    // if(!name,!description){
    //     return res.status(400).json({message:'Please enter all details'});
    // }

    Department.findOne({name})
        .then(department=>{
            if(department) {
                return res.status(400).json({message:'Department name already exists'});
            } else{
                const departentAdd=new Department({name,description});
                departentAdd.save()
                    .then(()=>res.status(201).json({message:'Department added successfully'}))
                    .catch(err=>console.log(err.keyValue.name));
            }
        })
})

router.patch('/:id',auth,(req,res,next)=>{
    const {name,description}=req.body
    Department.findOne({name})
        .then(dep=>{
            if(dep){
                if(dep.name == name){
                    return res.status(400).json({message:'Department name already exists'});
                }                
            }else{
                Department.findByIdAndUpdate(req.params.id)
                .then(department=>{
                    department.description=description
        
                    department.save()
                        .then(()=>res.status(200).json({message:"Department update successfully"}))
                        .catch(next)
                })
            }
        })
})

router.put('/:id',auth,(req,res,next)=>{
    const {name}=req.body
    Department.findOne({name})
        .then(dep=>{
            if(dep){
                return res.status(400).json({message:'Department name already exists'});
            }else{
                Department.findByIdAndUpdate(req.params.id)
                .then(department=>{
                    department.description=req.body.description
        
                    department.save()
                        .then(()=>res.status(200).json({message:"Department update successfully"}))
                        .catch(next)
                })
            }
        })
})

router.delete('/:id',auth,async(req,res)=>{
    const type=await Type.find({"typeDetails.category":req.params.id});
    const brand = await Brand.find({"brandCategory":req.params.id});

    // brand.filter(async(data)=>{
    //     const brandCategory=[]
    //     data.brandCategory.filter(data2=>{
    //         if(data2!=req.params.id){
    //             brandCategory.push(data2)
    //         }
    //     })
    //     if(brandCategory.length>0){
    //         Brand.updateOne({_id:data._id},{$set:{brandCategory:brandCategory}},function(){
                
    //         })
    //     }
    //     else{
    //         Brand.remove({_id:data._id},function(){

    //         })
    //     }
    // })

    // type.filter(data=>{
    //     const typeDetails=[]
    //     const id=data._id
    //     data.typeDetails.map(data2=>{
    //         if(data2.category != req.params.id){
    //             typeDetails.push(data2)
    //         }
    //     })
    //     if(typeDetails.length>0){
    //         Type.updateOne({_id:id},{$set:{typeDetails:typeDetails}},function(){
                            
    //         })
    //     }else{
    //         Type.remove({_id:id},function(err,results){

    //         })
    //     }
    // })
    SubDepartment.remove({category:req.params.id},function(err,results){

    })
    Product.remove({category:req.params.id},function(err,results){

    })
    Department.findByIdAndDelete(req.params.id)
        .then(department=>
            department.remove()
            .then(()=>res.status(204).json({message:"Department delete successfully"}))
            .catch(err=>res.status(404).json({message:err}))
        )
        .catch(err=>res.status(404).json({message:err}))
})

router.get('/:id',auth,(req,res)=>{
    Department.findById(req.params.id)
        .then(department=>res.status(200).json(department))
        .catch(err=>res.status(404).json({message:err}))
})

router.post('/bulk',uploads.single('csv'),auth,async(req,res)=>{
    var report={
        success:[],
        error:[]
    }
    const base_url="http://localhost:5000/"

    const department=await Department.find();
    if(req.file.fieldname === 'csv'){
        const csv1=await csv().fromFile(req.file.path)
            csv1.map(async(cat)=>{
                const check = department.filter(a=>a.name.toLowerCase().trim()===cat.name.toLowerCase().trim())
                const reportCheck= report.success.filter(a=>a.name.toLowerCase().trim() === cat.name.toLowerCase().trim())
                
                if(cat.name && cat.description){
                    if(check.length>0 || reportCheck.length>0){
                        report.error.push(
                            {
                                name:cat.name,
                                description:cat.description,
                                status:"Failed",
                                message:`${cat.name} is already exist.`
                            }
                        )
                    }else{
                        const departmentData=new Department({
                            name:cat.name,
                            description:cat.description
                        })
        
                        departmentData.save()
                        report.success.push(
                            {
                                name:cat.name,
                                description:cat.description,
                                status:"Success",
                                message:`${cat.name} is successfully added.`
                            }
                        )
                    }
                }else{
                    const name=cat.name ? '' :'name'
                    const description=cat.description ? '':'description'
                    const both=(cat.name || cat.description) ? '' : 'name and description'
                    report.error.push(
                        {
                            name:cat.name,
                            description:cat.description,
                            status:"Failed",
                            message:`${both || description || name} is required`
                        }
                    )
                }
            })
            const catReport=report.success.concat(report.error)
            const objectToCSV=function(catReport){
                const csvRows=[]
                const headers=Object.keys(catReport[0]);
                csvRows.push(headers.join(','));
                for(const row of catReport){
                    const values=headers.map(header=>{
                        const escaped=(row[header].toString()).replace(/"/g, '\\"');
                        return `"${escaped}"`
                    })
                    csvRows.push(values.join(';'));
                }
                return csvRows.join('\n')
            }
            const csvData=objectToCSV(catReport)
            fs.writeFileSync(`./uploads/category/report/${req.file.filename}`,csvData)
            const departmentReportData=new DepartmentReport({
                fileName:req.file.filename,
                file:base_url+`uploads/category/report/${req.file.filename}`
            })
            departmentReportData.save()
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
        let department=true
        let product=true

        Product.deleteMany({category:deleteData},function(err,results){
            if(err!==null){
                product=false
            }
        })
        Department.deleteMany({_id:deleteData},function(err,results){
            if(err!==null){
                department=false
            }
        })
        SubDepartment.deleteMany({category:deleteData},function(err,results){
            if(err!==null){
                subDepartment=false
            }
        })

        if(subDepartment && department && product){
            return res.status(201).json({message:"Successfully"})
        }else{
            return res.status(400).json({message:"Error"})
        }
    }
})

module.exports=router;