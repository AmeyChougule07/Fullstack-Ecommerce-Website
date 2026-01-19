import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"

{/*Placing order using cash on delivery method*/}

const placeOrder = async (req,res) => {
  try {
    const { userId,items,amount,address } = req.body
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod:"COD",
      payment:false,
      date: Date.now()
    }

    const newOrder = new orderModel(orderData)
    await newOrder.save()

    await userModel.findByIdAndUpdate(userId,{cartData:{}})
    res.json({success:true, message:"Order placed"})

  } catch (error) {
    console.log(error);
    res.json({success:false, message:error.message})
  }
}

{/*Placing order using STRIPE method*/}

const placeOrderStripe = async (req,res) => {

}

{/*Placing order using RAZORPAY method*/}

const placeOrderRazorpay = async (req,res) => {

}

{/*All orders data for admin panel*/}

const allOrders = async (req,res) => {

}

{/*User orders data for frontend*/}

const userOrders = async (req,res) => {

}

{/*Update order status from only admin panel*/}

const updateStatus = async (req,res) => {

}

export { placeOrder,placeOrderStripe,placeOrderRazorpay,allOrders,userOrders,updateStatus }