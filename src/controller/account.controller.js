const AccountModel = require('../models/account.model');

async function createAccount(req,res){
    const user = req.user;

    const NewAccount = await AccountModel.create({
        user:user._id,
    })

    res.status(201).json({
        NewAccount
    })
}

module.exports = {
    createAccount
}