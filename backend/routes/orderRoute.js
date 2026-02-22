import express from "express";
import {
  placeOrder,
  allOrders,
  userOrders,
  updateStatus,
  placeOrderStripe,
  verifyStripe
} from "../controllers/orderController.js";

import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

/* ✅ Admin features */
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

/* ✅ Online Payment */
orderRouter.post("/place", authUser, placeOrder);

/* ✅ STRIPE payment gateway */
orderRouter.post("/stripe", authUser, placeOrderStripe);

/* ✅ User features */
orderRouter.post("/userorders", authUser, userOrders);

//Verify payment
orderRouter.post('/verifyStripe',authUser,verifyStripe)

export default orderRouter;