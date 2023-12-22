import React, { PropsWithChildren } from 'react';

import { AuthenticatedRoutesWrapper } from '@multiversx/sdk-dapp/wrappers';
import { useLocation } from 'react-router-dom';

import multiversxRoutes from '@/config/multiversx-routes';
import EMultiversXRoutesName from '@/constants/multiversx-routes-name';

interface IMultiversXAuthWrapper extends PropsWithChildren {}

export default function MultiversXAuthWrapper({ children }: IMultiversXAuthWrapper) {
  const { search } = useLocation();

  return (
    <AuthenticatedRoutesWrapper
      routes={multiversxRoutes}
      unlockRoute={`${EMultiversXRoutesName.home}${search}`}
    >
      {children}
    </AuthenticatedRoutesWrapper>
  );
}
