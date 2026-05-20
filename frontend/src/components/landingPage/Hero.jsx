import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import heroImg from "../../assets/hero-bg.jpg";
import JoinCards from "./Cards";
import LoginModal from "../auth/LoginModal";

const Hero = () => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const scrollToCards = () => {
    document.getElementById("join-cards")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="w-full min-h-screen bg-slate-900 pt-20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* MAIN HERO */}
        <div className="grid md:grid-cols-2 gap-10 items-center min-h-[70vh]">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Your Number One 
              <span className="block text-teal-400">
                Aquaculture Companion
              </span>
            </h1>

            <p className="text-slate-400 text-lg max-w-lg">
              Empowering fish farmers and aquaculture professionals with
              data-driven insights, feeding intelligence, and disease diagnostics.
            </p>

            <div className="flex gap-4 pt-2">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition"
              >
                Login
              </button>

              <button
                onClick={scrollToCards}
                className="px-5 py-2.5 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 rounded-lg transition"
              >
                Get Started
              </button>
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <img
                src={heroImg}
                alt="Fish farming"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* JOIN SECTION */}
        <div id="join-cards" className="mt-0">
          <JoinCards />
        </div>
      </div>

      {/* LOGIN MODAL */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(user) => {
          setIsLoginOpen(false);
          navigate("/dashboard");
        }}
      />
    </section>
  );
};

export default Hero;