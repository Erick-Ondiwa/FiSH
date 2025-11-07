import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../assets/hero-bg.jpg"; // Replace with your FiSH logo

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 
                 border-b border-white/20 shadow-md transition-all duration-500"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6 md:px-12">
        {/* Logo + Brand */}
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="FiSH Logo"
            className="w-10 h-10 object-contain drop-shadow-sm"
          />
          <h1 className="text-2xl font-extrabold text-white-800 tracking-tight">
            FiSH
            <span className="block text-xs text-white-600 font-medium">
              Intelligent Support Hub
            </span>
          </h1>
        </div>

        {/* Desktop Navbar */}
        <nav className="hidden md:flex space-x-10 text-white-800 font-medium">
          {[
            { name: "Home", link: "#home" },
            { name: "About", link: "#about" },
            { name: "Features", link: "#features" },
            { name: "Contact", link: "#contact" },
          ].map((item, i) => (
            <a
              key={i}
              href={item.link}
              className="relative group text-base tracking-wide transition"
            >
              {item.name}
              <span
                className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 
                           transition-all duration-300 group-hover:w-full"
              ></span>
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-blue-800 focus:outline-none"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden bg-white/90 backdrop-blur-lg border-t border-blue-100 
                     shadow-lg transition-all duration-300"
        >
          <nav className="flex flex-col space-y-5 px-6 py-5 text-blue-800 font-medium">
            <a href="#home" onClick={toggleMenu} className="hover:text-blue-600">Home</a>
            <a href="#about" onClick={toggleMenu} className="hover:text-blue-600">About</a>
            <a href="#features" onClick={toggleMenu} className="hover:text-blue-600">Features</a>
            <a href="#contact" onClick={toggleMenu} className="hover:text-blue-600">Contact</a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
