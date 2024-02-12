// backend/routes/account.js
const express = require('express');
const { authMiddleware } = require('../middlewares');
const { Account } = require('../dB/db');
const { default: mongoose } = require('mongoose');
const router = express.Router();
router.use(express.json());


router.get("/balance",authMiddleware, async(req,res)=>{
    const {balance} = await Account.findOne({
        userId: req.userId
    });

    
    res.json({
        balance: balance
    })
})

router.post("/transfer",authMiddleware,async (req,res)=>{

    const session = await mongoose.startSession();

    session.startTransaction();

    const {amount, to} = req.body;



    const account = await Account.findOne({ userId:req.userId}).session(session);

    if (!account || account.balance < amount ) {
        await session.abortTransaction();
        return res.status(400).json({
            msg: "Insufficient balance"
        });
        
    }
    const toAccount = await Account.findOne({userId:to}).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    await Account.updateOne({userId: req.userId},{$inc : {balance: -amount}}).session(session);

    await Account.updateOne({userId: to}, {$inc: {balance: amount}}).session(session);

    await session.commitTransaction();


    res.json({
        msg: "Transfer success"
    });


})



module.exports = router;