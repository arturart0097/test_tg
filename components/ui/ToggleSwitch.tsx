import React, { useState } from "react";

import { motion } from "framer-motion";

interface ToggleSwitchProps {
  label: string;
  initialChecked?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  initialChecked = false,
}) => {
  const [isOn, setIsOn] = useState(initialChecked);

  const toggleSwitch = () => setIsOn(!isOn);

  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-lg text-gray-300">{label}</span>
      <div
        onClick={toggleSwitch}
        className={`flex relative items-center w-10 h-4 rounded-full border border-gray-700 cursor-pointer transition-colors duration-300 ${
          isOn ? "bg-pink-500/30 justify-end" : "bg-gray-700/10 justify-start"
        }`}
      >
        <div className="absolute inset-x-0 h-px w-3/4 mx-auto -top-px shadow-2xl bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        <div className="absolute inset-x-0 h-px w-3/4 mx-auto -bottom-px shadow-2xl bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        <span className={`relative z-20 `}>
          <motion.div
            className={`${
              isOn ? "bg-pink-200" : "bg-white"
            } size-2.5 rounded-full shadow-md`}
            layout
            transition={{ type: "spring", stiffness: 700, damping: 30 }}
          />
        </span>
      </div>
    </div>
  );
};

export default ToggleSwitch;
