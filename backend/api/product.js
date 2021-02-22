const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');

const multer=require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/productImg/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' ||file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/svg' || file.mimetype === 'image/svg+xml') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2
  },
  fileFilter: fileFilter
});

const Product=require('../models/Product');

router.get('/',(req,res)=>{
  const perPage=parseInt(req.query.limit)
  const page=parseInt(req.query.page)
  const search=req.query.name;
  
  Product.find({name:new RegExp(search,"i")})
      .skip(perPage * page)
      .limit(perPage)
      .populate([
        {path:'category',select:'_id name'},
        {path:'subCategory',select:'_id name'},
        {path:'brandName',select:'_id brandName brandCategory',populate:{path:'brandCategory',select:'_id name'}}
      ])
      .sort({createdAt:-1})
      .then(product=>{
        Product.countDocuments().then(count=>{
            return res.status(200).json({
                totalCount:count,
                currentCount:product.length,
                product
            })
        })
    })
})

router.post('/',auth,upload.array('productImg'),(req,res)=>{
    const {brandName,otherWeight,name,category,subCategory,price,description,quantity,available,weight,measurement,offer,offerValue,productCode}=req.body
    const base_url="http://localhost:5000/"
    
    // if(!brandName,!name,!category,!otherWeight,!subCategory,!price,!description,!quantity,!available,!weight,!measurement){
    //     return res.status(404).json({message:"All fields are required"})
    // }
    const product=new Product({
        brandName,name,category,subCategory,price,description,quantity,available,weight,measurement,offer,offerValue,productCode,
        otherWeight,
        productImg:req.files.map(img=>base_url+img.path)
    })
    product.save()
        .then(()=>res.status(201).json({message:"Product added successfully"}))
        .catch((error)=>res.status(422).json({error:error}))
})

router.patch('/:id',auth,upload.array('productImg'),(req,res)=>{
  const base_url="http://localhost:5000/"
  console.log(req.files,req.body)
  Product.findByIdAndUpdate(req.params.id)
    .then(product=>{
      product.name=req.body.name,
      product.category=req.body.category,
      product.subCategory=req.body.subCategory,
      product.price=req.body.price,
      product.description=req.body.description,
      product.quantity=req.body.quantity,
      product.available=req.body.available,
      product.weight=req.body.weight,
      product.measurement=req.body.measurement,
      product.offer=req.body.offer,
      product.offerValue=req.body.offer ? req.body.offerValue : '',
      product.otherWeight=req.body.otherWeight
      req.files.map(img=>{
        if(img.path!==undefined){
          product.productImg=req.files.map(img=>base_url+img.path)
        }
      })

      product.save()
        .then(()=>res.status(200).json({message:"Product updated successfully"}))
    })
})

router.put('/:id',auth,upload.array('productImg'),(req,res)=>{
  console.log(req.body.offer ? req.body.offerValue:'',req.body.offer)
  const base_url="http://localhost:5000/"
  Product.findByIdAndUpdate(req.params.id)
    .then(product=>{
      product.name=req.body.name,
      product.category=req.body.category,
      product.subCategory=req.body.subCategory,
      product.price=req.body.price,
      product.description=req.body.description,
      product.quantity=req.body.quantity,
      product.available=req.body.available,
      product.weight=req.body.weight,
      product.measurement=req.body.measurement,
      product.offer=req.body.offer,
      product.offerValue=req.body.offer ? req.body.offerValue : '',
      product.otherWeight=req.body.otherWeight
      req.files.map(img=>{
        if(img.path!==undefined){
          product.productImg=req.files.map(img=>base_url+img.path)
        }
      })

      product.save()
        .then(()=>res.status(200).json({message:"Product updated successfully"}))
        .catch((error)=>res.status(422).json({error}))
    })
})

router.delete('/:id',auth,(req,res)=>{
  Product.findByIdAndDelete(req.params.id)
    .then(product=>
      product.remove()
      .then(()=>res.status(204).json({message:"Product deleted successfully"}))  
      .catch(err=>res.status(404).json({message:err}))
    )
    .catch(err=>res.status(404).json({message:err}))
})

router.get('/:id',(req,res)=>{
  Product.findById(req.params.id)
      .populate([
        {path:'category',select:'_id name'},
        {path:'subCategory',select:'_id name'},
        {path:'brandName',select:'_id brandName brandCategory',populate:{path:'brandCategory',select:'_id name'}}
      ])
      .then(product=>res.status(200).json(product))
      .catch(err=>res.status(404).json({message:err}))
})

module.exports=router;