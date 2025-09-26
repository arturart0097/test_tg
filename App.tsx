import { Route, Routes } from "react-router-dom"

import EditProfilePage from "./pages/EditProfilePage"
import GamePage from "./pages/GamePage"
import { GameProvider } from "./contexts/GameContext"
import InventoryPage from "./pages/InventoryPage"
import { InventoryProvider } from "./contexts/InventoryContext"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import MainLayout from "./components/layout/MainLayout"
import { PrivyProvider } from "@privy-io/react-auth"
import ProfilePage from "./pages/ProfilePage"
import ProfileSettingsPage from "./pages/ProfileSettingsPage"
import React from "react"
import { Toaster } from "react-hot-toast"
import { UserProvider } from "./contexts/UserContext"
import { useEnvironment } from "./hooks/useEnvironment"

const privyAppId = "clsp79e8b012fblj9e1qx8t3g"


type AllowedLoginMethod =
  | "line"
  | "sms"
  | "passkey"
  | "email"
  | "wallet"
  | "farcaster"
  | "telegram"
  | "google"
  | "twitter"
  | "discord"
  | "apple"
  | "github"
  | "linkedin"
  | "spotify"
  | "instagram"
  | "tiktok";

const LOGIN_METHODS_TG: AllowedLoginMethod[] = [
  "email",
  "google",
  "twitter",
  "discord",
]

const LOGIN_METHODS_DEFAULT: AllowedLoginMethod[] = [
  "email",
  "wallet",
  "google",
  "twitter",
  "discord",
]

const App: React.FC = () => {
  const { isTelegram } = useEnvironment();

  const loginMethods = isTelegram
    ? LOGIN_METHODS_TG
    : LOGIN_METHODS_DEFAULT;

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        loginMethods,
        appearance: {
          theme: "dark",
          accentColor: "#A855F7",
          logo: "https://your-logo-url.com/logo.png",
        },
        embeddedWallets: {
          showWalletUIs: false
        }
      }}
    >
      <UserProvider>
        <GameProvider>
          <InventoryProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/edit" element={<EditProfilePage />} />
                <Route
                  path="/profile/settings"
                  element={<ProfileSettingsPage />}
                />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/games/:name" element={<GamePage />} />
              </Route>
            </Routes>
            <Toaster />
          </InventoryProvider>
        </GameProvider>
      </UserProvider>
    </PrivyProvider>
  )
}

export default App
