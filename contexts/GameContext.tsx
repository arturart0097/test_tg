import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import { Game } from "../types"

interface GameContextType {
  games: Game[]
  loading: boolean
  error: string | null
  fetchGames: () => Promise<void>
}

// @ts-expect-error meta.env is always defined in vite
const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT

const GameContext = createContext<GameContextType | undefined>(undefined)

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGames = async () => {
    setLoading(true)
    setError(null)
    try {
      const gameResponse = await fetch(
        `${BACKEND_ENDPOINT}/api/games`
      )
      if (!gameResponse.ok) {
        throw new Error("Failed to fetch games")
      }
      const gameData = await gameResponse.json()

      const tournamentResponse = await fetch(
        `${BACKEND_ENDPOINT}/api/tournaments`
      )
      if (!tournamentResponse.ok) {
        throw new Error("Failed to fetch tournaments")
      }
      const tournamentData = await tournamentResponse.json()
      for (const game of gameData.games) {
        const tournament = tournamentData.tournaments.find(
          (t: any) => t.game.toLowerCase() === game.title.toLowerCase()
        )
        if (tournament) {
          game.tournament = tournament
        }
      }
      console.log("Setting games with tournaments", gameData.games)
      setGames([...gameData.games])
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [])

  return (
    <GameContext.Provider value={{ games, loading, error, fetchGames }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGames = (): GameContextType => {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGames must be used within a GameProvider")
  }
  return context
}
