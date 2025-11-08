import { useState } from "react";
import { motion } from "framer-motion";
import heroImg from "../assets/hero-bg.jpg";
import JoinCards from "../components/Cards";
import LoginModal from "../components/LoginModal"; // ✅ import the modal

const Hero = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const scrollToCards = () => {
    document
      .getElementById("join-cards")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden pt-16 md:pt-24"
    >
      {/* Background Image */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-fixed bg-cover bg-center opacity-30 z-0"
        style={{ backgroundImage: `url(${heroImg})` }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-white/60 to-blue-100/30 z-10"></div>

      {/* Main Hero Content */}
      <div className="relative flex flex-col md:flex-row items-center justify-between px-6 md:px-16 z-20">
        {/* Left: Image */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full md:w-[55%] h-[520px] md:h-[560px] flex items-center justify-center"
        >
          <div className="absolute w-[550px] h-[550px] bg-gradient-to-br from-blue-200/70 to-blue-100/30 blur-3xl rounded-[55%_45%_35%_65%_/_60%_30%_70%_40%] animate-pulse -z-10"></div>

          <div className="relative w-[90%] md:w-[700px] overflow-hidden rounded-t-[220px] rounded-br-[220px] rounded-bl-[100px] shadow-2xl">
            <img
              src={heroImg}
              alt="Fish farmer illustration"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-300/70 to-transparent"></div>
          </div>

          <svg
            className="absolute bottom-[-25px] left-0 w-[550px] opacity-40 z-10 wave-motion"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#3b82f6"
              fillOpacity="1"
              d="M0,288L48,272C96,256,192,224,288,202.7C384,181,480,171,576,186.7C672,203,768,245,864,256C960,267,1056,245,1152,234.7C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </motion.div>

        {/* Right: Text */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-10 md:mt-0 md:w-1/2 flex flex-col space-y-6 text-right md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 leading-snug">
            Your Number One{" "}
            <span className="block text-blue-600">
              Fishery Companion & Advisor
            </span>
          </h1>

          <p className="text-gray-700 text-lg md:text-xl max-w-md ml-auto md:ml-0">
            Empowering fish farmers, fishermen, and aquaculture businesses with
            intelligent insights, sustainable practices, and market access.
          </p>

          <div className="flex justify-end md:justify-start space-x-4 pt-2">
            <button
              onClick={() => setIsLoginOpen(true)} // ✅ open modal here
              className="px-6 py-3 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition shadow-md cursor-pointer"
            >
              Login
            </button>

            <button
              onClick={scrollToCards}
              className="px-6 py-3 rounded-full border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white transition shadow-md cursor-pointer"
            >
              Register
            </button>
          </div>
        </motion.div>
      </div>

      {/* Join Section */}
      <div
        id="join-cards"
        className="w-full mt-20 md:mt-24 text-center px-0 z-20 relative"
      >
        <JoinCards />
      </div>

      {/* ✅ Login Modal (Animated) */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(user) => {
          console.log("Logged in user:", user);
          setIsLoginOpen(false);
        }}
      />
    </section>
  );
};

export default Hero;
