import React from "react";
import { useNavigate } from "react-router-dom";
import { Fish } from "lucide-react";
import LoginModal from "../components/auth/LoginModal";

const ContinueSetupPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex items-center justify-center px-4 md:px-8 relative overflow-hidden">

      {/* =========================
          BACKGROUND GLOW
      ========================= */}
      <div className="absolute inset-0">
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-teal-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-emerald-500/10 blur-3xl rounded-full" />
      </div>

      {/* =========================
          MAIN CONTAINER
      ========================= */}
      <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 rounded-3xl border border-slate-700 bg-slate-900/70 backdrop-blur-xl shadow-2xl overflow-hidden">

        {/* =========================
            LEFT PANEL
        ========================= */}
        <div className="hidden md:flex flex-col justify-center p-10 border-r border-slate-700">

          {/* ICON */}
          <div className="w-14 h-14 rounded-xl bg-teal-500/10 flex items-center justify-center mb-6">
            <Fish className="text-teal-400" size={28} />
          </div>

          {/* TITLE */}
          <h1 className="text-3xl font-bold leading-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Login to Procede
          </h1>

          {/* DESCRIPTION */}
          <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-sm">
            Sign in to procede to your main dashboard
          </p>

          {/* STEP INDICATOR */}
          <div className="mt-8 text-xs text-slate-500 uppercase tracking-wider">
            Almost there ...
          </div>
        </div>

        {/* =========================
            RIGHT PANEL
        ========================= */}
        <div className="p-6 md:p-10 flex items-center justify-center">
          <div className="w-full max-w-md">

            {/* MOBILE HEADER */}
            <div className="md:hidden mb-6 text-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Continue Setup
              </h2>
              <p className="text-sm text-slate-700 mt-1">
                Login to proceed
              </p>
            </div>

            {/* LOGIN COMPONENT */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 backdrop-blur-md">
              <LoginModal
                isOpen={true}
                asPage={true}
                onClose={() => {}}
                onLoginSuccess={() => navigate("/dashboard")}
                onRegister={() => navigate("/register")}
              />
            </div>

            {/* FOOTER */}
            <p className="text-xs text-slate-500 text-center mt-4">
              You’ll continue to farm setup after login.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinueSetupPage;