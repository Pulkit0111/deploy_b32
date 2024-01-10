const express=require("express")
const bcrypt=require("bcrypt")
const {UserModel}=require("../model/user.model")
const jwt=require("jsonwebtoken")

const userRouter=express.Router()

userRouter.post("/register",(req,res)=>{
    const {username,email,pass}=req.body
    try{
        bcrypt.hash(pass, 8, async(err, hash) => {
            if(err){
                res.status(200).json({error:err})
            } else {
                const user=new UserModel({username,email,pass:hash})
                await user.save()
                res.status(200).json({msg:"The new user has been registered!"})
            }
        })
    } catch(err){
        res.status(400).json({error:err})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,pass}=req.body
    try{
        const user=await UserModel.findOne({email})
        bcrypt.compare(pass, user.pass, (err, result)=>{
            if(result){
                const token=jwt.sign({userID:user._id,user:user.username},"masai")
                res.status(200).json({msg:"Logged in!",token})
            } else {
                res.status(200).json({error:err})
            }
        })
    } catch(err){
        res.status(400).json({error:err})
    }
})

module.exports={
    userRouter
}