import React, { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { issueTokenContractAddress } from '@/config/multiversx-devnet';

import { STTokenSchema, TokenSchema } from '../zod-schemas/token';

export default function MultiversXIssueTokenForm() {
  const { address } = useGetAccountInfo();

  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);

  const issueTokenForm = useForm<STTokenSchema>({
    resolver: zodResolver(TokenSchema),
    defaultValues: {
      name: '',
      ticker: '',
      mintAmount: '',
      decimals: '',
      canFreeze: false,
      canWipe: false,
      canPause: false,
      canChangeOwner: true,
      canUpgrade: true,
      canAddSpecialRoles: true
    }
  });

  async function onSubmit(tokenProperties: STTokenSchema) {
    await issueToken(address, tokenProperties);

    setIsTokenDialogOpen((previousState) => !previousState);
    issueTokenForm.reset();
  }

  return (
    <Dialog open={isTokenDialogOpen} onOpenChange={setIsTokenDialogOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Issue Token</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[550px]'>
        <DialogHeader>
          <DialogTitle>Issue Token</DialogTitle>
        </DialogHeader>

        <Form {...issueTokenForm}>
          <form onSubmit={issueTokenForm.handleSubmit(onSubmit)} className='space-y-5'>
            <FormField
              control={issueTokenForm.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center gap-x-1'>
                    <FormLabel>Name</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={issueTokenForm.control}
              name='ticker'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center gap-x-1'>
                    <FormLabel>Ticker</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={issueTokenForm.control}
              name='mintAmount'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center gap-x-1'>
                    <FormLabel>Mint Amount</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={issueTokenForm.control}
              name='decimals'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center gap-x-1'>
                    <FormLabel>Decimals</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className='flex'>
              <div className='flex w-1/2 flex-col gap-y-2.5 pr-5'>
                <FormField
                  control={issueTokenForm.control}
                  name='canFreeze'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between'>
                      <FormLabel>Freezalbe</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={issueTokenForm.control}
                  name='canPause'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between'>
                      <FormLabel>Pausable</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={issueTokenForm.control}
                  name='canChangeOwner'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between'>
                      <FormLabel>Changable Owner</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className='flex w-1/2 flex-col gap-y-2.5 pl-5'>
                <FormField
                  control={issueTokenForm.control}
                  name='canWipe'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between'>
                      <FormLabel>Wipeable</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={issueTokenForm.control}
                  name='canUpgrade'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between'>
                      <FormLabel>Upgradeable</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={issueTokenForm.control}
                  name='canAddSpecialRoles'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between'>
                      <FormLabel>Can Add Special Roles</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type='submit'>Send transaction</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

async function issueToken(tokenManagerAddress: string, tokenProperties: STTokenSchema) {
  const stringProperties = [];
  const boolProperties = [];

  for (const [key, value] of Object.entries(tokenProperties)) {
    if (typeof value === 'string') {
      stringProperties.push({
        key,
        value
      });
    } else if (typeof value === 'boolean') {
      boolProperties.push({
        key,
        value
      });
    }
  }

  const stringData = stringProperties.map((entry) => {
    const { key, value } = entry;

    if ((key === 'mintAmount' || key === 'decimals') && typeof value === 'string') {
      const hexNumber = Number.parseInt(value).toString(16);

      return hexNumber.length % 2 === 0 ? `@${hexNumber}` : `@0${hexNumber}`;
    }

    return `@${Buffer.from(value.toString()).toString('hex')}`;
  });

  const boolData = boolProperties.map((entry) => {
    const { key, value } = entry;

    const keyHex = Buffer.from(key.toString()).toString('hex');
    const valueHex = Buffer.from(value.toString()).toString('hex');

    return `@${keyHex}@${valueHex}`;
  });

  const transaction = {
    sender: tokenManagerAddress,
    receiver: issueTokenContractAddress,
    value: 50_000_000_000_000_000, // 0.05 EGLD
    gasLimit: '60000000',
    data: `issue${stringData}${boolData}`.replaceAll(',', '')
  };

  await refreshAccount();

  await sendTransactions({
    transactions: [transaction],
    transactionsDisplayInfo: {
      processingMessage: 'Processing "Issue token" transaction',
      errorMessage: 'An error has occured during "Issue token" transaction',
      successMessage: '"Issue token" transaction successful'
    }
  });
}
