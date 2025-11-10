import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Fish, ShoppingBag } from "lucide-react";
import RegistrationModal from "./registration/RegistrationModal";

const JoinCards = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const cards = [
    {
      title: "Aspiring Farmer",
      desc: "Kickstart your aquaculture journey with expert mentorship and digital learning tools.",
      icon: <Sprout className="text-blue-700" size={28} />,
      btn: "Join as Aspiring Farmer",
      role: "aspiring-farmer",
    },
    {
      title: "Fish Farmer",
      desc: "Access intelligent farm analytics, disease prediction, and sustainable practices.",
      icon: <Fish className="text-blue-700" size={28} />,
      btn: "Join as Fish Farmer",
      role: "farmer",
    },
    {
      title: "Buyer / Seller",
      desc: "Engage in transparent digital trade connecting verified suppliers and buyers.",
      icon: <ShoppingBag className="text-blue-700" size={28} />,
      btn: "Join as Buyer / Seller",
      role: "buyer",
    },
  ];

  return (
    <section
      id="join-cards"
      className="relative py-20 bg-gradient-to-br from-blue-900/40 via-blue-700/30 to-teal-600/20 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-blue-900 mb-4"
        >
          New to <span className="text-blue-700">FiSH</span>?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-700 mb-12 max-w-2xl mx-auto"
        >
          Join us as an aspiring farmer, fish farmer, or marketplace trader and
          explore a smarter, sustainable future for aquaculture.
        </motion.p>

        {/* Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap justify-center gap-8"
        >
          {cards.map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative group p-[1px] rounded-3xl w-80 bg-gradient-to-br from-blue-400/60 via-teal-300/40 to-blue-500/60 shadow-lg hover:shadow-cyan-500/40 transition-all duration-500"
            >
              {/* Inner glass layer */}
              <div className="rounded-3xl p-8 bg-white/10 backdrop-blur-xl border border-white/20 h-full flex flex-col items-center justify-between transition-all duration-500 group-hover:bg-white/20">
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400/40 to-blue-500/40 border border-white/30 shadow-md mb-4">
                  {card.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white text-center mb-2 drop-shadow-sm">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-blue-900 text-sm text-center font-roboto leading-relaxed mb-6">
                  {card.desc}
                </p>

                {/* Button */}
                <button
                  onClick={() => {
                    setSelectedRole(card.role);
                    setShowModal(true);
                    console.log("Selected role:", card.role);
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm rounded-full font-medium shadow-md hover:from-blue-700 hover:to-teal-600 transition-all duration-300 cursor-pointer"
                >
                  {card.btn}
                </button>
              </div>

              {/* Glow effect — now non-blocking */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 blur-3xl bg-gradient-to-br from-blue-400/30 via-cyan-300/20 to-teal-500/30 transition-all duration-500 pointer-events-none"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {showModal && (
          <RegistrationModal
            selectedRole={selectedRole}
            open={showModal}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default JoinCards;
