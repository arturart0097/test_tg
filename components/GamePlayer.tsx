'use client'

import { ConnectedWallet, usePrivy, useSessionSigners, useWallets } from '@privy-io/react-auth'
import { Contract, ethers } from 'ethers'
import { ERC20_ABI, WAGER_CHAIN, WAGER_CONTRACT_ABI, WAGER_CONTRACT_ADDRESS } from '@/utils/chainConfig'
import { Fragment, useEffect, useLayoutEffect, useState } from 'react'
import { Unity, useUnityContext } from 'react-unity-webgl'

import { BrowserProvider } from 'ethers'
import Button from './ui/Button'
import CryptoJS from 'crypto-js'
import { Dialog } from './ui/Dialog'
import { Game } from '@/types'
import { Wallet } from 'lucide-react'
import toast from 'react-hot-toast'
import { useGames } from '@/contexts/GameContext'

// @ts-expect-error meta.env is always defined in vite
const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT

export const GamePlayer = ({ name }: { name: string }) => {
	const { ready, authenticated, user, getAccessToken } = usePrivy()
	const { wallets } = useWallets()
	const { addSessionSigners, removeSessionSigners } = useSessionSigners()
	const { loading, games } = useGames()
	const [userWallets, setUserWallets] = useState<string[]>([])
	const [address, setAddress] = useState<string | null>(null)
	const [walletSelectionOpen, setWalletSelectionOpen] = useState(false)
	const [gameName, setGameName] = useState(name)
	const [gameData, setGameData] = useState<Game | undefined>(undefined)
	const [userName, setUserName] = useState(user?.twitter?.username || 'Guest')
	const [privyToken, setPrivyToken] = useState('')
	const [strippedButtons, setStrippedButtons] = useState(false)

	useEffect(() => {
		if (!ready || !authenticated || !wallets) return
		const ethWallets = wallets.filter((wallet) =>
			wallet.address.startsWith('0x')
		)
		if (ethWallets.length > 0) {
			setAddress(ethWallets[0].address)
			setUserWallets(ethWallets.map((wallet) => wallet.address))
		}
	}, [ready, authenticated, wallets])

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search)
			if (params.get('variant') === 'stripped') {
				setStrippedButtons(true)
				requestFullscreen(true)
			} else {
				setStrippedButtons(false)
			}
		}
	}, [])

	const userAddress = address || 'No Wallet'

	// @ts-expect-error meta.env always exists in vite project
	const baseURL = import.meta.env.VITE_STORAGE_ORIGIN_URL || ''

	const [rotatePhone, setRotatePhone] = useState(false)

	const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

	useEffect(() => {
		if (loading || !name) return
		const matchedGames = games.filter(
			(game) =>
				game.title.replace(/\s+/g, '').toLowerCase() === name.toLowerCase()
		)
		if (matchedGames.length > 0) {
			setGameData(matchedGames[0])
		} else {
			window.location.href = '/'
		}
	}, [games, loading, name, isMobile])

	useLayoutEffect(() => {
		function updateSize() {
			if (!isMobile) return

			if (gameData?.orientation === 'portrait') {
				setRotatePhone(window.innerWidth > window.innerHeight)
			} else {
				setRotatePhone(window.innerHeight > window.innerWidth)
			}
		}
		window.addEventListener('resize', updateSize)
		if (isMobile && gameData) {
			updateSize()
		}
		return () => window.removeEventListener('resize', updateSize)
	}, [games, gameData, isMobile])

	useEffect(() => {
		if (name) {
			setGameName(name)
		} else if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search)
			const id = params.get('id')
			if (id) {
				setGameName(id)
			}
		}

		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search)
			const payload = params.get('payload')
			if (payload) {
				const [ivHex, encrypted] = payload.split(':')
				const key = 'JlmuIYhyyk61HKq7' // process.env['RMG_ENCRYPTION_KEY']
				if (!key || !ivHex || !encrypted) {
					console.log('Invalid payload format')
					return
				}
				const aesKey = CryptoJS.SHA256(key)
				const iv = CryptoJS.enc.Hex.parse(ivHex)
				const decrypted = CryptoJS.AES.decrypt(encrypted, aesKey, { iv })
				// Ensure decrypted is a WordArray and convert to Utf8 safely
				let decryptedStr = ''
				try {
					decryptedStr = CryptoJS.enc.Utf8.stringify(decrypted)
				} catch {
					console.error('Decryption failed or result is not valid UTF-8')
					return
				}
				if (decryptedStr) {
					try {
						const decryptedPayload = JSON.parse(decryptedStr)
						if (
							!decryptedPayload ||
							!decryptedPayload.userName ||
							!decryptedPayload.walletAddress ||
							!decryptedPayload.privyToken
						) {
							console.log('Invalid payload structure')
							return
						}
						console.log('Loaded payload:', decryptedPayload)
						setUserName(decryptedPayload.userName)
						setAddress(decryptedPayload.walletAddress)
						setPrivyToken(decryptedPayload.privyToken)
					} catch {
						console.error('Failed to parse decrypted payload as JSON')
						return
					}
				}
			}
		}
	}, [name])

	const {
		unityProvider,
		isLoaded,
		loadingProgression,
		requestFullscreen,
		unload,
		// sendMessage,
		UNSAFE__unityInstance,
	} = useUnityContext({
		loaderUrl: `${baseURL}/${gameName}/Build/buildWebgl.loader.js`,
		dataUrl: `${baseURL}/${gameName}/Build/buildWebgl.data`,
		frameworkUrl: `${baseURL}/${gameName}/Build/buildWebgl.framework.js`,
		codeUrl: `${baseURL}/${gameName}/Build/buildWebgl.wasm`,
		streamingAssetsUrl: `${baseURL}/${gameName}/StreamingAssets`,
		cacheControl: function (url: string) {
			// if (url.match(/\.data/) || url.match(/\.wasm/)) {
			//   return 'immutable'
			// }
			// if (url.match(/\.json/)) {
			//   return 'must-revalidate'
			// }
			return 'no-store'
		},
	})

	const WagerSender = async () => {
		if (!ready || !address || !wallets) {
			toast.error('User not authenticated')
			return
		}

		if (!wallets || wallets.length == 0) {
			toast.error('Could not find a connected wallet')
			return
		}

		if (!gameData?.tournament) {
			toast.error('Tournament is not active for this game')
			return
		}

		if (wallets.length > 1) {
			setWalletSelectionOpen(true)
			return
		}

		callWager(wallets[0].address)
	}

	const callWager = async (walletAddress: string) => {
		setWalletSelectionOpen(false)
		if (!wallets || wallets.length == 0) {
			toast.error('Wallet not connected')
			return
		}
		const targetWallet = wallets.find((w) => w.address === walletAddress)
		if (!targetWallet) {
			toast.error('Wallet not found')
			return
		}
		toast.loading("Initiating on-chain wager", { duration: 3000 })
		await targetWallet.switchChain(WAGER_CHAIN)

		const provider = await targetWallet.getEthereumProvider()
		const ethersProvider = new ethers.BrowserProvider(provider)
		const contract = new Contract(
			WAGER_CONTRACT_ADDRESS,
			WAGER_CONTRACT_ABI,
			await ethersProvider.getSigner()
		)
		const onchainData = await contract.games(name.toLowerCase())
		if (!onchainData || !onchainData.active) {
			toast.error('This game is not currently active for wagers.')
			return
		}

		const entryFee = onchainData.fee
		const wagerCurrency = await contract.wagerCurrency()

		if (targetWallet.walletClientType === 'embedded') {
			await addSessionSigners({ address: targetWallet.address, signers: [] })
		}

		let value = 0
		if (wagerCurrency == ethers.ZeroAddress) {
			value = entryFee
		} else {
			try {
				const erc20 = new Contract(
					wagerCurrency,
					ERC20_ABI,
					await ethersProvider.getSigner()
				)
				const allowance = await erc20.allowance(
					targetWallet.address,
					WAGER_CONTRACT_ADDRESS
				)
				if (allowance < entryFee) {
					const approveTx = await erc20.approve(
						WAGER_CONTRACT_ADDRESS,
						ethers.MaxUint256
					)
					toast.promise(approveTx.wait(), {
						loading: 'Approving token spend...',
						success: 'Token spend approved!',
						error: 'Failed to approve token spend',
					})
					await approveTx.wait()
				}
			} catch (e) {
				console.error('Error during ERC20 approval process:', e)
				toast.error('Failed to approve token spend')
				return
			}
		}

		try {
			const tx = await contract.wager(name.toLowerCase(), { value })
			toast.promise(tx.wait(), {
				loading: 'Sending wager...',
				success: () => {
					UNSAFE__unityInstance?.SendMessage(
						'NetworkManager',
						'SetSaveData',
						'true'
					)
					UNSAFE__unityInstance?.SendMessage(
						'WagerManager',
						'wagerResponse',
						'true'
					)
					return 'Wager sent!'
				},
				error: 'Failed to send wager',
			})
		} catch (e) {
			console.error('Error sending wager transaction:', e)
			toast.error('Failed to send wager')
		}

		if (targetWallet.walletClientType === 'embedded') {
			await removeSessionSigners({ address: targetWallet.address })
		}
	}

	useEffect(() => {
		getAccessToken().then((token) => {
			if (token && token !== privyToken) {
				setPrivyToken(token)
			}
		})
	}, [user, privyToken])

	useEffect(() => {
		// @ts-expect-error unityCallback is already embedded on window
		window.unityCallback = async function (message: string) {
			console.log('Message from Unity:', message)
			switch (message) {
				case 'ConnectWallet':
					if (!UNSAFE__unityInstance)
						console.error('UNSAFE__unityInstance is not defined')
					console.log('Sending Info')

					console.log(address)
					UNSAFE__unityInstance?.SendMessage(
						'NetworkManager',
						'SetUserName',
						userName
					)
					UNSAFE__unityInstance?.SendMessage(
						'NetworkManager',
						'SetWalletAddress',
						address?.toString()
					)
					UNSAFE__unityInstance?.SendMessage(
						'NetworkManager',
						'SetToken',
						privyToken
					)
					UNSAFE__unityInstance?.SendMessage(
						'NetworkManager',
						'SetMobileDeviceState',
						isMobile.toString()
					)
					break
				case 'SendWager':
					await WagerSender()
					// setGameParameters('viralDefense')
					break
				case 'GameEnd':
					console.log('GameEnd')
					break
			}
		}

		try {
			if (isLoaded && UNSAFE__unityInstance) {
				UNSAFE__unityInstance.SendMessage(
					'SplashPage',
					'SetMobileDeviceCheck',
					isMobile.toString()
				)
			}
		} catch (error) {
			console.error('Error sending mobile device check:', error)
		}

		// UNSAFE__unityInstance?.SetFullscreen(true)

		return () => {
			// @ts-expect-error unityCallback is already embedded on window
			delete window.unityCallback
		}
	}, [
		isLoaded,
		UNSAFE__unityInstance,
		userName,
		userAddress,
		privyToken,
		WagerSender,
	])

	useEffect(() => {
		return () => {
			unload()
		}
	}, [unload])

	useEffect(() => {
		if (loadingProgression === 1) {
			fetch(`${BACKEND_ENDPOINT}/api/games`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ title: gameData.title }),
			})
				.then((response) => {
					if (!response.ok) {
						console.error('Failed to POST game plays:', response.statusText)
					}
				})
				.catch((error) => {
					console.error('Error posting game plays:', error)
				})
		}
	}, [loadingProgression])

	return (
		<div
			className={`relative mt-4 flex flex-col items-center w-full ${strippedButtons ? 'h-screen' : 'h-full'
				}`}
			id="modalRoot2"
		>
			{!isLoaded && (
				<Fragment>
					<div className="absolute w-full">
						<video
							autoPlay
							muted
							loop
							className="h-full w-full object-cover blur-sm"
						>
							<source
								src={`/arcade/games/${name}/preview.mp4`}
								type="video/mp4"
							/>
						</video>
					</div>
					<div className="mt-4 absolute top-[200px] z-20 flex justify-center items-center left-1/2 -translate-x-1/2 px-2 py-1 bg-black/50 rounded-xl text-white">
						<p>Loading Game ... {`${Math.floor(loadingProgression * 100)}%`}</p>
					</div>
				</Fragment>
			)}
			{rotatePhone ? (
				<div
					className="absolute top-0 left-0 w-screen h-full backdrop-blur-sm z-30 flex justify-center items-center"
					id="rotateMessage"
				>
					<img
						id="rotateImage"
						src="/assets/rotate-device.png"
						alt="Rotate your device to landscape mode"
						width={200}
						height={200}
						className="w-3/4"
					/>
				</div>
			) : null}
			<Unity
				unityProvider={unityProvider}
				style={
					strippedButtons
						? {
							width: '100vw',
							height: '100vh',
						}
						: {
							width: '100vw',
							maxWidth: '800px',
							height: '600px',
						}
				}
			/>
			{!strippedButtons && (
				<div className="flex justify-between w-full px-8">
					<Button
						onClick={() => unload().then(() => (window.location.href = '/'))}
					>
						Back
					</Button>
					<Button
						onClick={() => requestFullscreen(true)}
						id="unity-fullscreen-button"
					>
						Fullscreen
					</Button>
				</div>
			)}

			{window.location.hostname === 'localhost' && (
				<Button onClick={() => WagerSender()}>Init Wager</Button>
			)}

			<Dialog
				icon={<Wallet />}
				title="Choose a wallet for wager"
				isOpen={walletSelectionOpen}
				onClose={() => setWalletSelectionOpen(false)}
				dismissable
			>
				<div className="flex flex-col gap-2">
					{userWallets.map((wallet, id) => (
						<p
							key={id}
							className="px-4 py-2 hover:bg-slate-700 rounded-xl cursor-pointer transition-all duration-500"
							onClick={() => {
								callWager(wallet)
								setWalletSelectionOpen(false)
							}}
						>
							{wallet}
						</p>
					))}
				</div>
			</Dialog>
		</div>
	)
}