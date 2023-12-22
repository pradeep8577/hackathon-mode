import React, { useEffect, useState } from 'react';

import { useGetAccountInfo, useGetNetworkConfig } from '@multiversx/sdk-dapp/hooks';
import { FormatAmount } from '@multiversx/sdk-dapp/UI';
import { logout } from '@multiversx/sdk-dapp/utils';
import { localStorageKeys } from '@multiversx/sdk-dapp/utils/storage/local';
import { ClipboardCopy, Coins, LogOut, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { FAUCET_URL } from '@/config/multiversx-devnet';
import EMultiversXRoutesName from '@/constants/multiversx-routes-name';
import { useReadLocalStorage } from '@/custom-hooks/use-read-local-storage';

interface ILoginExpiresAt {
  expires: number;
  data: number;
}

const isClipboardApiSupported = !!(navigator.clipboard && navigator.clipboard.writeText);

export default function MultiversXAccountDetails() {
  const { toast } = useToast();

  const { network } = useGetNetworkConfig();
  const { account, address } = useGetAccountInfo();

  const lsSessionExpiresAt = useReadLocalStorage<ILoginExpiresAt>(localStorageKeys.loginExpiresAt);

  const [imageQRCode, setImageQRCode] = useState<string | undefined>('');

  const displayAddress = address.slice(0, 8) + '...' + address.slice(-8);
  const sessionExpiresAt = new Date(lsSessionExpiresAt?.expires || '');

  useEffect(() => {
    QRCode.toDataURL(address)
      .then((imageBase64: string) => {
        setImageQRCode(imageBase64);

        return imageBase64;
      })
      .catch((error: Error) => {
        // eslint-disable-next-line unicorn/no-useless-undefined
        setImageQRCode(undefined);

        console.error(error);
      });
  }, [address]);

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline'>{displayAddress}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56'>
          <DropdownMenuLabel>Connected account details</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className='flex gap-x-2.5'>
                <span>Herotag:</span>
                <span className='text-muted-foreground'>N / A</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuLabel>
              <div className='flex gap-x-2.5'>
                <span>Shard:</span>
                <span className='text-muted-foreground'>{account.shard}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuLabel>
              <div className='flex gap-x-2.5'>
                <span>Balance:</span>
                <span className='text-muted-foreground'>
                  {
                    <FormatAmount
                      value={account.balance}
                      digits={2}
                      egldLabel={network.egldLabel}
                    />
                  }
                </span>
              </div>
            </DropdownMenuLabel>
            {lsSessionExpiresAt && (
              <DropdownMenuLabel>
                <div className='flex gap-x-2.5'>
                  <span>Session expires:</span>
                  <div className='flex flex-col'>
                    <span className='text-muted-foreground'>
                      {sessionExpiresAt.toLocaleDateString()}
                    </span>
                    <span className='text-muted-foreground'>
                      {sessionExpiresAt.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {isClipboardApiSupported && (
              <DropdownMenuItem
                onClick={() => {
                  onCopyAddressClick(address);

                  toast({
                    description: 'Address copied successfully!'
                  });
                }}
              >
                <ClipboardCopy className='mr-2 h-4 w-4' />
                <span>Copy address</span>
              </DropdownMenuItem>
            )}
            {imageQRCode !== '' && imageQRCode !== undefined && (
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <QrCode className='mr-2 h-4 w-4' />
                  <span>Address QR Code</span>
                </DropdownMenuItem>
              </DialogTrigger>
            )}
            <DropdownMenuItem onClick={() => onFaucetClick()}>
              <Coins className='mr-2 h-4 w-4' />
              <span>Faucet</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className='text-destructive focus:text-destructive'
              onClick={() => onDisconnectClick()}
            >
              <LogOut className='mr-2 h-4 w-4' />
              <span>Disconnect</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription>Representation of your address as a QR Code.</DialogDescription>
        </DialogHeader>
        <div className='flex items-center justify-center'>
          <img src={imageQRCode} alt='Address QR Code' className='w-[30rem] rounded' />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function onCopyAddressClick(address: string) {
  navigator.clipboard.writeText(address);
}

function onFaucetClick() {
  window.open(FAUCET_URL, '_blank');
}

function onDisconnectClick() {
  const callbackURL = `${window.location.origin}${EMultiversXRoutesName.home}`;

  sessionStorage.clear();

  logout(callbackURL, undefined, false);

  location.reload();
}
