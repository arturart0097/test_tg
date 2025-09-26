import { ArrowLeft, Copy, UploadIcon } from "lucide-react"
import React, { useState } from "react"

import { AnimatedBorderButton } from "@/components/ui/GeminiAnimatedButton"
import Button from "../components/ui/Button"
import { useNavigate } from "react-router-dom"
import { useUser } from "../contexts/UserContext"

const EditProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useUser()
  const navigate = useNavigate()

  // const user = {
  //   prism: {
  //     avatar_id: "../assets/login-header.png",
  //     username: "Tester",
  //     bio: "bio name",
  //     id: "id",
  //   },
  //   wallet: {
  //     address: "0xtest",
  //   },
  //   id: "iduser",
  // };
  const [username, setUsername] = useState(user?.prism?.username || "")
  const [bio, setBio] = useState(user?.prism?.bio || "")

  // if (!user) {
  //   return null;
  // }

  const handleSaveChanges = () => {
    updateUserProfile({ username, bio }).then(() => {
      navigate("/profile")
    })
  }

  const referralCode = user.prism?.id || user.id

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode)
    // Add toast notification here
  }

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-800 transition"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-3xl font-orbitron font-bold tracking-widest">
          Edit Profile
        </h1>
      </div>
      <div className="grid w-full items-center">
        <div className="mx-auto">
          <div className="relative inline-block  ">
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
              </div>
              <button
                onClick={() => navigate("/profile/edit")}
                className="absolute bottom-6 left-1/2 -translate-x-1/2  bg-white text-black p-2 rounded-full hover:bg-purple-700 transition"
              >
                <UploadIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            maxLength={16}
            className="w-full bg-gray-900/70 border border-gray-700 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
          />
          <p className="text-right text-xs text-gray-400 mt-1">
            {username.length}/16 characters, min 4
          </p>
        </div>
        <div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Your gamer bio..."
            maxLength={255}
            rows={3}
            className="w-full bg-gray-900/70 border border-gray-700 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-purple-500 focus:outline-none transition resize-none"
          />
          <p className="text-right text-xs text-gray-400 mt-1">
            {bio.length}/255 characters
          </p>
        </div>
        <div className="relative">
          <input
            type="text"
            readOnly
            value={referralCode}
            className="w-full bg-gray-900/70 border border-gray-700 rounded-2xl py-3 px-4 pr-12 font-mono"
          />
          <button
            onClick={copyToClipboard}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* <Button onClick={handleSaveChanges} className="w-full">
      </Button> */}
      <AnimatedBorderButton>Save Changes</AnimatedBorderButton>
    </div>
  )
}

export default EditProfilePage
