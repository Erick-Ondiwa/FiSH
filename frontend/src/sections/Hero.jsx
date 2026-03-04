import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import heroImg from "../assets/hero-bg.jpg";
import JoinCards from "../components/Cards";
import LoginModal from "../components/LoginModal";


const Hero = () => {
  const navigate = useNavigate();

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const scrollToCards = () => {
    document
      .getElementById("join-cards")
      ?.scrollIntoView({ behavior: "smooth" });
  };
// bg-gradient-to-br from-blue-900/40 via-blue-700/30 to-teal-600/20 backdrop-blur-md
  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-900 via-blue-700 to-teal-600 overflow-hidden pt-16 md:pt-24"
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
            className="absolute bottom-[-30px] left-0 w-full max-w-[900px] opacity-70 z-10 animate-[waveMove_10s_ease-in-out_infinite]"
            viewBox="0 0 1440 320"
          >
            <defs>
              <linearGradient id="fishWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>

              <style>{`
                @keyframes waveMove {
                  0% { transform: translateX(0); }
                  50% { transform: translateX(-25px); }
                  100% { transform: translateX(0); }
                }
              `}</style>
            </defs>

            <path
              fill="url(#fishWaveGradient)"
              fillOpacity="1"
              d="M0,256L48,245.3C96,235,192,213,288,197.3C384,181,480,171,576,181.3C672,192,768,224,864,240C960,256,1056,256,1152,234.7C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
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
              onClick={() => setIsLoginOpen(true)}
              className="px-3 py-2.5 rounded-full w-40 text-blue-700 font-medium bg-gradient-to-br from-blue-400/60 via-teal-300/40 to-blue-500/60 shadow-lg hover:shadow-cyan-500/40 transition-all duration-500 cursor-pointer"
            >
              Login
            </button>

            <button
              onClick={scrollToCards}
              className="px-3 py-2.5 w-40 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm rounded-full font-medium shadow-md hover:from-blue-700 hover:to-teal-600 transition-all duration-300 cursor-pointer"
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
          navigate("/fish/aspiring-farmer");
        }}
      />
    </section>
  );
};

export default Hero;
