import express from "express";

import Order from "../models/orderModel.js";
import PaymentLog from "../models/PaymentLog.js";

const router = express.Router();

router.post("/verify", async (req, res) => {
  try {
    const { orderId, paymentStatus } = req.body;

    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false });
    }

    const paymentId = "ONLINE_" + Date.now();

    // Update order payment status
    order.paymentStatus =
      paymentStatus === "SUCCESS" ? "PAID" : "FAILED";

    order.paymentId = paymentId;
    await order.save();

    // Save payment log
    await PaymentLog.create({
      orderId: order._id,
      paymentId,
      amount: order.amount,
      status: paymentStatus,
    });

    // Send response immediately
    res.json({
      success: true,
      message: "Payment Verified Successfully",
    });

  } catch (error) {
    console.log("Payment Verify Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
