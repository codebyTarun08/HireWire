import React, { useState } from "react";
import HireWire from "../assets/HireWire.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/user/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Login successful: ", response.data);
      toast.success(response.data.message);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response) {
        setErrorMessage(error.response.data.errors || "Login failed!!!");
      }
    }
  };
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white text-black px-8 py-6 rounded shadow-lg text-lg font-semibold">
          Loading...
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gradient-to-r from-black via-fuchsia-900 to-gray-900">
      <div className="h-screen container mx-auto flex  items-center justify-center text-white">
        {/* Header */}
        <header className="absolute top-0 left-0 w-full flex justify-between items-center p-5  ">
          <div className="flex items-center space-x-2">
            <img src={HireWire} alt="Logo" className="w-10 h-10 rounded-full" />
            <Link to={"/"} className="text-xl font-bold text-lime-400">
              HireWire
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to={"/signup"}
              className="bg-transparent border border-gray-500 p-1 text-sm md:text-md md:py-2 md:px-4 rounded-md"
            >
              Signup
            </Link>
            <Link
              to={"/courses"}
              className="bg-green-500 p-1 text-sm md:text-md md:py-2 md:px-4 rounded-md"
            >
              Join now
            </Link>
          </div>
        </header>

        {/* Login Form */}
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-[500px] m-8 md:m-0 mt-20">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Welcome to <span className="text-lime-400">HireWire</span>
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Unlock awesome stuff – log in!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className=" text-gray-400 mb-2">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="example@email.com"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className=" text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
                <span className="absolute right-3 top-3 text-gray-500 cursor-pointer">
                  👁️
                </span>
              </div>
            </div>
            {errorMessage && (
              <div className="mb-4 text-red-500 text-center">
                {errorMessage}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
