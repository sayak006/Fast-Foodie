const jwt=require('jsonwebtoken')
const register=require('../module/register.js')

const auth=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt
        const verifyUser=jwt.verify(token,process.env.SECRET_KEY)
        console.log(verifyUser)

        const user=await register.findOne({_id:verifyUser._id})
        console.log(user)

        req.token=token
        req.user=user
        next()

    }catch(error){
        res.status(404).send(error)
    }
}

module.exports=auth