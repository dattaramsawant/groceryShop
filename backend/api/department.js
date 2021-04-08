const c = require('config');
const express=require('express');
const { isValidObjectId } = require('mongoose');
const router=express.Router();
const auth=require('../middleware/auth');
const paginatedResults=require('../middleware/paginatedResults');

const Department=require('../models/Department');
const Product = require('../models/Product');
const SubDepartment = require('../models/SubDepartment');
const multer=require('multer');
const csv=require('csvtojson');

const storage = multer.diskStorage({  
    destination:(req,file,cb)=>{  
        cb(null,'./uploads/category');  
    },  
    filename:(req,file,cb)=>{  
        cb(null,file.originalname + new Date().toISOString());  
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
    const subDepartment =await SubDepartment.find();
    const subDepartmentFilter=subDepartment.filter(subCat=>subCat.category == req.params.id)

    const product=await Product.find();
    const productFilter=product.filter(prd=>prd.category == req.params.id)
    
    if(productFilter.length > 0){
        productFilter.map(data=>{
            Product.deleteOne({_id:data._id},function(err,results){

            });
        })
    }
    if(subDepartmentFilter.length > 0){
        subDepartmentFilter.map(data=>{
            SubDepartment.deleteOne({_id:data._id},function(err,results){

            });
        })
    }
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

    const department=await Department.find();
    if(req.file.fieldname === 'csv'){
        const csv1=await csv().fromFile(req.file.path)
            csv1.map(async(cat)=>{
                const check = department.filter(a=>a.name.toLowerCase()===cat.name.toLowerCase())
                if(cat.name && cat.description){
                    if(check.length>0){
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
                    const both=(cat.name || cat.description) ? '' : 'name and edescription'
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
            res.status(201).json({report})
    }else{
        return res.status(400).json({message:"Only csv file is required."})
    }
})

module.exports=router;