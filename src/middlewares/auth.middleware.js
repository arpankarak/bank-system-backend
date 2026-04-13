const userModel = require('../models/user-model');
const AccountModel = require('../models/account.model');
const jwt = require('jsonwebtoken');
const { decode } = require('node:punycode');
const { use } = require('react');

async function isLoggedin(req,res,next){
    const token = req.cookies.token ||( req.headers.authorization && req.headers.authorization.split(" ")[1]) ;
    console.log(token);
    if (!token) {
        return res.status(401).json({
            message:"Unauthorized access, access denied"
        })
    }

    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        const user = await userModel.findOne({_id:decoded.id});

        if (!user) {
            return res.status(401).json({
                message:"user not found"
            })
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            message:"invalid session token expired"
        })
    }

}

async function authSystemUserMiddleware(req,res,next) {
    const token = req.cookies.token ||( req.headers.authorization && req.headers.authorization.split(" ")[1]) ;
    if (!token) {
        return res.status(401).json({
            message:"token is not occured"
        })
    }
    try {
        let decoded =  jwt.verify(token,process.env.JWT_SECRET);
        const user = await userModel.findOne({_id:decoded.id}).select("+systemUser");
        if (!user.systemUser) {
            return res.status(403).json({
                message:"Forbidden access not a system user"
            })
        }
        req.user = user;
        next()

    } catch (err) {
        return res.status(401).json({
            message:"Unauthorized access,token is invalid"
        })
    }

    
}

module.exports ={
    isLoggedin,
    authSystemUserMiddleware
} ;