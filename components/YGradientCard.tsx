import { motion } from "framer-motion";

export default function YGradientCard({
  children,
  props,
  className,
}: {
  children: React.ReactNode;
  props?: HTMLDivElement;
  className?: string;
}) {
  const baseClasses =
    "px-2 py-2 rounded-2xl relative bg-gray-900/70 text-gray-200 font-bold text-base hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600/30";
  return (
    <motion.div
      //   whileHover={{ scale: 1.05 }}
      //   whileTap={{ scale: 0.95 }}
      className={`${baseClasses} `}
      {...(props as any)}
    >
      <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-2xl bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <div className="absolute inset-x-0 h-px w-1/2 mx-auto -bottom-px shadow-2xl bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <span className={`relative z-20 ${className}`}>{children}</span>
    </motion.div>
  );
}
