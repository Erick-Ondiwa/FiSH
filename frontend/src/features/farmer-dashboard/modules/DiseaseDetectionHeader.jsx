import { Stethoscope, AlertTriangle, Microscope, Activity } from "lucide-react";

const DiseaseDetectionHeader = () => {
  return (
    <div className="w-full bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 px-6 md:px-10 py-7">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* LEFT: TITLE + CONTEXT */}
        <div className="flex items-center gap-4">

          {/* ICON */}
          <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
            <Stethoscope size={24} />
          </div>

          {/* TEXT */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Microscope size={16} className="text-teal-400" />
              <span className="text-xs uppercase tracking-wider text-teal-400 font-semibold">
                AI Diagnostic
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Disease Detection
            </h1>

            <p className="mt-1 text-sm text-slate-400 max-w-xl">
              Identify potential fish diseases using symptoms, environmental conditions, and intelligent analysis.
            </p>
          </div>
        </div>

        {/* RIGHT: STATUS PANEL */}
        <div className="hidden md:flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">
          <Activity size={18} className="text-teal-400" />
          <div className="text-sm text-slate-300 flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-400" />
            Risk Analysis Enabled
          </div>
        </div>

      </div>
    </div>
  );
};

export default DiseaseDetectionHeader;