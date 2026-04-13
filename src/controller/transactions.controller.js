const TransactionModel = require('../models/transaction.model');
const AccountModel = require('../models/account.model');
const ledgerModel = require('../models/ledger.model');
const emailService = require('../services/email.services');
const mongoose = require('mongoose');
const { status } = require('init');
const { type } = require('node:os');
const userModel = require('../models/user-model');

/**
 * -1.validate request
 * -2.validate idempotency key
 * -3.check account status
 * -4.derive sender balance from ledger
 * -5.create transaction (pending)
 * -6.create debit ledger entry
 * -7.create credit ledger entry
 * -8.mark transation completed
 * -9.commit mongodb session
 * -10.send email notification
 */

async function createTransaction(req,res) {
    /**
     * - validate request
     */

    const{fromAccount,toAccount,amount,idempotencyKey} = req.body;
    if (![fromAccount,toAccount,amount,idempotencyKey].every(Boolean)) {
        return res.status(400).json({
            message:"something went wrong"
        })        
    }

    const fromAccountUser = await AccountModel.findOne({_id:fromAccount});
    const toAccountUser = await AccountModel.findOne({_id:toAccount});

    if (![fromAccountUser,toAccountUser].every(Boolean)) {
        return res.status(400).json({
            message:"User is not existed"
        })
    }
    /**
     * - validate idempotancy key
     */

    const isIdempotancyKey = await TransactionModel.findOne({idempotencyKey:idempotencyKey});
    if (isIdempotancyKey) {
        try {
            if (isIdempotancyKey.status === "COMPLETED") {
                return res.status(200).json({
                    message:'transaction is completed',
                    transaction: isIdempotancyKey
                })
            }
            if (isIdempotancyKey.status === "PENDING") {
                return res.status(409).json({
                    message:'transaction is in pending state'
                })
            }
            if (isIdempotancyKey.status === "REVERSED") {
                return res.status(400).json({
                    message:'transaction was  reversed please try again'
                })
            }
            if (isIdempotancyKey.status === "FAILED") {
                return res.status(400).json({
                    message:'transaction failed'
                })
            }

        } catch (err) {
            return res.status(400).json({
                message:"something went wrong"
            })
        }
        
    }

    /**
     * -checking account status
     */
    if (fromAccountUser.status !== "ACTIVE" || toAccountUser.status !== "ACTIVE") {
        return res.status(409).json({
            message:"accounts must be active in order to make transaction"
        })
    }
    /**
     * derive sender balance from ledger
     */

    const balance = fromAccountUser.getBalance();
    if (balance < amount) {
        return res.status(400).json({
            message:"Insufficient balance"
        })
    }
    /**
     * crate transaction
     */

    const session = await mongoose.startSession();
    session.startTransaction()
    const transaction = await TransactionModel.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    },{session})

    try {
        const debitLedgerEntry = await ledgerModel.create({
            account:fromAccount,
            amount:amount,
            transaction:transaction._id,
            type:"DEBIT"

        },{session})

        const creditLedgerEntry = await ledgerModel.create({
            account: toAccount,
            amount:amount,
            transaction: transaction._id,
            type:"CREDIT"

        },{session})

        transaction.status = "COMPLETED";
        await transaction.save({session});

        await session.commitTransaction();
        session.endSession();
        emailService.transactionEmail(req.user.email,req.user.name,amount,toAccount);
        return res.status(201).json({
            message:"transaction completed successfully",
            transaction
        })
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        emailService.sendTransactionFail(req.user.email,req.user.name,amount,toAccount);
        return res.status(500).json({
            message:"something went wrong , transaction failed"
        })
    }

    /**
     * - sending email notification
     */

    
}


async function createInitialFundsTransaction(req,res) {
    const {amount,toAccount,idempotencyKey} = req.body;
    if (![toAccount,amount,idempotencyKey].every(Boolean)) {
        return res.status(400).json({
            message:"proper information is require to initiate transaction"
        })
        
    }
    const toUserAccount = await AccountModel.findOne({_id:toAccount});
    if (!toUserAccount) {
        return res.status(400 ).json({
            message:"account is not valid"
        })
    }

    const fromUserAccount = await AccountModel.findOne({
        systemUser:true,
        user:req.user._id
    })

    if (!fromUserAccount) {
        return res.status(400).json({
            message:"system user account not found"
        })
    }


    const session = await mongoose.startSession();
    session.startTransaction();

    const  transaction = await TransactionModel.create({

    })
}

module.exports = {
    createTransaction
};