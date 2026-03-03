import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../assets/FiSH-logo.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-2xl 
                bg-gradient-to-br from-[#003C71]/90 via-[#0077B6]/80 to-[#00B4D8]/90 
                border-b border-cyan-200/30 shadow-lg shadow-cyan-900/20 
                transition-all duration-500"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6 md:px-12">
        {/* Logo + Brand */}
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="FiSH Logo"
            className="w-40  object-contain drop-shadow-md "
          />
          {/* <h1 className="text-2xl font-extrabold text-white tracking-tight">
            FiSH
            <span className="block text-xs text-cyan-100 font-medium">
              Intelligent Support Hub
            </span>
          </h1> */}
        </div>

        {/* Desktop Navbar */}
        <nav className="hidden md:flex space-x-10 text-cyan-50 font-medium">
          {[
            { name: "Home", link: "#home" },
            { name: "About", link: "#about" },
            { name: "Features", link: "#features" },
            { name: "Contact", link: "#contact" },
          ].map((item, i) => (
            <a
              key={i}
              href={item.link}
              className="relative group text-base tracking-wide transition cursor-pointer"
            >
              {item.name}
              <span
                className="absolute left-0 bottom-0 w-0 h-[2px] 
                          bg-gradient-to-r from-cyan-300 to-blue-400 
                          transition-all duration-300 group-hover:w-full"
              ></span>
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-cyan-100 hover:text-cyan-300 transition"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden bg-gradient-to-br from-cyan-50/90 via-blue-50/80 to-cyan-100/90 
                    backdrop-blur-xl border-t border-cyan-200 shadow-lg transition-all duration-300"
        >
          <nav className="flex flex-col space-y-5 px-6 py-5 text-blue-900 font-medium">
            <a href="#home" onClick={toggleMenu} className="hover:text-cyan-600 cursor-pointer">Home</a>
            <a href="#about" onClick={toggleMenu} className="hover:text-cyan-600 cursor-pointer">About</a>
            <a href="#features" onClick={toggleMenu} className="hover:text-cyan-600 cursor-pointer">Features</a>
            <a href="#contact" onClick={toggleMenu} className="hover:text-cyan-600 cursor-pointer">Contact</a>
          </nav>
        </div>
      )}
    </header>

  );
};

export default Header;
