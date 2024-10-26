const authMiddleware = require("../middlewares/authMiddleware");
const Transaction = require("../models/transactionModel");
const router = require("express").Router();
const User = require("../models/userModel");
const stripe = require("stripe")(process.env.stripe_key);
const { uuid } = require("uuidv4");
const { sendMessage } = require("../service/kafkaService");

//transfer money
router.post("/transfer-fund", authMiddleware, async (req, res) => {
  try {
    //saving transaction
    const newTransaction = await sendMessage('transactions', req.body);

    //decreasing sender's balance
    await User.findByIdAndUpdate(req.body.sender, {
      $inc: { balance: -req.body.amount },
    });

    //increase the receiver's balance
    await User.findByIdAndUpdate(req.body.receiver, {
      $inc: { balance: req.body.amount },
    });

    res.send({
      message: "Transaction successful",
      data: newTransaction,
      success: true,
    });
  } catch (error) {
    res.send({
      message: "Transaction failed",
      data: error.message,
      success: false,
    });
  }
});

//verify receiver's account number
router.post("/verify-account", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.receiver });
    if (user) {
      res.send({
        message: "Account verfied",
        data: user,
        success: true,
      });
    } else {
      res.send({
        message: "Account not verfied",
        data: null,
        success: false,
      });
    }
  } catch (error) {
    res.send({
      message: "Account not verfied",
      data: error.message,
      success: false,
    });
  }
});

//get all transactions for a user
router.post(
  "/get-all-transactions-by-user",
  authMiddleware,
  async (req, res) => {
    try {
      const transactions = await Transaction.find({
        $or: [{ sender: req.body.userId }, { receiver: req.body.userId }],
      })
        .sort({ createdAt: -1 })
        .populate("sender")
        .populate("receiver");
      res.send({
        message: "Transaction fetched",
        data: transactions,
        success: true,
      });
    } catch (error) {
      res.send({
        message: "Transaction not fetched",
        data: error.message,
        success: false,
      });
    }
  }
);

//deposit funds using stripe
router.post("/deposit-funds", authMiddleware, async (req, res) => {
  try {
    const { token, amount } = req.body;
    //create customer
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    //create a charge
    const charge = await stripe.charges.create(
      {
        amount: amount,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: "Deposited to eVault",
      },
      {
        idempotencyKey: uuid(),
      }
    );

    //save the transaction
    if (charge.status === "succeeded") {
      const newTransaction = new Transaction({
        sender: req.body.userId,
        receiver: req.body.userId,
        amount: amount,
        type: "deposit",
        reference: "stripe deposit",
        status: "success",
      });
      await newTransaction.save();

      //increase the user's balance
      await User.findByIdAndUpdate(req.body.userId, {
        $inc: { balance: amount },
      });
      res.send({
        message: "Transaction successful",
        data: newTransaction,
        success: true,
      });
    } else {
      res.send({
        message: "Transaction failed",
        data: charge,
        success: false,
      });
    }
  } catch (error) {
    res.send({
      message: "Transaction failed",
      data: error.message,
      success: false,
    });
  }
});

module.exports = router;
