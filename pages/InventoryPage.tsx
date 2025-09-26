import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react"
import React, { useState } from "react"

import { AnimatedBorderButton } from "@/components/ui/GeminiAnimatedButton"
import Button from "../components/ui/Button"
import YGradientCard from "@/components/YGradientCard"
import { useInventory } from "../contexts/InventoryContext"
import { useNavigate } from "react-router-dom"

type Tab = "Quests" | "Streaks" | "Shards"

const InventoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Quests")
  const navigate = useNavigate()

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-800 transition"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-3xl font-orbitron tracking-widest font-bold">
          Inventory
        </h1>
      </div>

      <div className=" p-1 gap-2 flex justify-around max-md:hidden">
        {(["Quests", "Streaks", "Shards"] as Tab[]).map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            variant={activeTab === tab ? "invertColor" : "yGradient"}
            className={`w-full py-2 text-sm font-bold transition-colors !rounded-lg `}
          >
            {tab}
          </Button>
        ))}
      </div>

      <div className="max-md:block hidden">
        <AnimatedBorderButton variant="optionsBar">
          <div className=" p-1 gap-2 flex justify-around">
            {(["Quests", "Streaks", "Shards"] as Tab[]).map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                variant={activeTab === tab ? "ghostActive" : "ghost"}
                className={`w-full text-sm font-bold transition-colors !rounded-lg !px-1 !py-2 `}
              >
                {tab}
              </Button>
            ))}
          </div>
        </AnimatedBorderButton>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "Quests" && <QuestsView />}
          {activeTab === "Streaks" && <StreaksView />}
          {activeTab === "Shards" && <ShardsView />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

const QuestsView: React.FC = () => {
  const { powerPoints, quests } =
    useInventory()
  const [questsOpen, setQuestsOpen] = useState(true)

  return (
    <div className="space-y-6">
      <YGradientCard className="w-full text-center">
        <p className="text-gray-400 my-2">Total PowerPoints</p>
        <div className="w-32 h-16 mx-auto  flex items-center justify-center">
          <span className="text-3xl font-bold font-orbitron text-fuchsia-400">
            {powerPoints}
          </span>
        </div>
      </YGradientCard>
      <div className=" px-6 text-center backdrop-blur-sm">
        <p className="text-white mb-4 font-bold">Today's Quests Completed</p>
        <div className="flex justify-between">
          <div>
            <p className="text-white text-sm">Free</p>
            <p className="text-4xl font-bold font-orbitron tracking-widest">
              {quests?.filter((q) => !q.isPremium && q.status === "COMPLETED").length}/3
            </p>
          </div>
          <div>
            <p className="text-white text-sm">Wagered</p>
            <p className="text-4xl font-bold font-orbitron tracking-widest">
              {quests?.filter((q) => q.isPremium && q.status === "COMPLETED").length}/3
            </p>
          </div>
        </div>
      </div>
      <div className=" backdrop-blur-sm">
        <YGradientCard className="w-full">
          <button
            onClick={() => setQuestsOpen(!questsOpen)}
            className="w-full flex justify-between items-center p-2"
          >
            <span className="font-bold text-lg">Today's Quests</span>
            {questsOpen ? <ChevronUp /> : <ChevronDown />}
          </button>
        </YGradientCard>
        {questsOpen && (
          <div className="px-0 py-4 space-y-2">
            {quests?.map((q) => (
              <TaskCard
                key={q.id}
                description={q.questDescription}
                title={q.questId}
                reward={q.rewardAmount}
                type={q.isPremium ? "Wagered" : "Free"}
                game={q.gameName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const StreaksView: React.FC = () => {
  const { streaks } = useInventory()
  const [rewardsOpen, setRewardsOpen] = useState(true)

  return (
    <div className="space-y-6">
      <YGradientCard className="w-full text-center p-4">
        <p className="text-gray-400">Login Streak</p>
        <p className="text-5xl font-bold font-orbitron text-fuchsia-400 tracking-wider">
          {streaks.currentStreak} {streaks.currentStreak === 1 ? "day" : "days"}
        </p>
      </YGradientCard>

      <h2 className="text-xl font-bold text-center">Next Reward</h2>

      <div className="space-y-4">
        <div className=" backdrop-blur-sm">
          <YGradientCard className="w-full">
            <button
              onClick={() => setRewardsOpen(!rewardsOpen)}
              className="w-full flex justify-between items-center p-1"
            >
              <span className="font-bold text-lg">In 3 days</span>
              {rewardsOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
          </YGradientCard>
          {rewardsOpen && (
            <div className="px-0 py-4 space-y-2">
              <TaskCard
                description="Clear minimum of Level 2"
                title="DailyConnect"
                reward={750}
                type="Free"
              />
            </div>
          )}
        </div>
        <YGradientCard className="w-full">
          <button className="w-full flex justify-between items-center p-1">
            <span className="font-bold text-lg">Tomorrow</span>
            <ChevronDown />
          </button>
        </YGradientCard>
      </div>
    </div>
  )
}

const ShardsView: React.FC = () => {
  const { commonShardsCount, epicShardsCount } = useInventory()
  const [powerpointsToConvert, setPowerpointsToConvert] = useState("")
  return (
    <div className="space-y-6">
      <div className=" p-6 backdrop-blur-sm">
        <h2 className="text-xl font-bold mb-6 text-center">Shards Balance</h2>
        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="text-gray-400 mb-2">Common</p>
            <div className="w-24 h-10 mx-auto flex items-center justify-center">
              <span className="text-4xl font-bold font-orbitron tracking-widest">
                {commonShardsCount}
              </span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-400 mb-2">Epic</p>
            <div className="w-24 h-10 mx-auto  flex items-center justify-center">
              <span className="text-4xl font-bold font-orbitron text-fuchsia-400 tracking-widest">
                {epicShardsCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <input
          type="number"
          value={powerpointsToConvert}
          onChange={(e) => setPowerpointsToConvert(e.target.value)}
          placeholder="PowerPoints to Shards"
          className="w-full bg-gray-900/70 border border-gray-700 rounded-full py-4 px-5 focus:ring-2 focus:ring-purple-500 focus:outline-none transition no-spinner"
        />
        <span className="max-w-md mx-auto text-gray-400 text-sm font-light text-right w-full flex justify-end">
          0 total
        </span>
      </div>

      <AnimatedBorderButton>Convert Powerpoints</AnimatedBorderButton>

      <p className="text-xs text-gray-400 text-center leading-relaxed">
        Shards are used to open Lootboxes and get exciting rewards. You need 3
        common shards to open 1 common lootbox or 3 epic shards to open 1 epic
        lootbox
      </p>
    </div>
  )
}

export default InventoryPage

function TaskCard(props: {
  description: string
  title: string
  type: string
  reward: number
  game?: string
}) {
  return (
    <YGradientCard className="w-full p-1 flex justify-between items-center cursor-pointer">
      <div onClick={() => {
        if (props.game) {
          window.location.href = `/games/${props.game.replace(/ /g, '')}`
        }
      }}>
        <p className="font-bold flex items-center justify-between gap-2 w-full">
          {props.title}{" "}
        </p>
        <p className="text-sm text-gray-400">{props.description}</p>
        <p className="text-sm text-fuchsia-400">{props.game}</p>
      </div>
      <span className="flex flex-col justify-end items-end">
        <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">
          {props.type}
        </span>
        <p className="font-bold text-lg">
          {props.reward.toLocaleString()} Powerpoints
        </p>
      </span>
    </YGradientCard>
  )
}
