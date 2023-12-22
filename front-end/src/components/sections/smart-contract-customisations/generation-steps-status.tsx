import React from 'react';

import { Check, Loader2, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import useSCIterStore from '@/store/smart-contract-iter';

export default function GenerationStepsState() {
  const generateSC = useSCIterStore((store) => store.generateSC);
  const compileSC = useSCIterStore((store) => store.compileSC);
  const auditSC = useSCIterStore((store) => store.auditSC);

  const generationSteps = [
    {
      number: 1,
      step: 'Generating',
      isLoading: generateSC.isLoading,
      isSuccess: generateSC.isSuccess,
      isError: generateSC.isError,
      isStepConnected: true
    },
    {
      number: 2,
      step: 'Compiling',
      isLoading: compileSC.isLoading,
      isSuccess: compileSC.isSuccess,
      isError: compileSC.isError,
      isStepConnected: true
    },
    {
      number: 3,
      step: 'Auditing',
      isLoading: auditSC.isLoading,
      isSuccess: auditSC.isSuccess,
      isError: auditSC.isError,
      isStepConnected: true
    },
    {
      number: 4,
      step: 'Completed',
      isLoading: false,
      isSuccess: generateSC.isSuccess && compileSC.isSuccess && auditSC.isSuccess,
      isError: generateSC.isError && compileSC.isError && auditSC.isError,
      isStepConnected: false
    }
  ];

  return (
    <div className='flex gap-x-5'>
      {generationSteps.map((generationStep, index) => (
        <Step
          key={`${generationStep.step}-${index}`}
          number={generationStep.number}
          step={generationStep.step}
          isLoading={generationStep.isLoading}
          isSuccess={generationStep.isSuccess}
          isError={generationStep.isError}
          isStepConnected={generationStep.isStepConnected}
        />
      ))}
    </div>
  );
}

interface IStep {
  number: number;
  step: string;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isStepConnected: boolean;
}

/* eslint-disable unicorn/no-nested-ternary */
function Step({ number, step, isLoading, isSuccess, isError, isStepConnected }: IStep) {
  return (
    <div className='flex flex-col items-center justify-center gap-y-1.5'>
      <div
        className={cn(
          'relative flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 bg-primary p-1 text-primary-foreground',
          { 'bg-blue-500 text-whiteMediumColor': isSuccess, 'bg-red-500 text-[#fafafa]': isError }
        )}
      >
        {isLoading ? (
          <Loader2 className='h-7 w-7 animate-spin ' />
        ) : isSuccess ? (
          <Check className='h-5 w-5' />
        ) : isError ? (
          <X className='h-5 w-5' />
        ) : (
          <span className='text-white'>{number}</span>
        )}

        {isStepConnected && (
          <span
            className={cn(
              'absolute left-[7px] -z-[1] h-1 w-24 bg-blue-500 bg-primary text-primary-foreground',
              {
                'bg-blue-500': isSuccess,
                'bg-red-500': isError
              }
            )}
          />
        )}
      </div>
      <span className='text-[12px] font-medium text-textGrayColor sm:text-[16px]'>{step}</span>
    </div>
  );
}
