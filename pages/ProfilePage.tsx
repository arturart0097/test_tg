import {
  ArrowLeft,
  ChevronRight,
  Edit,
  Edit2,
  Settings,
  SettingsIcon,
} from "lucide-react"

import { AnimatedBorderButton } from "@/components/ui/GeminiAnimatedButton"
import Button from "../components/ui/Button"
import React from "react"
import YGradientCard from "@/components/YGradientCard"
import { useInventory } from "../contexts/InventoryContext"
import { useNavigate } from "react-router-dom"
import { useUser } from "../contexts/UserContext"

const ProfilePage: React.FC = () => {
  const { user, loading } = useUser()
  const { powerPoints } = useInventory()
  const navigate = useNavigate()

  // if (loading) {
  //   return <div className="text-center">Loading profile...</div>;
  // }

  // if (!user) {
  //   return (
  //     <div className="text-center">Please log in to view your profile.</div>
  //   );
  // }

  // const user = {
  //   prism: {
  //     avatar_id: "../assets/login-header.png",
  //     username: "Tester",
  //   },
  //   wallet: {
  //     address: "0xtest",
  //   },
  // };

  return (
    <div className="max-w-md mx-auto text-center space-y-8">
      {/* <h1 className="text-3xl font-orbitron tracking-widest font-bold">
        My Profile
      </h1> */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-800 transition"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-3xl font-orbitron tracking-widest font-bold">
            Profile
          </h1>
        </div>
        <div className="flex gap-4 items-center justify-between md:hidden">
          <button
            onClick={() => navigate("/profile/edit")}
            className="  text-white p-2 rounded-full hover:bg-purple-700 transition "
          >
            <Edit className="size-6" />
          </button>
          <button
            onClick={() => navigate("/profile/settings")}
            className=" text-white p-2 rounded-full hover:bg-purple-700 transition "
          >
            <SettingsIcon className="size-6" />
          </button>
        </div>
      </div>
      <div className="relative inline-block">
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-50"></div>
        <div className="relative size-60  bg-indigo-600/20 rounded-full flex items-center justify-center">
          <div className="relative size-48  bg-indigo-600/20 rounded-full flex items-center justify-center">
            <div className="relative size-36   rounded-full flex items-center justify-center">
              <img
                src={`/assets/avatars/PFP_${user?.prism?.avatar_id}.png`}
                alt="User Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <button
              onClick={() => navigate("/profile/edit")}
              className="absolute top-2 right-2 bg-white text-black p-2 rounded-full hover:bg-purple-700 transition max-md:hidden"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <h1 className="text-3xl font-orbitron font-bold tracking-widest ">
          {user?.prism?.username}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/profile/settings")}
            className="text-gray-400 hover:text-white transition max-md:hidden"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <YGradientCard>
          <div className=" text-left flex justify-between items-center">
            <div>
              <p className="text-base font-light text-white">
                Connected Wallet
              </p>
              <p className="font-mono text-xs truncate text-gray-500 font-extralight">
                {user?.wallet?.address || "No wallet connected"}
              </p>
            </div>
            <ChevronRight
              size={32}
              className=" text-white bg-purple-500 p-2 rounded-xl cursor-pointer min-w-10"
            />
          </div>
        </YGradientCard>

        <YGradientCard>
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 p-2 space-y-4 shadow-lg backdrop-blur-sm">
            <div>
              <div className="text-sm text-gray-500 w-full text-left">
                Balance
              </div>
              <div className="flex justify-between items-baseline font-orbitron">
                <div>
                  <p className="text-2xl font-bold">
                    $0{" "}
                    <span className="text-base text-gray-400 font-normal">
                      Gas
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {powerPoints.toLocaleString()}{" "}
                    <span className="text-base text-gray-400 font-normal">
                      Powerpoints
                    </span>
                  </p>
                </div>
              </div>
              <div className="w-full flex flex-col max-w-lg space-y-2 p-6">
                <AnimatedBorderButton>Buy Coins</AnimatedBorderButton>
                <AnimatedBorderButton>Earn Powerpoints</AnimatedBorderButton>
              </div>
            </div>
          </div>
        </YGradientCard>
      </div>
    </div>
  )
}

export default ProfilePage
