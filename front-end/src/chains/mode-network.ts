import { Chain } from 'viem';

export const modeNetwork = {
  id: 34_443,
  name: 'Mode Mainnet',
  network: 'modeNetwork',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH'
  },
  rpcUrls: {
    public: {
      http: ['https://mainnet.mode.network']
    },
    default: { http: ['https://mainnet.mode.network'] }
  },
  blockExplorers: {
    etherscan: { name: 'modeNetwork', url: 'https://explorer.mode.network/' },
    default: { name: 'modeNetwork', url: 'https://explorer.mode.network/' }
  },
  contracts: {}
} as const satisfies Chain;
