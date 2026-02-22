import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';
import paymentLogModel from "../models/PaymentLog.js";
import { sendOrderEmail } from "../utils/sendEmail.js";

//gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

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

    // Sending email to the user
    await sendOrderEmail(address.email, newOrder._id, amount);

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

const placeOrderStripe = async(req,res) =>{
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod:"Stripe",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) =>({
      price_data: {
        currency:currency,
        product_data: {
          name:item.name
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity 
    }))

    line_items.push({
      price_data: {
        currency:currency,
        product_data: {
          name:"Delivery fee"
        },
        unit_amount: deliveryCharge * 100
      },
      quantity: 1
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], 
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment',
    })

    res.json({success:true,session_url:session.url})

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// Verify STRIPE

// ================= VERIFY STRIPE =================
const verifyStripe = async (req, res) => {
  try {

    const { orderId, success } = req.body;

    console.log("VERIFY HIT:", orderId, success); // debug

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // ✅ accept string OR boolean
    const isSuccess = success === true || success === "true";

    if (isSuccess) {

      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
      });

      await userModel.findByIdAndUpdate(order.userId, {
        cartData: {},
      });

      // For email functionality
      await sendOrderEmail(order.address.email, order._id, order.amount);

      await paymentLogModel.create({
        orderId,
        paymentId: "STRIPE_" + Date.now(),
        amount: order.amount,
        status: "SUCCESS",
        gateway: "STRIPE",
      });

      return res.json({ success: true });
    }

    // failed payment
    await orderModel.findByIdAndDelete(orderId);

    return res.json({ success: false });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  placeOrder,
  allOrders,
  userOrders,
  updateStatus,
  placeOrderStripe,
  verifyStripe
};
