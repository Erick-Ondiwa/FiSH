import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Waves } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 text-white py-10 mt-0 overflow-hidden shadow-inner">
      {/* Subtle Wave Accent */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180 opacity-60">
        <svg
          className="relative block w-full h-8"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#f9fafb"
            d="M0,64L48,85.3C96,107,192,149,288,149.3C384,149,480,107,576,122.7C672,139,768,213,864,208C960,203,1056,117,1152,74.7C1248,32,1344,32,1392,32L1440,32L1440,0L0,0Z"
          />
        </svg>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 grid md:grid-cols-3 gap-8 relative z-10">
        {/* Brand Section */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Waves className="text-blue-300" size={26} />
            <h3 className="text-2xl font-bold tracking-wide text-blue-100">
              FiSH
            </h3>
          </div>
          <p className="text-blue-200 text-sm leading-relaxed">
            Farmers & Fishermen Intelligent Support Hub — promoting sustainable aquaculture,
            smart fish farming, and eco-friendly fishing practices aligned with
            <span className="text-blue-400 font-medium"> SDG 14: Life Below Water</span>.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-blue-100">Quick Links</h4>
          <ul className="space-y-2 text-blue-200">
            <li><a href="#home" className="hover:text-blue-400 transition">Home</a></li>
            <li><a href="#about" className="hover:text-blue-400 transition">About</a></li>
            <li><a href="#features" className="hover:text-blue-400 transition">Features</a></li>
            <li><a href="#contact" className="hover:text-blue-400 transition">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-blue-100">Contact Us</h4>
          <ul className="space-y-3 text-blue-200 text-sm">
            <li className="flex items-center space-x-2">
              <Mail size={18} /> <span>support@fishhub.org</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone size={18} /> <span>+254 757 096 101</span>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin size={18} /> <span>Kisumu, Kenya</span>
            </li>
          </ul>

          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-blue-300 transition"><Facebook size={20} /></a>
            <a href="#" className="hover:text-blue-300 transition"><Twitter size={20} /></a>
            <a href="#" className="hover:text-blue-300 transition"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-6xl mx-auto border-t border-blue-800 mt-8"></div>

      {/* Copyright */}
      <div className="text-center text-blue-300 text-sm mt-4 px-4">
        © {new Date().getFullYear()} <span className="font-semibold text-blue-200">FiSH</span> Farmers & Fishermen Intelligent Support Hub. <br />
        Built by <span className="text-blue-400 font-medium">Erick Ondiwa</span> | Maseno University.
      </div>
    </footer>
  );
};

export default Footer;
