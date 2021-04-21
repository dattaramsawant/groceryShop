const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');

const Type=require('../models/Type');

router.get('/',auth,(req,res)=>{
    const perPage=parseInt(req.query.limit)
    const page=parseInt(req.query.page)
    const search=req.query.name;

    Type.find({name:new RegExp(search,"i")})
        .skip(perPage * page)
        .limit(perPage)
        .populate([
            {path:'typeDetails',populate:[{path:'category',select:'_id name'},{path:'subCategory',select:'_id name'}]} 
        ])
        .sort({createdAt:-1})
        .then(typeData=>{
            const type=[]
            const id=[]
            typeData.map(data=>{
                const typeDetails=[]
                data.typeDetails.map(data2=>{
                    if(data2.category != null && data2.subCategory.length>0){
                        typeDetails.push({
                            _id:data2._id,
                            subCategory:data2.subCategory,
                            category:data2.category
                        })
                    }
                })
                if(typeDetails.length>0){
                    type.push({
                        _id:data._id,
                        name:data.name,
                        typeDetails
                    })
                }else{
                    id.push(data._id)
                }
            })
            if(type.length>0){
                Type.countDocuments().then(count=>{
                    return res.status(200).json({
                        totalCount:count,
                        currentCount:type.length,
                        type
                    })
                })
            }else{
                Type.deleteMany({_id:id})
                    .then(()=>{
                        Type.countDocuments().then(count=>{
                            return res.status(200).json({
                                totalCount:count,
                                currentCount:type.length,
                                type
                            })
                        })
                    })
            }
            
        })
})

router.post('/',auth,(req,res,next)=>{
    const {name,typeDetails}=req.body;

    Type.findOne({name})
        .then(type=>{
            if(type){
                return res.status(400).json({message:"Type name already exist"})
            }else{
                const typeData=new Type({
                    name,typeDetails
                })

                typeData.save()
                    .then(()=>res.status(201).json({message:"Type add successfully"}))
                    .catch(next);
            }
        })
})

router.patch('/:id',auth,(req,res)=>{
    const {name,typeDetails}=req.body

    Type.findByIdAndUpdate(req.params.id)
        .then(data=>{
            data.typeDetails=typeDetails

            data.save()
                .then(()=>res.status(200).json({message:"Type update successfully"}))
                .catch(err=>res.status(400).json({error:err}))
        })
})

router.put('/:id',auth,(req,res)=>{
    const {name,typeDetails}=req.body

    Type.findByIdAndUpdate(req.params.id)
        .then(data=>{
            data.typeDetails=typeDetails

            data.save()
                .then(()=>res.status(200).json({message:"Type update successfully"}))
                .catch(err=>res.status(400).json({error:err}))
        })
})

router.get('/:id',auth,(req,res)=>{
    Type.findById(req.params.id)
        .populate([
            {path:'typeDetails',populate:[{path:'category',select:'_id name'},{path:'subCategory',select:'_id name'}]} 
        ])
        .then(type=>{
            Type.countDocuments().then(count=>{
                return res.status(200).json({
                    totalCount:count,
                    currentCount:1,
                    type
                })
            })
        })
})

router.delete('/:id',auth,(req,res)=>{
    Type.findByIdAndDelete(req.params.id)
        .then(type=>
            type.remove()
                .then(()=>res.status(204).json({message:'Type Delete Successfully'}))    
                .catch(err=>res.status(400).json({message:err}))
        )
        .catch(err=>res.status(400).json({message:err}))
})

module.exports=router;