import React, { memo, Reducer, useCallback, useEffect, useReducer } from 'react';

import type {
  IAction as IPromptsDataAction,
  TState as TPromptsDataState
} from '@/reducers/prompts-data';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import EReducerState from '@/constants/reducer-state';
import { promptsDataInitialState, promptsDataReducer } from '@/reducers/prompts-data';
import { LlmService } from '@/sdk/llmService.sdk';
import { IPrompt } from '@/sdk/src/db-schemas/PromptSchema';
import useSelectedChainStore from '@/store/selected-chain';
import useSCCustomisationsStore from '@/store/smart-contract-customisations';

interface PromptsDataState {
  isLoading: boolean;
  promptsData: IPrompt[];
  // Include other state properties if there are any
}
interface PromptProperties {
  promptsDataState: PromptsDataState;
  selectPrompt: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function PromptModalComponent({ promptsDataState, selectPrompt }: PromptProperties) {
  // if (!promptsDataState.isLoading && promptsDataState.promptsData.length === 0) {
  //   return undefined;
  // }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className='mb-2 ml-1 w-24 rounded bg-blue-200 py-1 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-blue-600'
          type='button'
        >
          Prompt
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-50'>
        <DialogHeader>
          <DialogTitle>Predefined Prompt</DialogTitle>
          <DialogDescription>Select your desired prompt:</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <ul className='mb-4 space-y-4'>
            {promptsDataState.isLoading ? (
              <Skeleton className='h-10 w-96' />
            ) : (
              promptsDataState.promptsData.map((prompt: IPrompt, index: number) => {
                // Ensure the ID is unique and valid
                const promptId = `prompt-${index}`;
                return (
                  <DialogClose asChild key={promptId}>
                    <li>
                      <input
                        type='radio'
                        id={promptId}
                        name='prompt'
                        value={prompt.description}
                        className='peer hidden'
                        required
                        onChange={selectPrompt}
                      />
                      <label
                        htmlFor={promptId}
                        className='inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-5 text-gray-900 hover:bg-gray-100 hover:text-gray-900 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 dark:hover:text-gray-300 dark:peer-checked:text-blue-500'
                      >
                        <div className='block'>
                          <div className='w-full text-lg font-semibold'>{prompt.title}</div>
                          <div className='w-full text-gray-500 dark:text-gray-400'>
                            {prompt.description}
                          </div>
                        </div>
                      </label>
                    </li>
                  </DialogClose>
                );
              })
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const PromptModal = memo(PromptModalComponent);

export default function SmartContractDescription() {
  const [promptsDataState, dispatchPromptsDataState] = useReducer<
    Reducer<TPromptsDataState, IPromptsDataAction>
  >(promptsDataReducer, promptsDataInitialState);

  const selectedChain = useSelectedChainStore((store) => store.selectedChain);
  const scDescription = useSCCustomisationsStore((store) => store.scCustomisations.description);
  const setSCDescription = useSCCustomisationsStore((store) => store.setSCDescription);

  const handleChainsDataError = useCallback((error: unknown) => {
    dispatchPromptsDataState({ state: EReducerState.error, payload: [] });
    console.error('ERROR GETTING PROMPTS DATA', error);
  }, []);

  const getPromptsData = useCallback(async () => {
    dispatchPromptsDataState({ state: EReducerState.start, payload: [] });

    try {
      const promptsDataResponse = await LlmService.getPrompts();
      if (promptsDataResponse && Array.isArray(promptsDataResponse)) {
        const mappedPromptsData: IPrompt[] = promptsDataResponse.map((data) => data);
        dispatchPromptsDataState({ state: EReducerState.success, payload: mappedPromptsData });
      }
    } catch (error) {
      if (error instanceof Error) {
        handleChainsDataError(error);
      }
    }
  }, [handleChainsDataError]);

  useEffect(() => {
    getPromptsData();
  }, [getPromptsData]);

  const selectPrompt = useCallback(
    (promptEle: React.ChangeEvent<HTMLInputElement>) => {
      setSCDescription(promptEle.target.value);
    },
    [setSCDescription]
  );

  return (
    <div className='flex w-full flex-col'>
      <div className='mb-6 mt-9 sm:mb-9 sm:mt-12'>
        <h2 className='text-lg font-semibold text-title sm:text-2xl'>Describe Customization</h2>
        <h3 className='text-base font-medium text-subtitle sm:text-lg'>
          Choose customization to add into your {selectedChain} project
        </h3>
      </div>
      {/* <button
        className='active:bg-grey-600 mb-2 ml-1 w-24 rounded bg-blue-300 py-1 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none'
        type='button'
        onClick={() => setShowPromptModal(true)}
      >
        Prompt
      </button>

      {showPromptModal && (
        <PromptModal
          promptsDataState={promptsDataState}
          selectPrompt={selectPrompt}
          onClose={() => setShowPromptModal(false)}
        />
      )} */}
      {/* <PromptModal promptsDataState={promptsDataState} selectPrompt={selectPrompt} /> */}
      <Textarea
        value={scDescription}
        placeholder='Insert token name, supply and others customisations'
        className='h-60 w-full resize-none rounded-3xl p-5'
        onChange={(event) => setSCDescription(event.target.value)}
      />
    </div>
  );
}
