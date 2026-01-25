import mongoose from "mongoose";

const paymentLogSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    paymentId: String,
    amount: Number,
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
    },
    gateway: {
      type: String,
      default: "ONLINE_PAYMENT",
    },
  },
  { timestamps: true }
);

// Creating model
const PaymentLog = mongoose.model("PaymentLog", paymentLogSchema);

// Exporting
export default PaymentLog;
