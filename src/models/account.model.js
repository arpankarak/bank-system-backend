const { status } = require('init');
const mongoose = require('mongoose');
const ledgerModel = require('../models/ledger.model');
const { timeStamp } = require('node:console');
const { userInfo, type } = require('node:os');
const { ref } = require('node:process');

const AccountSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true , "Account must be associated with user"],
        index: true
    },
    Status:{
        type:String,
        enum:{
            values:["ACTIVE","FROZEN","CLOSED"],
            message: "status can be eitherr active,frozen or closed",
           
        
        },
        default:"ACTIVE"
        

    },
    currency:{
        type:String,
        required:[true,"currency is required for creating an account"],
        default:"INR"
    },
},{
    timestamps:true
})

AccountSchema.index({user:1,status:1})

AccountSchema.methods.getBalance = async function(){
    const balanceData = await ledgerModel.aggregate([
        {$match: {account: this._id}},
        {
            $group: {
                _id:null,
                totalDebit:{
                    $sum:{
                        $cond:[
                            {$eq:["$type","DEBIT"]},
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit:{
                    $sum:{
                        $cond:[
                            {$eq:["$type","CREDIT"]},
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project:{
                _id: 0,
                balance:{ $subtract: ["$totalCredit","$totalDebit"]}
            }
        }
    ])

    if (balanceData.length === 0) {
        return 0;
    }
    return balanceData[0].balance;
}

const AccountModel = mongoose.model("account",AccountSchema);

module.exports = AccountModel;