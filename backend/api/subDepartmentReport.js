const express=require("express");
const router=express.Router();
const auth=require('../middleware/auth');

const SubDepartmentReport=require('../models/SubDepartmentReport');

router.get('/',auth,(req,res)=>{
    const perPage=parseInt(req.query.limit)
    const page=parseInt(req.query.page)
    const search=req.query.name;
    SubDepartmentReport.find({fileName:new RegExp(search,"i")})
        .skip(perPage * page)
        .limit(perPage)
        .sort({createdAt:-1})
        .then(subDepartmentReport=>{
            SubDepartmentReport.countDocuments().then(count=>{
                return res.status(200).json({
                    totalCount:count,
                    currentCount:subDepartmentReport.length,
                    subDepartmentReport
                })
            })
        })
})

router.delete('/:id',auth,async(req,res)=>{
    SubDepartmentReport.findByIdAndDelete(req.params.id)
        .then(subDepartmentReport=>{
            subDepartmentReport.remove()
                .then(()=>res.status(204).json({message:"Sub-Department Report delete successfully"}))
                .catch(err=>res.status(404).json({message:err}))
        })
        .catch(err=>res.status(404).json({error:err}))
})

router.post('/deleteBulk',auth,(req,res)=>{
    const {deleteData}=req.body

    if(deleteData.length>0){
        SubDepartmentReport.deleteMany({_id:deleteData},function(err,results){
            if(err){
                return res.status(400).json({error:err})
            }else{
                return res.status(201).json({message:"Successful"})
            }
       }) 
    }
})

module.exports=router;