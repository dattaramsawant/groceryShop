const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');

const Brand=require('../models/Brand');
const Product = require('../models/Product');

router.get('/',auth,(req,res)=>{
    const perPage=parseInt(req.query.limit)
    const page=parseInt(req.query.page)
    const search=req.query.brandName;
    Brand.find({brandName:new RegExp(search,"i")})
        .skip(perPage * page)
        .limit(perPage)
        .populate('brandCategory','_id name')
        .sort({createdAt:-1})
        .then(brand=>{
            Brand.countDocuments().then(count=>{
                return res.status(200).json({
                    totalCount:count,
                    currentCount:brand.length,
                    brand
                })
            })
        })
})

router.post('/',auth,(req,res,next)=>{
    const {brandName,brandCategory}=req.body;

    // if(!name,!description){
    //     return res.status(400).json({message:'Please enter all details'});
    // }

    Brand.findOne({brandName})
        .then(brand=>{
            if(brand) {
                return res.status(400).json({message:'Brand Name name already exists'});
            } else{
                const brandAdd=new Brand({brandName,brandCategory});
                brandAdd.save()
                    .then(()=>res.status(201).json({message:'Brand added successfully'}))
                    .catch(next);
            }
        })
})

router.patch('/:id',auth,(req,res,next)=>{
    const {brandName,brandCategory}=req.body

    Brand.findByIdAndUpdate(req.params.id)
    .then(brd=>{
        brd.brandCategory=brandCategory

        brd.save()
            .then(()=>res.status(200).json({message:"Brand update successfully"}))
            .catch(next)
    })
})

router.put('/:id',auth,(req,res,next)=>{
    const {brandName,brandCategory}=req.body

    Brand.findByIdAndUpdate(req.params.id)
    .then(brd=>{
        brd.brandCategory=brandCategory

        brd.save()
            .then(()=>res.status(200).json({message:"Brand update successfully"}))
            .catch(next)
    })
})

router.delete('/:id',auth,async(req,res)=>{
    const product=await Product.find();
    const productFilter=product.filter(prd=>prd.brandName == req.params.id)
    
    if(productFilter.length > 0){
        productFilter.map(data=>{
            Product.deleteOne({_id:data._id},function(err,results){
            });
        })
    }

    Brand.findByIdAndDelete(req.params.id)
        .then(brand=>
            brand.remove()
            .then(()=>res.status(204).json({message:"Brand delete successfully"}))
            .catch(err=>res.status(404).json({message:err}))
        )
        .catch(err=>res.status(404).json({message:err}))
})

router.get('/:id',auth,(req,res)=>{
    Brand.findById(req.params.id)
        .populate('brandCategory','_id name')
        .then(brand=>res.status(200).json(brand))
        .catch(err=>res.status(404).json({message:err}))
})

module.exports=router;