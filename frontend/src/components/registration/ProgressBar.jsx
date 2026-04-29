import React from "react";

const ProgressBar = ({ step, total }) => {
  const pct = Math.round(((step - 1) / (total - 1)) * 100);
  return (
    <div className="w-full">
      <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
        <div
          className="h-2 bg-gradient-to-r from-green-500 to-green-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-blue-100 mt-2">
        <span className="text-black">Step {step} of {total}</span>
        <span className="text-black">{pct}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
