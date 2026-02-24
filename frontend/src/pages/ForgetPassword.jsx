import React, { useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const ForgotPassword = () => {

  const { backendUrl } = useContext(ShopContext);

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ================= SEND OTP =================
  const sendOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        backendUrl + "/api/user/send-reset-otp",
        { email }
      );

      if (response.data.success) {
        toast.success("OTP sent to your email 📧");
        setStep(2);
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= RESET PASSWORD =================
  const resetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        backendUrl + "/api/user/reset-password",
        { email, otp, newPassword }
      );

      if (response.data.success) {
        toast.success("Password updated successfully ✅");
        window.location.href = "/login";
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">

      <form
        onSubmit={step === 1 ? sendOtp : resetPassword}
        className="flex flex-col gap-4 w-[350px]"
      >

        <h2 className="text-2xl font-medium">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>

        {/* STEP 1 — EMAIL */}
        {step === 1 && (
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-3 py-2"
          />
        )}

        {/* STEP 2 — OTP + PASSWORD */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border px-3 py-2"
            />

            <input
              type="password"
              placeholder="New Password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border px-3 py-2"
            />
          </>
        )}

        <button className="bg-black text-white py-2 mt-2">
          {step === 1 ? "Send OTP" : "Reset Password"}
        </button>

      </form>
    </div>
  );
};

export default ForgotPassword;