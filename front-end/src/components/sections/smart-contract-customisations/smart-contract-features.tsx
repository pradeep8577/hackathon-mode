import React from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import useSelectedChainStore from '@/store/selected-chain';
import useSCCustomisationsStore from '@/store/smart-contract-customisations';

interface ISmartContractFeatures {
  scFeatures: {
    Token: string[];
    NFT: string[];
    Staking: string[];
    Farm: string[];
    Marketplace: string[];
    Launchpad: string[];
  };
}

export default function SmartContractFeatures({ scFeatures }: ISmartContractFeatures) {
  const selectedChain = useSelectedChainStore((store) => store.selectedChain);

  const selectedSCTemplate = useSCCustomisationsStore((store) => store.scCustomisations.template);

  const selectedSCFeatures = useSCCustomisationsStore((store) => store.scCustomisations.features);
  const setSCFeatures = useSCCustomisationsStore((store) => store.setSCFeatures);

  return (
    <div className='flex flex-col'>
      <div className='mb-5 mt-7 sm:mb-7 sm:mt-9'>
        <h2 className='text-lg font-semibold text-title sm:text-2xl'>Features Request</h2>
        <h3 className='text-base text-subtitle sm:text-lg'>
          Choose features to activate on your {selectedChain} project
        </h3>
      </div>

      <div className='block gap-x-5'>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        {scFeatures[selectedSCTemplate]?.map((feature, index) => (
          <div
            key={`${feature}-${index}`}
            className='relative top-[5px] ml-[20px] mr-4 inline-block items-center gap-x-1.5'
          >
            <Checkbox
              id={feature}
              onCheckedChange={(isChecked) => {
                if (isChecked) {
                  setSCFeatures([...selectedSCFeatures, feature]);
                } else {
                  setSCFeatures(
                    selectedSCFeatures.filter((previousFeature) => previousFeature !== feature)
                  );
                }
              }}
            />
            <label htmlFor={feature} className='ml-2'>
              {feature}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
