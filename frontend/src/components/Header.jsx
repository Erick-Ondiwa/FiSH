import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../assets/FiSH-logo.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-slate-900 border-b border-slate-800">
      
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="FiSH Logo" className="w-32 object-contain" />
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          {["Home", "About", "Features", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="hover:text-white transition"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-slate-300 hover:text-white"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900">
          <nav className="flex flex-col px-6 py-4 space-y-4 text-slate-300">
            {["Home", "About", "Features", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="hover:text-white transition"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;