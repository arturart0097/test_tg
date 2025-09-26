import { Rocket, Ticket } from "lucide-react"

import { Game } from "../types"
import { Link } from "react-router-dom"
import React from "react"
import YGradientCard from "./YGradientCard"
import { motion } from "framer-motion"

interface GameCardProps {
  game: Game
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const slug = game.title.replace(/\s+/g, "")
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <YGradientCard className="backdrop-blur-sm group">
        <Link to={`/games/${slug}`} className="block">
          <div className="relative aspect-video">
            <img
              src={game.image}
              alt={game.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-2xl"
              style={{ aspectRatio: "16/9" }}
            />
            <div className="absolute top-2 left-2 flex items-center gap-2  hidden">
              <div className="flex items-center gap-1 bg-black/50 p-1.5 rounded-full text-xs">
                <img
                  src="https://picsum.photos/seed/user1/20/20"
                  alt="user"
                  className="w-4 h-4 rounded-full"
                />
                <span>Strength 18/21</span>
              </div>
            </div>
            <div className="absolute top-2 right-2 flex items-center gap-2  hidden">
              <div className="flex items-center gap-1 bg-black/50 p-1.5 rounded-full text-xs">
                <img
                  src="https://picsum.photos/seed/user2/20/20"
                  alt="user"
                  className="w-4 h-4 rounded-full"
                />
                <span>14</span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-orbitron text-2xl font-extrabold truncate">
                {game.title}
              </h3>
              <p className="text-gray-400 text-xs">Created by: {game.author}</p>
            </div>
            <p className="w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent my-1"></p>
            <div className="grid grid-cols-2 justify-between items-center text-sm">
              <div className="space-y-1 text-purple-400">
                <p>Plays</p>
                <span className="text-lg">
                  <Rocket className="size-4 inline-flex" /> {game.plays.toLocaleString()}
                </span>
              </div>
              <div className="space-y-1 text-green-400">
                <p>Entry</p>

                {!game.tournament ?
                  <span>
                    Free
                  </span> :
                  <span>
                    <Ticket className="size-4 inline-flex" /> Tournament Active
                  </span>
                }
              </div>
            </div>
          </div>
        </Link>
      </YGradientCard>
    </motion.div>
  )
}

export default GameCard
