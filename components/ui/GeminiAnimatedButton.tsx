import React from "react";
import { motion } from "framer-motion";

/**
 * A reusable button component with animated borders.
 * The animation consists of two lines with sparkles that cycle
 * infinitely around the button's rounded border.
 */
export const AnimatedBorderButton = ({
  children,
  onClick,
  variant,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "destructive" | "primary" | "optionsBar";
}) => {
  return (
    // The main container div. It establishes a relative positioning context,
    // applies padding to create the border thickness, sets up a background gradient,
    // and uses overflow-hidden to clip the rotating gradients to the rounded border shape.
    <div
      className={`relative w-full max-md:min-w-screen p-[2px] overflow-hidden bg-gradient-to-b from-[#3a2d6a] via-[#1e124d] to-[#120c2c] md:hover:scale-105 md:hover:saturate-150 md:hover:brightness-125 cursor-pointer ${
        variant === "destructive" ? "hue-rotate-90" : "hue-rotate-0"
      } ${variant === "optionsBar" ? "rounded-none" : "rounded-2xl"}`}
      onClick={onClick}
    >
      {/* Container for the animated gradient elements. This is positioned absolutely
          to sit behind the main content. */}
      <div className="absolute inset-0 z-0">
        {/* First animated line. This is a very large div that is rotated.
            The conic-gradient is mostly transparent, with a thin slice of color
            that creates the appearance of a line with sparkles. */}
        <motion.div
          className="absolute start-0 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%]"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{
            background: `conic-gradient(
              from 90deg,
              transparent 0%,
              transparent 96%,
              white 96.5%,
              #6145D0 97%,
              #6B4AEF 98%,
              #42308E 99%,
              white 99.5%,
              transparent 100%
            )`,
          }}
        />

        {/* Second animated line. It's identical to the first but starts at the
            opposite side (270deg) and has a negative delay to be out of sync,
            creating the two-line effect. */}
        <motion.div
          className="absolute start-0 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] rotate-180"
          animate={{ rotate: 360 }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
            // delay: 5,
          }} // Offset by half the duration
          style={{
            background: `conic-gradient(
              from 270deg,
              transparent 0%,
              transparent 96%,
              white 96.5%,
              #a855f7 97%,
              #ec4899 98%,
              #a855f7 99%,
              white 99.5%,
              transparent 100%
            )`,
          }}
        />
      </div>

      {/* The inner div that holds the button's content.
          It has its own background to mask the center of the rotating gradients.
          The border radius is slightly smaller than the parent to fit snugly inside the border. */}
      <div
        className={`relative z-10 flex items-center justify-center w-full  text-xl font-light text-white bg-[#110f1a] overflow-x-scroll ${
          variant === "optionsBar"
            ? "rounded-none horizontal-list p-2"
            : "rounded-2xl px-4 py-2"
        }`}
      >
        {children}
      </div>
    </div>
  );
};
