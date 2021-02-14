const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');

const Product=require('../models/Product');
const ProductImg = require('../models/ProductImg');

const multer=require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/productImg/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
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
});

router.post('/',auth,upload.array('productImg'),async(req,res)=>{
    var report={
        error:[],
        success:[]
    }

    const baseurl="http://localhost:5000/"
    const productData=await Product.find();

    const uploadImages=req.files;
    await uploadImages.map(async(image)=>{
        const imageName=image.originalname.split('.');
        const firstName=imageName[0];
        const firstNameSplit=firstName.split('_');
        const productCode=firstNameSplit[0];
        const checkProductCode=productData.filter(product=>product.productCode.toLowerCase() === productCode.toLowerCase())
        if(checkProductCode.length == 0){
            report.error.push(image.originalname)
        }else{
            Product.updateOne({productCode:productCode},{$addToSet:{productImg:baseurl+image.path}},function(){})
            const productImgs=new ProductImg({
                name:image.originalname,
                productImg:baseurl+image.path
            })
            report.success.push(image.originalname)
            productImgs.save()
        }
    })
    res.status(201).json(report)
})

module.exports=router;