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
      icon: <Sprout className="text-teal-400" size={28} />,
      btn: "Join as Aspiring Farmer",
      role: "aspiring-farmer",
    },
    {
      title: "Fish Farmer",
      desc: "Access intelligent farm analytics, disease prediction, and sustainable practices.",
      icon: <Fish className="text-teal-400" size={28} />,
      btn: "Join as Fish Farmer",
      role: "farmer",
    },
    {
      title: "Buyer / Seller",
      desc: "Engage in transparent digital trade connecting verified suppliers and buyers.",
      icon: <ShoppingBag className="text-teal-400" size={28} />,
      btn: "Join as Buyer / Seller",
      role: "buyer",
    },
  ];

  return (
    <section
      id="join-cards"
      className="relative py-20 bg-slate-900 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          New to <span className="text-teal-400">FiSH</span>?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-slate-400 mb-12 max-w-2xl mx-auto"
        >
          Join as an aspiring farmer, fish farmer, or marketplace trader and
          explore a smarter, sustainable future for aquaculture.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {cards.map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col items-center justify-between shadow-md hover:shadow-lg transition-all duration-300"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-700 mb-4">
                {card.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-white text-center mb-2">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-slate-400 text-sm text-center mb-6 leading-relaxed">
                {card.desc}
              </p>

              {/* Button */}
              <button
                onClick={() => {
                  setSelectedRole(card.role);
                  setShowModal(true);
                }}
                className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded-lg font-medium shadow-md transition"
              >
                {card.btn}
              </button>
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