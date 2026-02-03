import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

/* Global variables */
const currency = "inr";
const deliveryCharge = 50;

/* ✅ Place Order (Dummy Online Payment Supported) */
const placeOrder = async (req, res) => {
  try {
    // ✅ Receive paymentMethod from frontend
    const { userId, items, amount, address, paymentMethod } = req.body;

    // ✅ Create order object
    const orderData = {
      userId,
      items,
      address,
      amount,

      // ✅ Store payment method dynamically
      paymentMethod: paymentMethod || "online",

      // ✅ Dummy online payment assumed successful
      payment: paymentMethod === "online" ? true : false,

      date: Date.now(),
    };

    // ✅ Save order in DB
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // ✅ Clear user cart after placing order
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // ✅ Send response to frontend
    res.json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ✅ All orders data for admin panel */
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ✅ User orders data for frontend */
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ✅ Update order status (Admin only) */
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });

    res.json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { placeOrder, allOrders, userOrders, updateStatus };
