import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  LucideSettings2,
  Search,
} from "lucide-react"
import React, { useMemo, useState } from "react"

import { AnimatedBorderButton } from "@/components/ui/GeminiAnimatedButton"
import Button from "@/components/ui/Button"
import GameCard from "../components/GameCard"
import YGradientCard from "@/components/YGradientCard"
import { useGames } from "../contexts/GameContext"
import { useEnvironment } from "@/hooks/useEnvironment"

const GENRES = [
  "Action",
  "Arcade",
  "Dungeon",
  "Fighters",
  "Puzzle",
  "Shooter",
  "Sports",
]

const LandingPage: React.FC = () => {
  const { games, loading, error } = useGames()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeGenre, setActiveGenre] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const { variant, isTelegram, isMobile, isDesktop } = useEnvironment();


  const filteredGames = useMemo(() => {
    return games
      .filter((game) =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((game) =>
        activeGenre ? game.genres.includes(activeGenre.toLowerCase()) : true
      )
  }, [games, searchTerm, activeGenre])

  const gamesPerPage = 6
  const pageCount = Math.ceil(filteredGames.length / gamesPerPage)
  const paginatedGames = filteredGames.slice(
    currentPage * gamesPerPage,
    (currentPage + 1) * gamesPerPage
  )

  const next = () => setCurrentPage((c) => (c + 1) % pageCount)
  const prev = () => setCurrentPage((c) => (c - 1 + pageCount) % pageCount)

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-6xl font-orbitron font-extrabold tracking-wide">
          Welcome to the Arcade
        </h1>
        { }
        <p className="text-lg md:text-xl text-gray-400">
          Discover your next favorite game.
        </p>
      {isTelegram && <p className="text-lg md:text-xl text-red-400">telegram</p>}
      {isMobile && <p className="text-lg md:text-xl text-red-400">Mobile</p>}
      </div>
      <div className="flex flex-row gap-4 justify-between items-center">
        <YGradientCard className="relative w-full md:w-auto !rounded-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className=" rounded-full pl-10 pr-4 w-full md:w-64 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
          />
        </YGradientCard>
        <div className="hidden md:flex flex-wrap items-center justify-center gap-3">
          {GENRES.map((genre) => (
            <Button
              key={genre}
              onClick={() => {
                setActiveGenre(activeGenre === genre ? null : genre)
                setCurrentPage(0)
              }}
              variant={activeGenre === genre ? "invertColor" : "yGradient"}
              className="!rounded-xl"
            >
              {genre}
            </Button>
          ))}
        </div>
      </div>

      <div className="max-md:block hidden">
        <AnimatedBorderButton variant="optionsBar">
          <div className="flex flex-row gap-2  w-full px-2 horizontal-list">
            {GENRES.map((genre) => (
              <Button
                key={genre}
                onClick={() => {
                  setActiveGenre(activeGenre === genre ? null : genre)
                  setCurrentPage(0)
                }}
                variant={activeGenre === genre ? "ghostActive" : "ghost"}
                className="min-w-fit flex-shrink-0 text-sm !px-1 !py-2"
              >
                {genre}
              </Button>
            ))}
          </div>
        </AnimatedBorderButton>
      </div>

      {loading && (
        <div className="text-center text-gray-400">Loading games...</div>
      )}
      {error && <div className="text-center text-red-500">Error: {error}</div>}

      {!loading && !error && (
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {paginatedGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </motion.div>
          </AnimatePresence>
          {pageCount > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 p-2 rounded-full bg-white/10 hover:bg-white/20 transition backdrop-blur-sm"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button
                onClick={next}
                className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 p-2 rounded-full bg-white/10 hover:bg-white/20 transition backdrop-blur-sm"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default LandingPage
