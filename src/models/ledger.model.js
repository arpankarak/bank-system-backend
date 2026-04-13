const mongoose = require('mongoose');
const { type } = require('node:os');

const ledgerSchema = new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required : [true,"ledger must be associated with an account"],
        index:true,
        immutable:true

    },
    amount:{
        type:Number,
        required:[true,"amount is required for transaction"],
        immutable:true
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:[true,"ledger must be associated with transaction"],
        index:true,
        immutable:true
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"type can be either credit or debit"
        },

        required:[true,"ledger type is requierd"],
        immutable:true
    }

})


function preventLedgerModification(){
    throw new Error("ledger entries are immutable and cant be modified or deleted");
    
}

ledgerSchema.pre("find",preventLedgerModification);
ledgerSchema.pre("findOneAndUpdate",preventLedgerModification);
ledgerSchema.pre("updateOne",preventLedgerModification);
ledgerSchema.pre("remove",preventLedgerModification);
ledgerSchema.pre("deleteMany",preventLedgerModification);
ledgerSchema.pre("deleteOne",preventLedgerModification);
ledgerSchema.pre("updateMany",preventLedgerModification);
ledgerSchema.pre("findOneAndReplace",preventLedgerModification);
ledgerSchema.pre("findOneAndDelete",preventLedgerModification);

const ledgerModel = mongoose.model("ledger",ledgerSchema);

module.exports = {
    ledgerModel
}