import React from 'react';

import {
  NotificationModal,
  SignTransactionsModals,
  TransactionsToastList
} from '@multiversx/sdk-dapp/UI';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { WagmiConfig as EVMDAppProvider } from 'wagmi';
import { arbitrum, base, celo, linea, mainnet, scroll, zetachainAthensTestnet } from 'wagmi/chains';

import mainBG from '@/assets/images/main-bg.svg';
import { Toaster } from '@/components/ui/toaster';

import { lightLink } from './chains/light-link';
import { modeNetwork } from './chains/mode-network';
import Footer from './components/footer';
import Navbar from './components/navbar';
import ThemeProvider from './components/ui/theme/provider';
import multiversxRoutes from './config/multiversx-routes';
import routes from './config/routes';
import EStorageKeys from './constants/storage-keys';
import MultiversXAuthWrapper from './pages/multiversx/wrappers/auth-wrapper';
import MultiversXDAppProvider from './pages/multiversx/wrappers/dapp-provider';

const chains = [
  mainnet,
  arbitrum,
  base,
  scroll,
  zetachainAthensTestnet,
  celo,
  linea,
  lightLink,
  modeNetwork
];
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '';
const metadata = {
  name: 'DeFi Builder',
  description: 'DeFi Builder',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/142919060']
};

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({ wagmiConfig, projectId, chains });

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme='dark' storageKey={EStorageKeys.theme}>
        <Navbar />

        <main
          className='flex h-full w-full justify-center pb-12 pl-[2px]  pr-[2px] pt-28 sm:pb-20 sm:pt-40'
          style={{
            background: `url(${mainBG}) no-repeat center top`
          }}
        >
          <EVMDAppProvider config={wagmiConfig}>
            <Routes>
              {routes.map((route) => (
                <Route key={`route-${route.path}`} path={route.path} element={<route.page />} />
              ))}
            </Routes>
          </EVMDAppProvider>

          <MultiversXDAppProvider>
            <MultiversXAuthWrapper>
              <TransactionsToastList className='!text-secondary-foreground [&>div>button]:!text-secondary-foreground [&>div>div>div>div>div>button]:!text-secondary-foreground [&>div]:!bg-secondary' />
              <NotificationModal />
              <SignTransactionsModals className='!text-secondary-foreground [&>div]:border-border [&>div]:bg-secondary' />

              <Routes>
                {multiversxRoutes.map((route) => (
                  <Route key={`route-${route.path}`} path={route.path} element={<route.page />} />
                ))}
              </Routes>
            </MultiversXAuthWrapper>
          </MultiversXDAppProvider>
        </main>

        <Footer />

        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
