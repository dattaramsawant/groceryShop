const c = require('config');
const express=require('express');
const { isValidObjectId } = require('mongoose');
const router=express.Router();
const auth=require('../middleware/auth');
const paginatedResults=require('../middleware/paginatedResults');

const Department=require('../models/Department');
const Product = require('../models/Product');
const SubDepartment = require('../models/SubDepartment');

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
                    .catch(next);
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

module.exports=router;