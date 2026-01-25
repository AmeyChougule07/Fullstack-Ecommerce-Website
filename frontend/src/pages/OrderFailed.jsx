import React from "react";
import { useNavigate } from "react-router-dom";

const OrderFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full text-center">

        {/* ❌ Icon */}
        <div className="text-red-500 text-5xl mb-4">✖</div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800">
          Payment Failed
        </h2>

        {/* Message */}
        <p className="text-sm text-gray-600 mt-3">
          Your payment was cancelled or failed.  
          No money was deducted.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate("/cart")}
            className="w-full bg-black text-white py-2 rounded-lg text-sm hover:opacity-90 transition"
          >
            Go Back to Cart 
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full border border-gray-400 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
          >
            Continue Shopping 
          </button>
        </div>

        {/* Note */}
        <p className="text-[10px] text-gray-400 mt-5">
           Payment Gateway — Pay with ease
        </p>
      </div>
    </div>
  );
};

export default OrderFailed;
