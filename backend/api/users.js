const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const config=require('config');
const jwt=require('jsonwebtoken');
const auth=require('../middleware/auth');
const multer=require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/profile/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' ||file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/svg' || file.mimetype === 'image/svg+xml') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 2
    },
    fileFilter: fileFilter
  });

const User=require('../models/User');

router.get("/", auth,(req, res) => {
    const perPage=parseInt(req.query.limit)
    const page=parseInt(req.query.page)
    const search=req.query.name;
    User.find({name:new RegExp(search,"i")})
        .skip(perPage * page)
        .limit(perPage)
        .select('-password')
        .sort({createdAt:-1})
        .then(user=>{
            User.countDocuments().then(count=>{
                return res.status(200).json({
                    totalCount:count,
                    currentCount:user.length,
                    user
                })
            })
        })
});

router.post('/',(req,res)=>{
    const {name,email,password,role}=req.body;

    if(!name || !email || !password){
        return res.status(400).json({message:"Please enter all fields"});
    }

    User.findOne({email})
        .then(user=>{
            if(user) return res.status(400).json({message:"User already exists"});
        })

    const newUser=new User({name,email,password,role});

    bcrypt.genSalt(12,(err,salt)=>{
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if(err) throw err;
            newUser.password=hash;
            newUser.save()
                .then(user=>{
                    jwt.sign(
                        {id:user.id},
                        config.get('jwtSecret'),
                        {expiresIn:3600},
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
                });
        })
    })
})

router.patch("/:id", auth,(req, res) => {
    User.findByIdAndUpdate(req.params.id)
        .then(user=>{
            user.role=req.body.role;

            user.save()
                .then(()=>res.status(200).json("User Role Updated"))
                .catch((err)=>res.status(404).json(err))
        })
        .catch(err=>res.status(404).json(err))

});

router.put("/:id", auth,(req, res) => {
    User.findByIdAndUpdate(req.params.id)
        .then(user=>{
            user.role=req.body.role;

            user.save()
                .then(()=>res.status(200).json("User Role Updated"))
                .catch((err)=>res.status(404).json(err))
        })
        .catch(err=>res.status(404).json(err))

});

router.delete('/:id',auth,(req,res)=>{
    User.findByIdAndDelete(req.params.id)
        .then(user=>
            user.remove()
            .then(()=>res.status(200).json("User deleted successfully"))
            .catch(err=>res.status(404).json(err))
        )
        .catch(err=>res.status(404).json(err))
})

router.patch("/profile/:id",upload.single('profileImg'),auth,(req,res)=>{
    const base_url="http://localhost:5000/"
    User.findByIdAndUpdate(req.params.id)
        .then(user=>{
            user.profileImg= req.file !==undefined ? base_url + req.file.path : user.profileImg,
            user.mobileNumber=req.body.mobileNumber !== undefined ? req.body.mobileNumber : user.mobileNumber,

            user.save()
                .then(()=>res.status(200).json("User Update Successfully"))
                .catch(err=>res.status(404).json(err))
        }) 
        .catch(err=>res.status(404).json(err))
})

router.put("/profile/:id",upload.single('profileImg'),auth,(req,res)=>{
    const base_url="http://localhost:5000/"
    User.findByIdAndUpdate(req.params.id)
        .then(user=>{
            user.profileImg= req.file !==undefined ? base_url + req.file.path : user.profileImg,
            user.mobileNumber=req.body.mobileNumber !== undefined ? req.body.mobileNumber : user.mobileNumber

            user.save()
                .then(()=>res.status(200).json("User Update Successfully"))
                .catch(err=>res.status(404).json(err))
        }) 
        .catch(err=>res.status(404).json(err))
})

router.get('/profile',auth,(req,res)=>{
    User.findById(req.user.id)
        .select('email mobileNumber name profileImg')
        .then(user=>res.status(200).json(user))
        .catch(err=>res.status(404).json({message:err}))
})

module.exports=router;