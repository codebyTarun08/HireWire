import React, { useEffect, useState } from "react";
import HireWire from "../assets/HireWire.png";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";
function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // token
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        console.log(response.data.courses);
        setCourses(response.data.courses);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);

  // logout
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (

    <div className="bg-gradient-to-r from-black via-fuchsia-900 to-gray-900">

      <div className="h-[1250px] md:h-[1050px] text-white container mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-6 ">
          <div className="flex items-center space-x-2">
            <img
              src={HireWire}
              alt=""
              className="w-7 h-7 md:w-10 md:h-10 rounded-full"
            />
            <h1 className="md:text-2xl text-lime-400 font-bold">
              HireWire
            </h1>
          </div>
          <div className="space-x-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Main section */}
        <section className="text-center py-20">
          <h1 className="text-5xl font-semibold text-lime-400">
            HireWire
          </h1>

          <br />
          <p className="text-gray-200">
            Expert-crafted courses designed for real-world success.
          </p>
          <div className="space-x-4 mt-8">
            <Link
              to={"/courses"}
              className="bg-[#00FFC6] text-white p-2 md:py-3 md:px-6 rounded semibold 
hover:bg-[#00e6b2] hover:text-fuchsia-900 
shadow-[0_0_10px_#00ffc6] hover:shadow-[0_0_20px_#00ffc6] 
hover:scale-105 transition-all duration-300"

            >
              Explore courses
            </Link>
            <Link
              to={"https://www.youtube.com"}
              className="bg-[#00FFC6] text-white p-2 md:py-3 md:px-6 rounded semibold 
hover:bg-[#00e6b2] hover:text-fuchsia-900 
shadow-[0_0_10px_#00ffc6] hover:shadow-[0_0_20px_#00ffc6] 
hover:scale-105 transition-all duration-300"
            >
              Courses videos
            </Link>
          </div>
        </section>
        <section className="p-10">
          <Slider className="" {...settings}>
            {courses.map((course) => (
              <div key={course._id} className="p-4">
                <div className="relative flex-shrink-0 w-92 transition-transform duration-300 transform hover:scale-105">
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <img
                      className="h-32 w-full object-contain"
                      src={course.image.url}
                      alt=""
                    />
                    <div className="p-6 text-center">
                      <h2 className="text-xl font-bold mb-4 text-white">
                        {course.title}
                      </h2>
                      <Link to={`/buy/${course._id}`} className="mt-8 bg-green-500 text-white py-2 px-4  rounded-full hover:bg-blue-500 duration-300">
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>




        {/* Footer */}
        <footer className="my-12">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2 ">
                <img src={HireWire} alt="" className="w-10 h-10  rounded-full" />
                <h1 className="text-2xl text-lime-400 font-bold">
                  HireWire
                </h1>
              </div>
              <div className="mt-3 ml-2 md:ml-8">
                <p className="mb-2 ml-6">Follow us</p>
                <div className="flex space-x-5 ml-2">
                  <a href="">
                    <FaFacebook className="text-2xl hover:text-blue-400 duration-300" />
                  </a>
                  <a href="">
                    <FaInstagram className="text-2xl hover:text-pink-600 duration-300" />
                  </a>
                  <a href="">
                    <FaTwitter className="text-2xl hover:text-blue-600 duration-300" />
                  </a>
                </div>
              </div>
            </div>

            <div className="items-center mt-6 md:mt-0 flex flex-col">
              <h3 className="text-lg font-semibold md:mb-4">CONNECTS</h3>
              <ul className=" space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  <Link to="https://www.youtube.com" target="_blank">
                    YOUTUBE
                  </Link>
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
                    TELEGRAM
                  </a>
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    GITHUB
                  </a>
                </li>
              </ul>
            </div>
            <div className="items-center mt-6 md:mt-0 flex flex-col">
              <h3 className="text-lg font-semibold mb-4">
                Copyrights&#169;2025
              </h3>
              <ul className=" space-y-2 text-center text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  Terms & Conditions
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Privacy Policy
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Refund & Cancellation
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
