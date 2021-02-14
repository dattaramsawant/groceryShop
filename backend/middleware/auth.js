const config=require('config');
const jwt=require('jsonwebtoken');

function auth(req,res,next){
    const token=req.header('Authorization').split(' ')[1];

    if(!token) res.status(401).json({message:"Authorization denied"});

    try{
        const decoded=jwt.verify(token,config.get('jwtSecret'));
        req.user=decoded;
        next();
    }catch(e){
        res.status(401).json({message:"Authorization denied"});
    }
}

module.exports=auth;