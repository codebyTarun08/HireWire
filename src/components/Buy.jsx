import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCourseAndIntent = async () => {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/course/buy/${courseId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setCourse(response.data.course);
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        if (err?.response?.status === 400) {
          navigate("/purchases");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndIntent();
  }, [courseId, token, navigate]);

  if (loading) {
    return <p className="text-center mt-40">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="my-20 container mx-auto">
      <h1 className="text-xl font-bold text-center mb-8">Order Summary</h1>
      <p className="text-center">Course: {course?.title}</p>
      <p className="text-center">Price: ₹{course?.price}</p>

      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm
            courseId={courseId}
            clientSecret={clientSecret}
            token={token}
          />
        </Elements>
      )}
    </div>
  );
}

export default Buy;
