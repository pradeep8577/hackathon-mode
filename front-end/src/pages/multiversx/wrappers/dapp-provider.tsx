import React, { PropsWithChildren } from 'react';

import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types';
import { DappProvider } from '@multiversx/sdk-dapp/wrappers';

import { apiTimeout, walletConnectV2ProjectId } from '@/config/multiversx-devnet';
import EMultiversXRoutesName from '@/constants/multiversx-routes-name';

interface IMultiversXDAppProvider extends PropsWithChildren {}

export default function MultiversXDAppProvider({ children }: IMultiversXDAppProvider) {
  return (
    <DappProvider
      environment={EnvironmentsEnum.devnet}
      customNetworkConfig={{
        name: 'devnet-config',
        apiTimeout,
        walletConnectV2ProjectId
      }}
      dappConfig={{
        shouldUseWebViewProvider: true,
        logoutRoute: EMultiversXRoutesName.home
      }}
    >
      {children}
    </DappProvider>
  );
}
