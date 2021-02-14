const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const SubDepartmentSchema=new Schema({
    name:{
        type:String,
        required:[true,'Name is Required'],
        trim:true
    },
    description:{
        type:String,
        required:[true,'Description is Required'],
        trim:true
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:'Department',
        required:[true,'Category Name is Required']
    }
},{
    timestamps:true
})

module.exports=Department=mongoose.model('SubDepartment',SubDepartmentSchema)