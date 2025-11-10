import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Waves,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-[#001F3F]/95 via-[#004B6E]/90 to-[#00B4D8]/80 
                       text-white py-12 mt-0 overflow-hidden shadow-inner backdrop-blur-2xl">
      {/* Decorative Gradient Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180 opacity-70">
        <svg
          className="relative block w-full h-10"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="rgba(255,255,255,0.25)"
            d="M0,64L48,85.3C96,107,192,149,288,149.3C384,149,480,107,576,122.7C672,139,768,213,864,208C960,203,1056,117,1152,74.7C1248,32,1344,32,1392,32L1440,32L1440,0L0,0Z"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 grid md:grid-cols-3 gap-10 relative z-10">
        {/* Brand Info */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 bg-cyan-500/20 rounded-full backdrop-blur-sm">
              <Waves className="text-cyan-300" size={26} />
            </div>
            <h3 className="text-2xl font-extrabold tracking-wide text-cyan-100">
              FiSH
            </h3>
          </div>
          <p className="text-blue-100/80 text-sm leading-relaxed">
            Farmers & Fishermen Intelligent Support Hub, empowering sustainable
            aquaculture and smart fishing practice.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-cyan-100">
            Quick Links
          </h4>
          <ul className="space-y-2 text-blue-100/80 text-sm">
            {["Home", "About", "Features", "Contact"].map((item, i) => (
              <li key={i}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="hover:text-cyan-400 transition cursor-pointer"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-cyan-100">
            Contact Us
          </h4>
          <ul className="space-y-3 text-blue-100/80 text-sm">
            <li className="flex items-center space-x-2">
              <Mail size={18} className="text-cyan-300" />{" "}
              <span>support@fishhub.org</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone size={18} className="text-cyan-300" />{" "}
              <span>+254 757 096 101</span>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin size={18} className="text-cyan-300" />{" "}
              <span>Kisumu, Kenya</span>
            </li>
          </ul>

          {/* Social Media Icons */}
          <div className="flex space-x-5 mt-5">
            {[Facebook, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2 rounded-full bg-white/10 hover:bg-cyan-500/20 
                           text-cyan-300 transition-all duration-300 cursor-pointer"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-6xl mx-auto border-t border-cyan-200/20 mt-10"></div>

      {/* Copyright */}
      <div className="text-center text-blue-100/80 text-sm mt-5 px-4">
        © {new Date().getFullYear()}{" "}
        <span className="font-bold text-cyan-400">FiSH</span>. {" "}
        <span className="text-cyan-200 font-medium">All Rights Reserved</span>
      </div>

      {/* Floating Glow */}
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl"></div>
    </footer>
  );
};

export default Footer;
