/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, { useEffect, useState } from 'react';

import { BrowserProvider, ContractFactory } from 'ethers';
import { Copy, FileDown, Loader2 } from 'lucide-react';

import { useToast } from '@/components/ui/use-toast';
import { mapChainToFileExtension } from '@/lib/mappers';
import { copyToClipboard, isClipboardApiSupported } from '@/lib/utils';
import useSelectedChainStore from '@/store/selected-chain';
import useSCIterStore from '@/store/smart-contract-iter';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import SectionContainer from './container';

interface ISmartContractCode {
  smartContractCode: string;
}

interface IContructorArgument {
  name: string;
  type: string;
}

interface IArgumentInput {
  [key: string]: string;
}

export default function SmartContractCodeViewer({ smartContractCode }: ISmartContractCode) {
  const selectedChain = useSelectedChainStore((store) => store.selectedChain);

  const { deploySC, compileSC } = useSCIterStore.getState();

  const setDeploySC = useSCIterStore((store) => store.setDeploySC);

  const { toast } = useToast();
  const [isArgumentsModalOpen, setIsArgumentsModalOpen] = useState(false);
  const [contructorArguments, setConstructorArguments] = useState<IContructorArgument[]>([]);
  const [argumentInputs, setArgumentInputs] = useState<IArgumentInput[]>([]);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    console.log('compileSC', compileSC);

    if (
      compileSC &&
      'artifact' in compileSC &&
      compileSC.artifact &&
      typeof compileSC.artifact === 'object' &&
      'abi' in compileSC.artifact &&
      compileSC.artifact.abi &&
      typeof compileSC.artifact.abi === 'object'
    ) {
      const abiElements = compileSC.artifact.abi;

      for (const element of Object.values(abiElements)) {
        if (
          element &&
          typeof element === 'object' &&
          'type' in element &&
          typeof element.type === 'string' &&
          element.type === 'constructor'
        ) {
          console.log('CONSTRUCTOR', element);

          const constructor = element;

          if (
            constructor &&
            typeof constructor === 'object' &&
            'inputs' in constructor &&
            Array.isArray(constructor.inputs)
          ) {
            // eslint-disable-next-line quotes
            console.log("CONSTRUCTOR'S INPUTS", constructor.inputs);

            const constructorArguments: IContructorArgument[] = [];
            const constructorsInputs = constructor.inputs;

            for (const input of constructorsInputs) {
              if (
                input &&
                typeof input === 'object' &&
                'name' in input &&
                typeof input.name === 'string' &&
                'type' in input &&
                typeof input.type === 'string'
              ) {
                constructorArguments.push({
                  name: input.name,
                  type: input.type
                });
              }
            }

            setConstructorArguments(constructorArguments);
          }
        }
      }
    }
  }, [compileSC]);

  useEffect(() => {
    if (!isArgumentsModalOpen) {
      setArgumentInputs([]);
    }
  }, [isArgumentsModalOpen]);

  function onArgumentInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setArgumentInputs({
      ...argumentInputs,
      [name]: value
    });
  }

  async function deployContract() {
    try {
      console.log('DEPLOYING SC');
      if (!window.ethereum) throw new Error('No ethereum provider found');

      toast({
        title: 'Success',
        description: 'Smart Contract deployment started!'
      });

      const { compileSC } = useSCIterStore.getState();
      console.log('ARTIFACT', compileSC.artifact);
      setDeploySC({ isLoading: true, isSuccess: false, isError: false, deploymentAddress: '' });

      // @ts-ignore WORKAROUND ETH ERROR
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      console.log('SIGNER', signer.address);
      // @ts-ignore WORKAROUND - AT THIS POINT WE ARE SURE THIS EXISTS
      console.log('ABI', compileSC.artifact.abi);
      // @ts-ignore WORKAROUND - AT THIS POINT WE ARE SURE THIS EXISTS
      console.log('BYTECODE', compileSC.artifact.bytecode);

      const contractFactory = new ContractFactory(
        // @ts-ignore WORKAROUND - AT THIS POINT WE ARE SURE THIS EXISTS
        compileSC.artifact.abi,
        // @ts-ignore WORKAROUND - AT THIS POINT WE ARE SURE THIS EXISTS
        compileSC.artifact.bytecode,
        signer
      );
      console.log('CONTRACT FACTORY', contractFactory);

      const deployedContract = await contractFactory.deploy(...Object.values(argumentInputs));
      console.log('DEPLOYED CONTRACT', deployedContract);
      const deploymentAddress = await deployedContract.getAddress();
      await deployedContract.waitForDeployment();

      toast({
        title: 'Success',
        description: 'Smart Contract deployed!'
      });

      setDeploySC({
        isLoading: false,
        isSuccess: true,
        isError: false,
        deploymentAddress: deploymentAddress
      });
      console.log('DEPLOYED SC ADDRESS', deploymentAddress);
    } catch (error) {
      if (error instanceof Error) {
        console.error('ERROR DEPLOYING SC', error);
        setDeploySC({ isLoading: false, isSuccess: false, isError: true, deploymentAddress: '' });

        toast({
          variant: 'destructive',
          title: 'Oops, something went wrong',
          description: 'Smart Contract deployment has failed!'
        });
      }
    }
  }

  return (
    <SectionContainer className='flex flex-col items-start justify-between gap-y-10 px-10 py-12 backdrop-blur-md'>
      <div className='flex w-full items-start justify-between'>
        <div className='flex flex-col'>
          <h2 className='mb-2 text-3xl font-semibold'>Smart Contract Code</h2>
          <h3 className='text-lg'>Get the smart contract for your {selectedChain} project</h3>
        </div>

        <div className='flex flex-col'>
          {contructorArguments.length === 0 ? (
            <Button onClick={deployContract} className='mb-2' disabled={deploySC.isLoading}>
              {deploySC.isLoading ? (
                <div className='flex gap-x-2.5'>
                  <Loader2 className='h-5 w-5 animate-spin' />
                  <p>Deploying</p>
                </div>
              ) : (
                'Deploy Smart Contract'
              )}
            </Button>
          ) : (
            <Dialog open={isArgumentsModalOpen} onOpenChange={setIsArgumentsModalOpen}>
              <DialogTrigger asChild>
                <Button className='mb-2' disabled={deploySC.isLoading}>
                  {deploySC.isLoading ? (
                    <div className='flex gap-x-2.5'>
                      <Loader2 className='h-5 w-5 animate-spin' />
                      <p>Deploying</p>
                    </div>
                  ) : (
                    'Deploy Smart Contract'
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-md'>
                <DialogHeader>
                  <DialogTitle>Deploy Smart Contract</DialogTitle>
                  <DialogDescription>
                    Here you can provide the arguments for the constructor.
                  </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-y-5'>
                  {contructorArguments.map((argument, index) => (
                    <div key={`${argument}-${index}`} className='flex flex-col gap-y-2.5'>
                      <Label htmlFor={argument.name} className='first-letter:uppercase'>
                        {argument.name}
                      </Label>

                      <Input
                        id={argument.name}
                        name={argument.name}
                        type={argument.type}
                        // @ts-ignore
                        value={argumentInputs[argument.name]}
                        placeholder={`Insert ${argument.name}`}
                        onChange={onArgumentInputChange}
                      />
                    </div>
                  ))}
                </div>
                <DialogFooter className='mt-2.5 justify-start'>
                  <Button
                    type='button'
                    onClick={() => {
                      deployContract();
                      setIsArgumentsModalOpen((previousState) => !previousState);
                    }}
                  >
                    Deploy
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <div>
            {deploySC.isSuccess && deploySC.deploymentAddress ? (
              <div className='flex items-center'>
                <p>{deploySC.deploymentAddress}</p>
                <Button
                  variant='ghost'
                  className='ml-1 h-7 w-7 p-1'
                  onClick={() => {
                    copyToClipboard(deploySC.deploymentAddress);

                    toast({
                      title: 'Success',
                      description: 'Smart Contract address copied successfully!'
                    });
                  }}
                >
                  <Copy className='h-3 w-3' />
                </Button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      <div className='relative flex w-full'>
        <Textarea
          value={smartContractCode}
          readOnly
          className='h-96 w-full resize-none rounded-3xl p-5'
        />

        <div className='absolute right-5 top-5 flex gap-x-5'>
          <Button
            variant='outline'
            className='p-2.5'
            onClick={() => {
              downloadSmartContractCode(
                smartContractCode,
                `smart-contract.${mapChainToFileExtension(selectedChain)}`
              );

              toast({
                title: 'Success',
                description: 'Smart Contract downloaded successfully!'
              });
            }}
          >
            <FileDown className='h-5 w-5' />
          </Button>
          {isClipboardApiSupported ? (
            <Button
              variant='outline'
              className='p-2.5'
              onClick={() => {
                copyToClipboard(smartContractCode);

                toast({
                  title: 'Success',
                  description: 'Smart Contract code copied successfully!'
                });
              }}
            >
              <Copy className='h-5 w-5' />
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}

function downloadSmartContractCode(smartContractCode: string, fileName: string) {
  const smartContractBlob = new Blob([smartContractCode], { type: 'text/plain' });
  const url = URL.createObjectURL(smartContractBlob);

  const temporaryAnchor = document.createElement('a');
  temporaryAnchor.href = url;
  temporaryAnchor.download = fileName;

  document.body.append(temporaryAnchor);
  temporaryAnchor.click();
  document.body.append(temporaryAnchor);

  URL.revokeObjectURL(url);
}
