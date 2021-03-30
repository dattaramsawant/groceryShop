const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');

const Brand=require('../models/Brand');
const Product = require('../models/Product');

const multer=require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/brandLogo/');
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
//   limits: {
//     fileSize: 1024 * 1024 * 2
//   }
//   fileFilter: fileFilter
});

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

router.post('/',auth,upload.single('brandLogo'),(req,res,next)=>{
    const {brandName,brandCategory}=req.body;
    const base_url="http://localhost:5000/"
    console.log(req.file.path)

    // if(!name,!description){
    //     return res.status(400).json({message:'Please enter all details'});
    // }

    Brand.findOne({brandName})
        .then(brand=>{
            if(brand) {
                return res.status(400).json({message:'Brand Name name already exists'});
            } else{
                const brandAdd=new Brand({
                    brandName,brandCategory,
                    brandLogo:base_url + req.file.path
                });
                brandAdd.save()
                    .then(()=>res.status(201).json({message:'Brand added successfully'}))
                    .catch(next);
            }
        })
})

router.patch('/:id',upload.single('brandLogo'),auth,(req,res,next)=>{
    const {brandName,brandCategory}=req.body
    const base_url="http://localhost:5000/"

    Brand.findByIdAndUpdate(req.params.id)
    .then(brd=>{
        brd.brandCategory=brandCategory
        brd.brandLogo=req.file && base_url + req.file.path

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


/**
* @swagger
* /brand:
*   get:
*     tags:
*       - Brand
*     name: Read Brand
*     summary: To read Brand with pagination
*     parameters:
*     - name: "brandName"
*       in: "query"
*       description: "search your keyword"
*       type: "string"
*     - name: "page"
*       in: "query"
*       description: "Pagination starting point"
*       type: "string"
*     - name: "limit"
*       in: "query"
*       description: "Pagination ending point"
*       type: "string"
*     security:
*       - bearerAuth: [] 
*     consumes:
*       - application/json
*     responses:
*       200:
*         description: Data found 
*       404:
*         description: Data not found
*   post:
*     tags:
*       - Brand
*     summary: To add Brand
*     security:
*       - bearerAuth: []
*     consumes:
*       - multipart/form-data
*     parameters:
*       - name: brandName
*         in: formData
*         type: string
*         required: true
*       - name: brandCategory
*         in: formData
*         type: string
*         required: true
*       - name: brandLogo
*         in: formData
*         type: file
*         required: false
*     responses:
*       201:
*         description: Brand created
*       422:
*         description: Brand not created
* /brand/{_id}:
*   patch:
*     tags:
*       - Brand
*     summary: To Update Brand
*     security:
*       - bearerAuth: []
*     consumes:
*       - multipart/form-data
*     parameters:
*       - name: "_id"
*         in: "path"
*         description: "Id of Brand to update"
*         required: true
*         type: "string"
*       - name: brandName
*         in: formData
*         type: string
*         required: true
*       - name: brandCategory
*         in: formData
*         type: string
*         required: true
*       - name: brandLogo
*         in: formData
*         type: file
*         required: false
*     responses:
*      200:
*        description: Brand updated
*      404:
*        description: Brand you are updating does not exit
*   put:
*     tags:
*       - Brand
*     summary: To Update Brand
*     security:
*       - bearerAuth: []
*     consumes:
*       - multipart/form-data
*     parameters:
*       - name: "_id"
*         in: "path"
*         description: "Id of Brand to update"
*         required: true
*         type: "string"
*       - name: brandName
*         in: formData
*         type: string
*         required: true
*       - name: brandCategory
*         in: formData
*         type: string
*         required: true
*       - name: brandLogo
*         in: formData
*         type: file
*         required: false
*     responses:
*      200:
*        description: Brand updated
*      404:
*        description: Brand you are updating does not exit
*   delete:
*     tags:
*       - Brand
*     summary: To Delete Brand
*     security:
*       - bearerAuth: []
*     consumes::
*       - application/json
*     parameters:
*       - name: "_id"
*         in: "path"
*         description: Id of brand to delete
*         required: true
*         type: string
*     responses:
*       200:
*         description: Brand deleted. 
*       404:    
*         description: The Brand does not exit.
*/