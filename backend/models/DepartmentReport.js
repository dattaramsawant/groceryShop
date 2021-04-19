const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const DepartmentReportSchema=new Schema({
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

module.exports=DepartmentReport=mongoose.model('DepartmentReport',DepartmentReportSchema)