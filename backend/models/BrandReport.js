const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const BrandReportSchema=new Schema({
    fileName:{
        type:String
    },
    file:{
        type:String,
        require:[true,"File is Required"]
    }
},{
    timestamps:true
})

module.exports=BrandReport=mongoose.model('BrandReport',BrandReportSchema)