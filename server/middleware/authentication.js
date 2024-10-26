const jwt = require("jsonwebtoken");

const authenticate = async (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(403).json({message:"Please login first"});
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            res.status(401).json({message:"Unauthorized"});
        }
        req.user = decoded;
        next();
    })
}

module.exports = authenticate;