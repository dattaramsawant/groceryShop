const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:8,
    },
    role:{
        type:String,
        required:true,
        default:"user",
        enum:["user","admin","moderator"]
    },
    profileImg:{
        type:String
    },
    mobileNumber:{
        type:Number,
        unique:true
    }
},
{
    timestamps:true
});

module.exports=User=mongoose.model('User',UserSchema)