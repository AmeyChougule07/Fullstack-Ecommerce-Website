import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {

  const [method, setMethod] = useState("online");

  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // ================= INPUT HANDLER =================
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  // ================= SUBMIT ORDER =================
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // ✅ LOGIN CHECK ADDED
    if (!token) {
      toast.error("Please login first to continue checkout");
      navigate("/login");
      return;
    }

    try {
      let orderItems = [];

      // prepare cart items
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );

            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        paymentMethod: method,
      };

      // ================= SWITCH CASE =================
      switch (method) {

        // ---------- ONLINE PAYMENT ----------
        case "online": {
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );

          if (response.data.success) {
            setCartItems({});
            navigate(`/payment/${response.data.orderId}`);
          } else {
            toast.error(response.data.message);
          }
          break;
        }

        // ---------- STRIPE PAYMENT ----------
        case "stripe": {
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            { headers: { token } }
          );

          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;
        }

        default:
          toast.error("Please select payment method");
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ================= UI =================
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >

      {/* ================= LEFT SIDE ================= */}
      <div className="flex flex-col w-full gap-4 sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        <div className="flex gap-3">
          <input required name="firstName" value={formData.firstName}
            onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full"
            placeholder="First name" />

          <input required name="lastName" value={formData.lastName}
            onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full"
            placeholder="Last name" />
        </div>

        <input required name="email" value={formData.email}
          onChange={onChangeHandler}
          className="border rounded py-1.5 px-3.5 w-full"
          placeholder="Email address" />

        <input required name="street" value={formData.street}
          onChange={onChangeHandler}
          className="border rounded py-1.5 px-3.5 w-full"
          placeholder="Apartment no, Street" />

        <div className="flex gap-3">
          <input required name="city" value={formData.city}
            onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full"
            placeholder="City" />

          <input required name="state" value={formData.state}
            onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full"
            placeholder="State" />
        </div>

        <div className="flex gap-3">
          <input required name="zipcode" value={formData.zipcode}
            onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full"
            placeholder="Pincode" />

          <input required name="country" value={formData.country}
            onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full"
            placeholder="Country" />
        </div>

        <input required name="phone" value={formData.phone}
          onChange={onChangeHandler}
          className="border rounded py-1.5 px-3.5 w-full"
          placeholder="Phone" />
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />

          <div className="flex gap-3 flex-col lg:flex-row">

            {/* ONLINE */}
            <div onClick={() => setMethod("online")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${
                method === "online" ? "bg-green-400" : ""}`} />
              <p className="text-gray-500 text-sm font-medium mx-4">
                ONLINE PAYMENT
              </p>
            </div>

            {/* STRIPE */}
            <div onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${
                method === "stripe" ? "bg-green-400" : ""}`} />
              <p className="text-gray-500 text-sm font-medium mx-4">
                STRIPE PAYMENT
              </p>
            </div>

          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm cursor-pointer"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>

    </form>
  );
};

export default PlaceOrder;