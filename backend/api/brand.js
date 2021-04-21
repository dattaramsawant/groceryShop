const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');

const Brand=require('../models/Brand');
const Product = require('../models/Product');
const multer=require('multer');
const csv=require('csvtojson');
const fs = require('fs');
const Department = require('../models/Department');
const BrandReport = require('../models/BrandReport');

const storage = multer.diskStorage({  
    destination:(req,file,cb)=>{  
        cb(null,'./uploads/brand');  
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
    const search=req.query.brandName;
    Brand.find({brandName:new RegExp(search,"i")})
        .skip(perPage * page)
        .limit(perPage)
        .populate('brandCategory','_id name')
        .sort({createdAt:-1})
        .then(brandData=>{
            const brand=[]
            const id=[]
            brandData.map(data=>{
                if(data.brandCategory.length>0){
                    brand.push(data)
                }else{
                    id.push(data._id)
                }
            })
            if(brand.length>0){
                Brand.countDocuments().then(count=>{
                    return res.status(200).json({
                        totalCount:count,
                        currentCount:brand.length,
                        brand
                    })
                })
            }else{
                Brand.deleteMany({_id:id})
                    .then(()=>{
                        Brand.countDocuments().then(count=>{
                            return res.status(200).json({
                                totalCount:count,
                                currentCount:brand.length,
                                brand
                            })
                        })
                    })
            }            
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
                const brandAdd=new Brand({
                    brandName,brandCategory
                });
                brandAdd.save()
                    .then(()=>res.status(201).json({message:'Brand added successfully'}))
                    .catch(next);
            }
        })
})

router.patch('/:id',auth,(req,res,next)=>{
    const {brandName,brandCategory}=req.body
    const base_url="http://localhost:5000/"

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

router.post('/bulk',uploads.single('csv'),auth,async(req,res)=>{
    var report={
        success:[],
        error:[]
    }
    const base_url="http://localhost:5000/"

    const brand=await Brand.find();
    const department=await Department.find();

    if(req.file.fieldname === 'csv'){
        const csv1=await csv().fromFile(req.file.path)
            csv1.map(async(data)=>{
                const categoryArr=data.brandCategory.split(';');
                const checkCat=[]
                const checkCatString=[]
                categoryArr.filter(cat=>{
                    department.filter(dep=>{
                        if(dep.name.toLowerCase().trim() == cat.toLowerCase().trim()){
                            checkCat.push(dep._id)
                            checkCatString.push(dep.name)
                        }
                    })
                })
                const check = brand.filter(a=>a.brandName.toLowerCase().trim()===data.brandName.toLowerCase().trim())
                const reportCheck= report.success.filter(a=>a.brandName.toLowerCase().trim() === data.brandName.toLowerCase().trim())
                
                if(data.brandName && data.brandCategory){
                    if(check.length>0 || reportCheck.length>0){
                        if(checkCat.length==0){
                            report.error.push({
                                brandName:data.brandName,
                                brandCategory:data.brandCategory,
                                status:"Failed",
                                message:`Category not exist.`
                            })
                        }else{
                            report.error.push(
                                {
                                    brandName:data.brandName,
                                    brandCategory:data.brandCategory,
                                    status:"Failed",
                                    message:`${data.brandName} is already exist.`
                                }
                            )
                        }
                    }else{
                        if(checkCat.length==0){
                            report.error.push({
                                brandName:data.brandName,
                                brandCategory:data.brandCategory,
                                status:"Failed",
                                message:`Category not exist.`
                            })
                        }else{
                            const brandData=new Brand({
                                brandName:data.brandName,
                                brandCategory:checkCat
                            })
                            brandData.save()
                            report.success.push(
                                {
                                    brandName:data.brandName,
                                    brandCategory:checkCatString,
                                    status:"Success",
                                    message:`${data.brandName} is successfully added.`
                                }
                            )
                        }
                    }
                }else{
                    const brandName=data.brandName ? '' :'brandName'
                    const brandCategory=data.brandCategory ? '' : 'brandCategory'
                    const both=(data.brandName || data.brandCategory) ? '' : 'brandName and brandCategory'
                    report.error.push(
                        {
                            brandName:data.brandName,
                            brandCategory:data.brandCategory,
                            status:"Failed",
                            message:`${both || brandCategory || brandName} is required`
                        }
                    )
                }
            })
            const reportData=report.success.concat(report.error)
            const objectToCSV=function(reportData){
                const csvRows=[]
                const headers=Object.keys(reportData[0]);
                csvRows.push(headers.join(','));
                for(const row of reportData){
                    const values=headers.map(header=>{
                        const escaped=(row[header].toString()).replace(/"/g, '\\"');
                        return `"${escaped}"`
                    })
                    csvRows.push(values.join(','));
                }
                return csvRows.join('\n')
            }
            const csvData=objectToCSV(reportData)
            fs.writeFileSync(`./uploads/brand/report/${req.file.filename}`,csvData)
            const brandReportData=new BrandReport({
                fileName:req.file.filename,
                file:base_url+`uploads/brand/report/${req.file.filename}`
            })
            brandReportData.save()
                .then(()=>res.status(201).json({message:"Successful"}))
                .catch((err)=>res.status(400).json({error:err}))
            // res.status(201).json({report})
            
    }else{
        return res.status(400).json({message:"Only csv file is required."})
    }
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