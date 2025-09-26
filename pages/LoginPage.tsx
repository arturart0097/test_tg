import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail } from "lucide-react";
import YGradientCard from "@/components/YGradientCard";
import Button from "@/components/ui/Button";
import {
  usePrivy,
  useLoginWithOAuth,
  useLoginWithEmail,
} from "@privy-io/react-auth";

const LOGIN_OPTIONS = [
  {
    name: "your@email.com",
    icon: "./assets/mail.svg",
    type: "email",
  },
  {
    name: "Google",
    icon: "./assets/google.svg",
    type: "google",
  },
  {
    name: "XTwitter",
    icon: "./assets/x.svg",
    type: "twitter",
  },
  {
    name: "Discord",
    icon: "./assets/discord.svg",
    type: "discord",
  },
  {
    name: "Apple",
    icon: "./assets/apple.svg",
    type: "apple",
  },
];

const LoginPage: React.FC = () => {
  const { login } = usePrivy();
  const { initOAuth } = useLoginWithOAuth();
  const { sendCode } = useLoginWithEmail();

  function loginWithPrivy(provider: string) {
    if (provider === "email") {
      login({ loginMethods: ["email"] });
    } else {
      initOAuth({ provider: provider as any });
    }
  }
  return (
    <div className=" flex flex-col items-center justify-center h-[80%] min-h-screen p-4">
      <video
        loop
        autoPlay
        muted
        height={200}
        width={200}
        className="mix-blend-multiply mb-10 rounded-full bg-cover"
      >
        <source src="./assets/prism.mp4"></source>
      </video>
      <div className="text-center  bg-gray-600/20 rounded-2xl px-6 py-10 mx-auto max-w-4xl w-full">
        <h1 className="text-4xl md:text-6xl pb-10  font-orbitron font-extrabold tracking-wide">
          Log in or Sign up
        </h1>

        <div className="space-y-4 flex flex-col items-center justify-center mx-auto max-w-md">
          {LOGIN_OPTIONS.map((item, index) => (
            <Button
              key={index}
              variant="yGradient"
              className="w-full"
              onClick={() => loginWithPrivy(item.type)}
            >
              <div className="flex flex-row gap-4">
                <img src={item.icon} alt={item.name} />
                <span>{item.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
