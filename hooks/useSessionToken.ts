import { useEffect, useState } from "react"

import { getAccessToken } from "@privy-io/react-auth"
import { usePrivy } from "@privy-io/react-auth"

interface SavedState {
	token: string
	expiresAt: number
}

// @ts-expect-error meta.env is always defined in vite
const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT

const useSessionToken = () => {
	const [token, setToken] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const { ready, authenticated, user } = usePrivy()

	useEffect(() => {
		const saved = localStorage.getItem('prism:session-token') as string | null
		if (saved) {
			const parsed: SavedState = JSON.parse(saved)
			if (parsed.expiresAt > Date.now()) {
				setToken(parsed.token)
				setLoading(false)
				return
			}
		}

		const asyncFetch = async () => {
			const accessToken = await getAccessToken()
			const email = user.linkedAccounts?.find(
				(account) => account.type === 'email'
			)?.address
			const walletAddress = user.linkedAccounts?.find(
				(account) => account.type === 'wallet'
			)?.address
			const discordUsername = user.linkedAccounts?.find(
				(account) => account.type === 'discord_oauth'
			)?.username

			const body = {
				privyId: user.id,
				accessToken,
				email: email || `${user.id.split(":")[2]}@prism.ai`,
				walletAddress: walletAddress || `0x00000${user.id}`,
				discordUsername: discordUsername || `user_${user.id}`,
			}

			const response = await fetch(
				`${BACKEND_ENDPOINT}/api/lootbox/auth`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
					body: JSON.stringify(body),
				}
			)

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			setToken(data.token)
			const toSave: SavedState = {
				token: data.token,
				expiresAt: Date.now() + 3 * 60 * 60 * 1000, // 3 hours from now
			}
			localStorage.setItem('prism:session-token', JSON.stringify(toSave))
			setLoading(false)
		}
		if (ready && authenticated && user) {
			asyncFetch()
		}
	}, [ready, authenticated, user])

	return {loading, sessionToken: token}
}

export default useSessionToken