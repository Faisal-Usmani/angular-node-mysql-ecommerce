const jwt=require("jsonwebtoken");

const checkToken=async(req,res,next)=>{
    try{
      const token=req.headers?.authorization;
      if(!token){
        return res.status(403).json({
            message:'No token provided'
        })
      }
       await jwt.verify(token,'estore-secrete-key'); 
       next();
    }
    catch(error){
        res.status(401).json({message:"Authorization failed"})
    }
}

module.exports=checkToken;