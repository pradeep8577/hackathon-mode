import React from 'react';

import Anchor from '@/components/anchor';
import TemplateIcon from '@/components/icons/template';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import useSelectedChainStore from '@/store/selected-chain';
import useSCCustomisationsStore from '@/store/smart-contract-customisations';

interface ISmartContractTemplates {
  scTemplates: string[];
}

export default function SmartContractTemplates({ scTemplates }: ISmartContractTemplates) {
  const selectedChain = useSelectedChainStore((store) => store.selectedChain);

  const selectedSCTemplate = useSCCustomisationsStore((store) => store.scCustomisations.template);
  const setSCTemplate = useSCCustomisationsStore((store) => store.setSCTemplate);
  const setSCFeatures = useSCCustomisationsStore((store) => store.setSCFeatures);

  return (
    <div className='flex w-[100%] flex-col'>
      <div className='mb-6 flex w-full flex-col items-start justify-between sm:mb-11 md:flex-row'>
        <div className='flex flex-col '>
          <h2 className='text-lg font-semibold sm:text-2xl'>Select Template</h2>
          <h3 className='text-base font-medium text-text500 sm:text-lg'>
            Choose modules to activate on your project, you can configure them later
          </h3>
        </div>

        <Anchor
          href='https://docs.defibuilder.com/multiversex/xdefi'
          className='ml-0 mt-3 flex h-[40px] w-[150px] items-center justify-center rounded-xl border border-[#212b2d] bg-[#151616] text-sm font-medium text-[#F5F7FB] hover:bg-[#8aebfc33] sm:h-[54px] sm:w-[190px] sm:text-base md:ml-1 md:mt-0'
        >
          Explore Docs
        </Anchor>
      </div>

      <div className='grid gap-4 min-[420px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6'>
        {scTemplates.map((scTemplate, index) => (
          <Card
            key={`${scTemplate}-${index}`}
            tabIndex={0}
            role='button'
            className={cn(' cursor-pointer rounded-3xl border-2 border-cardborder  ', {
              'border-active ': selectedSCTemplate === scTemplate
            })}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                setSCTemplate(scTemplate);
                setSCFeatures([]);
              }
            }}
            onClick={() => {
              setSCTemplate(scTemplate);
              setSCFeatures([]);
            }}
          >
            <CardHeader className='p-4 text-center'>
              <CardTitle className='flex flex-col items-center gap-y-2.5 text-xl'>
                <TemplateIcon />
                <span className='text-[18px] font-medium text-cardtext'>{scTemplate}</span>
              </CardTitle>
              <CardDescription>
                Generate a {selectedChain} custom {scTemplate}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
