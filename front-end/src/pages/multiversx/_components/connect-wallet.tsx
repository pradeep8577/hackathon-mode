import React from 'react';

import { useExtensionLogin, useWebWalletLogin } from '@multiversx/sdk-dapp/hooks';
import {
  ExtensionLoginButtonPropsType,
  WebWalletLoginButtonPropsType
} from '@multiversx/sdk-dapp/UI';
import { FileKey2, Wallet } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { nativeAuth } from '@/config/multiversx-devnet';
import EMultiversXRoutesName from '@/constants/multiversx-routes-name';

type CommonPropertiesType = ExtensionLoginButtonPropsType | WebWalletLoginButtonPropsType;

const commonProperties: CommonPropertiesType = {
  callbackRoute: EMultiversXRoutesName.home,
  nativeAuth
};

export default function MultiversXConnectWallet() {
  const [webWalletLogin] = useWebWalletLogin({ ...commonProperties });
  const [defiWalletLogin] = useExtensionLogin({ ...commonProperties });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>Connect Wallet</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Choose one of the options</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className='flex flex-col gap-y-2.5 p-1'>
          <DropdownMenuItem asChild>
            <Button variant='outline' onClick={() => webWalletLogin()}>
              <FileKey2 className='mr-2 h-6 w-6' />
              Web Wallet
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button variant='outline' onClick={() => defiWalletLogin()}>
              <Wallet className='mr-2 h-6 w-6' />
              DeFi Wallet
            </Button>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
