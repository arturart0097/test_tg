import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Fix: Correctly type props for a motion component to avoid conflicts.
// The original `React.ButtonHTMLAttributes<HTMLButtonElement>` has properties like `onDrag`
// that conflict with framer-motion's gesture props. Using `React.ComponentProps<typeof motion.button>`
// provides the correct types for `motion.button`, including both standard attributes and motion props.
interface ButtonProps extends React.ComponentProps<typeof motion.button> {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "danger"
    | "yGradient"
    | "gradientBorder"
    | "hoverBorder"
    | "animatedGradient"
    | "invertColor"
    | "hoverBorderGradient"
    | "ghost"
    | "ghostActive";
  duration?: number;
  clockwise?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  // Common base classes for most variants
  const baseClasses =
    "relative font-bold py-3 px-6 rounded-full overflow-hidden transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black";

  // Variant-specific classes
  const variantClasses: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white focus:ring-indigo-500 shadow-lg shadow-purple-500/20",
    secondary:
      "bg-gray-800/80 border border-gray-600 hover:bg-gray-700/80 text-white focus:ring-gray-500",
    tertiary:
      "bg-gradient-to-tr from-pink-400 to-fuchsia-400 hover:from-pink-500 hover:to-fuchsia-500 text-white focus:ring-fuchsia-700 shadow-lg shadow-fuchsia-500/20",
    danger:
      "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white focus:ring-red-500 shadow-lg shadow-red-500/20",
    yGradient:
      "px-8 py-2 rounded-full relative bg-purple-400/10 text-gray-200 font-bold text-base hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600",
    gradientBorder: "p-[3px] relative rounded-lg",
    hoverBorder:
      "bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block",
    animatedGradient:
      "relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",
    invertColor:
      "px-8 py-2 rounded-md bg-gray-400 text-black font-light transition duration-200 hover:bg-gray-500 hover:text-white border-2 border-transparent hover:border-gray-500",
    ghost: "text-gray-400 focus:ring-indigo-500 ",
    ghostActive: "text-white hover:underline focus:text-white",
  };

  // Render logic for each variant
  if (variant === "hoverBorderGradient") {
    type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";
    const [hovered, setHovered] = useState<boolean>(false);
    const [direction, setDirection] = useState<Direction>("TOP");
    const rotateDirection = (currentDirection: Direction): Direction => {
      const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
      const currentIndex = directions.indexOf(currentDirection);
      const nextIndex =
        props.clockwise ?? true
          ? (currentIndex - 1 + directions.length) % directions.length
          : (currentIndex + 1) % directions.length;
      return directions[nextIndex];
    };
    const movingMap: Record<Direction, string> = {
      TOP: "radial-gradient(20.7% 50% at 50% 0%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
      LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
      BOTTOM:
        "radial-gradient(20.7% 50% at 50% 100%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
      RIGHT:
        "radial-gradient(16.2% 41.199999999999996% at 100% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    };
    const highlight =
      "radial-gradient(75% 181.15942028985506% at 50% 50%, #3275F8 0%, rgba(255, 255, 255, 0) 100%)";
    useEffect(() => {
      if (!hovered) {
        const interval = setInterval(() => {
          setDirection((prevState) => rotateDirection(prevState));
        }, (props.duration ?? 1) * 1000);
        return () => clearInterval(interval);
      }
    }, [hovered]);
    return (
      <motion.button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`relative flex rounded-full border content-center bg-black/20 hover:bg-black/10 transition duration-500 dark:bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit ${className}`}
        {...props}
      >
        <div className="w-auto text-white z-10 bg-black px-4 py-2 rounded-[inherit]">
          {children}
        </div>
        <motion.div
          className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
          style={{
            filter: "blur(2px)",
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
          initial={{ background: movingMap[direction] }}
          animate={{
            background: hovered
              ? [movingMap[direction], highlight]
              : movingMap[direction],
          }}
          transition={{ ease: "linear", duration: props.duration ?? 1 }}
        />
        <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]" />
      </motion.button>
    );
  }
  if (variant === "yGradient") {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${variantClasses[variant]} ${className}`}
        {...props}
      >
        <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-2xl bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        <div className="absolute inset-x-0 h-px w-1/2 mx-auto -bottom-px shadow-2xl bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        <span className="relative z-20">{children}</span>
      </motion.button>
    );
  }

  if (variant === "gradientBorder") {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${variantClasses[variant]} ${className}`}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
        <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
          {children}
        </div>
      </motion.button>
    );
  }

  if (variant === "hoverBorder") {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${variantClasses[variant]} ${className}`}
        {...props}
      >
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </span>
        <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
          {children}
        </div>
        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
      </motion.button>
    );
  }

  if (variant === "animatedGradient") {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${variantClasses[variant]} ${className}`}
        {...props}
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
          {children}
        </span>
      </motion.button>
    );
  }

  if (variant === "invertColor") {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </motion.button>
    );
  }

  // Default: original variants
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`group ${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {variant === "primary" && (
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),rgba(255,255,255,0))] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ y: "100%" }}
            animate={{ y: "-100%" }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
        </div>
      )}
    </motion.button>
  );
};

export default Button;
