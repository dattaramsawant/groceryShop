const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ProductImgSchema=new Schema({
    name:{
        type:String
    },
    productImg:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

module.exports=ProductImg=mongoose.model('ProductImg',ProductImgSchema);