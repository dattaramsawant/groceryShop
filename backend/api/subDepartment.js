const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');
const paginatedResults=require('../middleware/paginatedResults');

const SubDepartment=require('../models/SubDepartment');
const Product = require('../models/Product');

router.get('/',auth,(req,res)=>{
    const perPage=parseInt(req.query.limit)
    const page=parseInt(req.query.page)
    const search=req.query.name;
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
    
    if(productFilter.length > 0){
        productFilter.map(data=>{
            Product.deleteOne({_id:data._id},function(err,results){
            });
        })
    }
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

module.exports=router;