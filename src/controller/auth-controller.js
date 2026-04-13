const userModel = require('../models/user-model');
const jwt = require('jsonwebtoken');
const emailService = require('../services/email.services');
const { use } = require('react');

/**
 * - user controller register 
 * - POST/api/auth/register
 */

async function userRegisterController(req,res){
    const{email,name,password} = req.body;

    const isExit = await userModel.findOne({email:email});
    if (isExit) {
        return res.status(422).json({
            message:"user already exist",
            status: "failed"
        })
    }
    const NewUser = await userModel.create({
        email,
        name,
        password
    })

    const token = jwt.sign({id:NewUser._id},process.env.JWT_SECRET,{expiresIn:"1d"});
    res.cookie("token",token,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:24*60*60*1000
    })
    await emailService.sendRegistrationEmail(email,name);

    return res.status(201).json({
        message:"user registered successfully",
        status:"success",
        user:NewUser
    })

    


}

async function userLoginController(req,res) {
    const {email,password} = req.body;    

    const user = await userModel.findOne({email:email}).select("+password");
    if (!user) {
        return res.status(404).json({
            message:"user not found",
            status:"failed"
        })
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({
            message:"invalid password",
            status:"failed"
        })
    }
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
    res.cookie("token",token,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:24*60*60*1000
    })
    return res.status(200).json({
        message:"user logged in successfully",
        status:"success",
        user:user
    })

}



module.exports = {
    userRegisterController,
    userLoginController
}