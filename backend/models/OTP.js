const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OTPSchema=new Schema({
    otp:{
        type:Number,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    }
},{
    timestamps:true
})

module.exports=OTP=mongoose.model("OTP",OTPSchema)