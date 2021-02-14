const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const OrderSchema=new Schema({
    productDetails:{
        type:Schema.Types.ObjectId,
        required:true,
        trim:true
    },
    quantity:{
        type:Number,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        trim:true
    },
    orderId:{
        type:String,
        required:true,
        trim:true
    },
    orderDate:{
        type:Date(),
        required:true,
        trim:true
    },
    deliveryDate:{
        type:Date(),
        required:true,
        trim:true
    },
    deliveryAddress:{
        type:String,
        required:true,
        trim:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        trim:true
    }
},{
    timestamps:true
})

module.exports=Order=mongoose.model('Order',OrderSchema)