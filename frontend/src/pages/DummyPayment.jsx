import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const DummyPayment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { backendUrl } = useContext(ShopContext);

  const [loading, setLoading] = useState(false);

  const pay = async (status) => {
    setLoading(true);

    setTimeout(async () => {
      try {
        await axios.post(backendUrl + "/api/payment/verify", {
          orderId,
          paymentStatus: status,
          userEmail: "testuser@gmail.com",
        });

        setLoading(false);

        if (status === "SUCCESS") {
          navigate("/orders");
        } else {
          navigate("/order-failed");
        }
      } catch (error) {
        console.log("Payment Error:", error);
        setLoading(false);
        alert("Payment Failed!");
      }
    }, 2500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      
      {/* Payment Card */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 text-center">
        
        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-800">
           Payment Gateway
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Complete your order securely
        </p>

        {/* Order Info */}
        <div className="mt-6 bg-gray-100 rounded-xl p-4 text-sm text-gray-700">
          <p>
            <span className="font-medium">Order ID:</span>{" "}
            {orderId.slice(0, 10)}...
          </p>
          <p className="mt-2">
            <span className="font-medium">Amount:</span> ₹999 
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="mt-8 flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Processing Payment...
            </p>
          </div>
        ) : (
          <>
            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-4">
              <button
                onClick={() => pay("SUCCESS")}
                className="w-full bg-black text-white py-3 rounded-xl hover:opacity-90 transition"
              >
                Pay Now 
              </button>

              <button
                onClick={() => pay("FAILED")}
                className="w-full border border-gray-400 text-gray-700 py-3 rounded-xl hover:bg-gray-100 transition"
              >
                Cancel Payment 
              </button>
            </div>

            {/* Footer Note */}
            <p className="text-xs text-gray-400 mt-6">
              Payment Gateway — Pay with ease
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default DummyPayment;
