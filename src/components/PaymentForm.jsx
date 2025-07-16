


import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
import toast from "react-hot-toast";

const PaymentForm = ({ courseId, clientSecret, token }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage("");

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + '/purchases' }, // fallback
      redirect: 'if_required',
    });

    if (result.error) {
      setErrorMessage(result.error.message);
      setLoading(false);
      return;
    }

    if (result.paymentIntent?.status === 'succeeded') {
      try {
        // Optional: Save order to backend
        await axios.post(
          `${BACKEND_URL}/order`,
          {
            email: user?.user?.email,
            userId: user?.user?._id,
            courseId,
            paymentId: result.paymentIntent.id,
            amount: result.paymentIntent.amount,
            status: result.paymentIntent.status,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        toast.success("Payment successful!");
        navigate("/purchases");
      } catch (err) {
        console.error("Order saving failed:", err);
        toast.error("Payment succeeded, but order saving failed.");
        navigate("/purchases");
      }
    } else {
      setErrorMessage("Payment not completed.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <PaymentElement />
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      <button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="w-full mt-4 bg-green-500 text-white font-semibold py-3 rounded hover:bg-green-600"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default PaymentForm;
