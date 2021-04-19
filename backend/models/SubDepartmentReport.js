const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const SubDepartmentReportSchema=new Schema({
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

module.exports=SubDepartmentReport=mongoose.model('SubDepartmentReport',SubDepartmentReportSchema)