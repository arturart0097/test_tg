import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useRef } from 'react'

import { X } from 'lucide-react'

type DialogProps = {
	dismissable?: boolean
	icon?: React.ReactNode
	title?: string
	isOpen: boolean
	onClose: () => void
	children: React.ReactNode
	footer?: React.ReactNode
	className?: string
}

export const Dialog: React.FC<DialogProps> = ({
	dismissable = false,
	icon,
	title,
	isOpen,
	onClose,
	children,
	footer,
	className,
}) => {
	const backdropRef = useRef<HTMLDivElement>(null)

	// Dismiss when clicking outside
	useEffect(() => {
		if (!isOpen || !dismissable) return
		const handleClick = (e: MouseEvent) => {
			if (backdropRef.current && e.target === backdropRef.current) {
				onClose()
			}
		}
		document.addEventListener('mousedown', handleClick)
		return () => document.removeEventListener('mousedown', handleClick)
	}, [isOpen, dismissable, onClose])

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					ref={backdropRef}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-lg"
				>
					<motion.div
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						transition={{ type: 'spring', stiffness: 300, damping: 30 }}
						className="bg-slate-800/50 rounded-2xl shadow-lg min-w-[340px] p-6 pb-4 relative flex flex-col gap-4 text-white"
					>
						{/* Header */}
						{(icon || title || dismissable) && (
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-2">
									{icon && <span className="flex items-center">{icon}</span>}
									{title && (
										<h2 className="text-[20px] font-semibold m-0">{title}</h2>
									)}
								</div>
								{dismissable && (
									<motion.button
										onClick={() => {
											onClose()
										}}
										whileHover={{ scale: 1.15 }}
										whileTap={{ scale: 0.95 }}
										className="border-none bg-transparent rounded px-1 cursor-pointer flex items-center justify-center transition-colors"
										aria-label="Close dialog"
									>
										<X size={20} />
									</motion.button>
								)}
							</div>
						)}

						{/* Body */}
						<div className={className + (footer ? ' mb-3' : '')}>
							{children}
						</div>

						{/* Footer */}
						{footer && (
							<div className="border-t border-[#eee] pt-3 mt-2 flex justify-end gap-2">
								{footer}
							</div>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}