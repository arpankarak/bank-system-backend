const { status } = require('init');
const mongoose = require('mongoose');
const { type } = require('node:os');
const { ref } = require('node:process');
const TransactionSchema = new mongoose.Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        require:[true,"a valid account must be associated for transaction"],
        index:true
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"a valid account must be associated for transaction"],
        index:true
    },
    status:{
        type:String,
        enum:{
            values :["PENDING","COMPLETE","FAILED","REVERSED"],
            message: "status can be completed,pending or reversed"},
        default: "PENDING"

    },
    amount:{
        type: Number,
        required:[true,"amount is require for creating transaction"],
        min : [0,"transaction cant be negative"]
    },
    idempotencyKey:{
        type: String,
        required : [true, "idempotency key is required for creating transaction"],
        index:true,
        unique:true
        
    }
},{
    timestamps: true
})

const TransactionModel = mongoose.model("transaction",TransactionSchema);
module.exports = {
    TransactionModel
};