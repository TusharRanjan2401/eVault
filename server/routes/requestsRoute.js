const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Request = require("../models/requestModel");
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");
const { sendMessage } = require("../service/kafkaService");

//get all request by user
router.post("/get-all-requests-by-user", authMiddleware, async (req, res) => {
  try {
    const requests = await Request.find({
      $or: [{ sender: req.body.userId }, { receiver: req.body.userId }],
    })
      .populate("sender")
      .populate("receiver")
      .sort({ createdAt: -1 });

    res.send({
      data: requests,
      message: "Data fetched successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//send request to another user
router.post("/send-request", authMiddleware, async (req, res) => {
  try {
    const request =  await sendMessage('money-requests', req.body);
    res.send({
      data: request,
      message: "Request sent successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//update request status
router.post("/update-request-status", authMiddleware, async (req, res) => {
  try {
    if (req.body.status === "accepted") {
      //create a transaction
      const transaction = new Transaction({
        sender: req.body.receiver._id,
        receiver: req.body.sender._id,
        amount: req.body.amount,
        reference: req.body.description,
        status: "success",
      });
      await transaction.save();

      //deduct amount from sender
      await User.findByIdAndUpdate(req.body.sender._id, {
        $inc: { balance: req.body.amount },
      });

      //add amount to receiver
      await User.findByIdAndUpdate(req.body.receiver._id, {
        $inc: { balance: -req.body.amount },
      });
    }
    await Request.findByIdAndUpdate(req.body._id, {
      status: req.body.status,
    });

    res.send({
      data: null,
      message: "Request status updated successfully",
      success: true,
    });
  } catch (error) {
    res.send({
      data: error,
      message: error.message,
      success: false,
    });
  }
});



module.exports = router;
