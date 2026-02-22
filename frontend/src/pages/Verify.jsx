import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Verify = () => {

  const { navigate, token, setCartItems, backendUrl } =
    useContext(ShopContext);

  const [searchParams] = useSearchParams();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = async () => {
    try {

      // ✅ wait until everything exists
      if (!token || !orderId) return;

      const response = await axios.post(
        backendUrl + "/api/order/verifyStripe",
        { success, orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        setCartItems({});
        toast.success("Payment Successful ✅");

        // ⭐ redirect
        navigate("/orders", { replace: true });
      } else {
        toast.error("Payment Failed");
        navigate("/cart", { replace: true });
      }

    } catch (error) {
      console.log(error);
      toast.error("Verification failed");
      navigate("/cart", { replace: true });
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token, orderId]); // ⭐ important

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <p className="text-lg font-medium">Verifying payment...</p>
    </div>
  );
};

export default Verify;