const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const TypeSchema=new Schema({
    name:{
        type:String,
        unique:true,
        require:[true,'Type is Required'],
        trim:true
    },
    typeDetails:[
        {
            category:{
                type:Schema.Types.ObjectId,
                ref:'Department',
                require:true
            },
            subCategory:[
                {
                    type:Schema.Types.ObjectId,
                    ref:'SubDepartment',
                    require:true
                }
            ],
            _id:{
                type:mongoose.Schema.Types.ObjectId,
                index:true,
                require:true,
                auto:true
            }
        }
    ]
},{
    timestamps:true
})

module.exports=Type=mongoose.model('Type',TypeSchema)