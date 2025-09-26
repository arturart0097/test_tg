import { Link, useNavigate } from "react-router-dom"

import Button from "../ui/Button"
import React from "react"
import { User } from "lucide-react"
import { UserPill } from '@privy-io/react-auth/ui'
import { motion } from "framer-motion"
import { usePrivy } from "@privy-io/react-auth"
import { useUser } from "../../contexts/UserContext"

const Header: React.FC = () => {
  const { ready, authenticated, login } = usePrivy()
  const { user } = useUser()
  const navigate = useNavigate()

  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 container mx-auto">
      <div className="flex justify-between items-center">
        <Link to="/">
          <h1 className="text-3xl font-orbitron font-bold tracking-wider">
            PRISM
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          {ready &&
            (authenticated ? (
              <>
                <nav className="hidden md:flex gap-6 items-center">
                  <Link to="/inventory">
                    <Button variant="tertiary" className="w-44">
                      Inventory
                    </Button>
                  </Link>
                </nav>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
                  >
                    {user?.prism?.avatar_id ? (
                      <img
                        src={`/assets/avatars/PFP_${user.prism.avatar_id}.png`}
                        alt="User avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </>
            ) : (
              <motion.button
                onClick={login}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="font-bold py-2 px-6 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 transition"
              >
                Login
              </motion.button>
            ))}
        </div>
      </div>
    </header>
  )
}

export default Header
