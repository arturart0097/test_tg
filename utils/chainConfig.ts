export const WAGER_CONTRACT_ADDRESS = "0x5BF558aE94da4C4e801105D1B0aD9E24c9578EA2"

export const WAGER_CONTRACT_ABI = [
	'function wager(string memory gameId) public payable',
	'function games(string memory gameId) public view returns (uint256 fee, bool recurring, bool active)',
	'function wagerCurrency() public view returns (address)',
]

export const ERC20_ABI = [
	'function approve(address spender, uint256 amount) public returns (bool)',
	'function allowance(address owner, address spender) public view returns (uint256)',
	'function balanceOf(address account) external view returns (uint256)',
]

export const WAGER_CHAIN = 8453 // Base chain