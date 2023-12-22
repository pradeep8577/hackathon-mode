import { Chain } from 'viem';

export const lightLink = {
  id: 1890,
  name: 'Lightlink Phoenix Mainnet',
  network: 'lightLink',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH'
  },
  rpcUrls: {
    public: {
      http: [
        'https://replicator-01.phoenix.lightlink.io/rpc/v1',
        'https://replicator-02.phoenix.lightlink.io/rpc/v1'
      ]
    },
    default: { http: ['https://replicator-01.phoenix.lightlink.io/rpc/v1'] }
  },
  blockExplorers: {
    etherscan: { name: 'LightLink', url: 'https://phoenix.lightlink.io/' },
    default: { name: 'LightLink', url: 'https://phoenix.lightlink.io/' }
  },
  contracts: {}
} as const satisfies Chain;
