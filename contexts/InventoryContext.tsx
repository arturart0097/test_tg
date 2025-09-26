import React, { createContext, useContext, useEffect, useState } from 'react'
import { getAccessToken, usePrivy } from '@privy-io/react-auth'

import useSessionToken from '@/hooks/useSessionToken'

interface UserStat {
  powerPoints: number
  totalAvailableShards: number
  commonShardsCount: number
  epicShardsCount: number
}

interface Quest {
  id: string
  gameName: string
  questId: string
  questDescription: string
  isPremium: boolean
  rewardAmount: number
  createdAt: string
  updatedAt: string
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'VALIDATION' | 'COMPLETED'
}

interface Streak {
  nextClaimInSeconds: number
  nextClaimAt: string
  currentStreak: number
  projectedDailyPoints: { day: number }[]
}

type StatsContextType = {
  powerPoints: number
  totalAvailableShards: number
  commonShardsCount: number
  epicShardsCount: number
  loading: boolean
  quests: Quest[] | null
  streaks: Streak | null
  refreshStats: () => void
  refreshQuests: () => void
  refreshStreaks: () => void
}

const StatsContext = createContext<StatsContextType | null>(null)

// @ts-expect-error meta.env is always defined in vite
const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT

export const InventoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [userStat, setUserStat] = useState<UserStat | null>(null)
  const [quests, setQuests] = useState<Quest[] | null>(null)
  const [streaks, setStreaks] = useState<Streak | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const { ready, authenticated, user } = usePrivy()
  const { loading: sessionLoading, sessionToken } = useSessionToken()

  const getStats = async () => {
    setLoading(true)
    try {
      const token = await getAccessToken()

      const response = await fetch(
        `${BACKEND_ENDPOINT}/api/lootbox/stats`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'x-prism-session': sessionToken || '',
          },
        }
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: UserStat = await response.json()

      setUserStat(data)
    } catch (error: any) {
      console.error(
        '❌ Error fetching stats:',
        error.response?.data || error.message
      )
    } finally {
      setLoading(false)
    }
  }

  const getQuests = async () => {
    setLoading(true)
    try {
      const token = await getAccessToken()

      const response = await fetch(
        `${BACKEND_ENDPOINT}/api/lootbox/quests`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'x-prism-session': sessionToken || '',
          },
        }
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: Quest[] = await response.json()
      setQuests(data)
    } catch (error: any) {
      console.error(
        '❌ Error fetching quests:',
        error.response?.data || error.message
      )
    } finally {
      setLoading(false)
    }
  }

  const getStreaks = async () => {
    setLoading(true)
    try {
      const token = await getAccessToken()

      const response = await fetch(
        `${BACKEND_ENDPOINT}/api/lootbox/streaks`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'x-prism-session': sessionToken || '',
          },
        }
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: Streak = await response.json()
      setStreaks(data)
    } catch (error: any) {
      console.error(
        '❌ Error fetching streaks:',
        error.response?.data || error.message
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (ready && authenticated && !sessionLoading) {
      getStats()
      getQuests()
      getStreaks()
    }
  }, [ready, authenticated, sessionLoading])

  return (
    <StatsContext.Provider
      value={{
        powerPoints: userStat?.powerPoints || 0,
        totalAvailableShards: userStat?.totalAvailableShards || 0,
        commonShardsCount: userStat?.commonShardsCount || 0,
        epicShardsCount: userStat?.epicShardsCount || 0,
        loading,
        quests,
        streaks,
        refreshStats: getStats,
        refreshQuests: getQuests,
        refreshStreaks: getStreaks,
      }}
    >
      {children}
    </StatsContext.Provider>
  )
}

export const useInventory = () => {
  const context = useContext(StatsContext)
  if (!context) throw new Error('useInventory must be used within a StatsProvider')
  return context
}
