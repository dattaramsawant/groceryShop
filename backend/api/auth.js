const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const config=require('config');
const jwt=require('jsonwebtoken');
const auth=require('../middleware/auth');
const nodemailer=require('nodemailer');

const User=require('../models/User');
const e = require('express');

router.post('/',(req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json("Please enter all fields");
    }

    User.findOne({email})
        .then(user=>{
            if(!user) return res.status(400).json("User does not exists");

            bcrypt.compare(password,user.password)
                .then(isMatch => {
                    if(!isMatch) return res.status(400).json("Invalid credentials");

                    jwt.sign(
                        {id:user.id},
                        config.get('jwtSecret'),
                        {expiresIn:36000},
                        (err,token)=>{
                            if(err) throw err;
                            res.json({
                                token,
                                user:{
                                    id:user.id,
                                    name:user.name,
                                    email:user.email,
                                    role:user.role
                                }
                            })
                        }
                    )
                })
        })

})

router.get('/user',auth,(req,res)=>{
    User.findById(req.user.id)
        .select('-password')
        .then(user=>res.json(user))
})

router.patch('/changePassword/:id',auth,(req,res)=>{
    const password=req.body.password
    User.findByIdAndUpdate(req.params.id)
        .then(user=>{
            console.log(user._id,req.params.id)
            if(user._id != req.params.id) return res.status(400).json("Not valid user")
            if(!user) return res.status(400).json("User does not exists")

            bcrypt.compare(password,user.password)
                .then(isMatch => {
                    if(!isMatch) return res.status(400).json("Current password is invalid");

                    bcrypt.genSalt(12,(err,salt)=>{
                        bcrypt.hash(req.body.newPassword,salt,(err,hash)=>{
                            if(err) return res.status(400).json(err) ;
                            user.password=hash;

                            user.save()
                                .then(()=>res.status(200).json("Password update successfully"))
                                .catch(err=>res.status(404).json(err))
                        })
                    })
                })
        })
})

var otpNumber = null
    otpNumber = Math.floor(100000 + Math.random() * 900000);   
    otpNumber = String(otpNumber);
    otpNumber = otpNumber.substring(0,4);
    otpNumber = parseInt(otpNumber)

let transporter = nodemailer.createTransport({
    // host: "",
    // port: 587,
    // secure: false,
    service : 'gmail',
    
    auth: {
        user: 'durvassawant79@gmail.com',
        pass: 'Datta@2010',
    }
    
});

router.post('/otpSend',async(req,res)=>{
    const {email}=req.body;

    if(!email){
        return res.status(400).json("Please enter email");
    }

    const emailVerify=await User.findOne({email})

    if(otpNumber===null){
        otpNumber = Math.floor(100000 + Math.random() * 900000);   
        otpNumber = String(otpNumber);
        otpNumber = otpNumber.substring(0,4);
        otpNumber = parseInt(otpNumber)
    }

    if(emailVerify !== null && emailVerify.email===req.body.email){
        var mailOptions=await {
            to: req.body.email,
            subject: "Otp for registration is: ",
            html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otpNumber +"</h1>" // html body
        }

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);   
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        
            res.render('otpNumber');
        })

        return res.status(201).json('Success')
    }else{
        return res.status(400).json('Error')
    }
})

router.post('/otpVerify',(req,res)=>{
    const {otp,email}=req.body;

    if(!otp){
        return res.status(400).json("Please enter otp");
    }

    if(parseInt(otpNumber) === otp){
        User.findOne({email})
            .then(user=>{
                if(!user) return res.status(400).json("User does not exists")

                jwt.sign(
                    {id:user.id},
                    config.get('jwtSecret'),
                    {expiresIn:36000},
                    (err,token)=>{
                        if(err) throw err;
                        res.json({
                            token,
                            user:{
                                id:user.id,
                                name:user.name,
                                email:user.email,
                                role:user.role
                            }
                        })
                    }
                )
            })
        otpNumber=null
    }else{
        return res.status(400).json("Please enter valid otp")
    }
})

module.exports=router;