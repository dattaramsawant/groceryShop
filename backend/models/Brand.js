const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const BrandSchema=new Schema({
    brandName:{
        type:String,
        required:[true,"Brand Name is Required"],
        trim:true
    },
    brandCategory:[{
        type:Schema.Types.ObjectId,
        ref:'Department',
        require:[true,"Brand Category is Required"]
    }]
},{
    timestamps:true
})

module.exports=Brand=mongoose.model('Brand',BrandSchema)