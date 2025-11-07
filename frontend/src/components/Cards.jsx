import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Fish, ShoppingBag, X } from "lucide-react";
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
      className="relative py-20 bg-gradient-to-b from-blue-20 via-blue-50 to-blue-100 overflow-hidden"
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
            <div
              key={i}
              className="bg-gradient-to-br from-blue-50 via-white to-blue-100 shadow-xl rounded-2xl p-8 w-80 border border-blue-100 hover:-translate-y-2 hover:shadow-2xl transition transform duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mx-auto mb-4">
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm mb-6">{card.desc}</p>
              <button
                onClick={() => {
                  setSelectedRole(card.role);
                  setShowModal(true);
                  console.log(card.role)
                }}
                className="px-5 py-2 bg-blue-700 text-white text-sm rounded-full font-medium hover:bg-blue-800 transition cursor-pointer"
              >
                {card.btn}
              </button>
            </div>
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
