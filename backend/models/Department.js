const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const DepartmentSchema=new Schema({
    name:{
        type:String,
        required:[true,'Name is Required'],
        trim:true
    },
    description:{
        type:String,
        required:[true,'Description is Required'],
        trim:true
    }
},{
    timestamps:true
});

module.exports=Department=mongoose.model('Department',DepartmentSchema)