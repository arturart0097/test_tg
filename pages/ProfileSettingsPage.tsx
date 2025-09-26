import React from "react";
import { useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { ArrowLeft } from "lucide-react";
import ToggleSwitch from "../components/ui/ToggleSwitch";
import Button from "../components/ui/Button";
import { AnimatedBorderButton } from "@/components/ui/GeminiAnimatedButton";

const ProfileSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = usePrivy();

  const handleSignOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-800 transition"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-3xl font-orbitron font-bold">Profile Settings</h1>
      </div>

      <div className=" py-6 backdrop-blur-sm ">
        <ToggleSwitch
          label="Challenge of the day announcement"
          initialChecked={true}
        />
        <ToggleSwitch label="Jackpot winners" initialChecked={true} />
        <ToggleSwitch label="Challenges you've joined" initialChecked={true} />
        <ToggleSwitch label="Challenges your friends have joined" />
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <AnimatedBorderButton>Save Changes</AnimatedBorderButton>
        <AnimatedBorderButton onClick={() => handleSignOut()}>
          Sign Out
        </AnimatedBorderButton>
        <AnimatedBorderButton variant="destructive">
          Delete My Account
        </AnimatedBorderButton>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
