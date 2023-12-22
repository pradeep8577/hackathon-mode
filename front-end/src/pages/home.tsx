import React, { useEffect, useReducer } from 'react';

import type {
  IAction as IChainsDataAction,
  TState as TChainsDataState
} from '@/reducers/chains-data';
import type { Reducer } from 'react';

import AuditSection from '@/components/sections/audit';
import ChainSelectorSection from '@/components/sections/chain-selector';
import SmartContractCodeViewer from '@/components/sections/smart-contract-code-viewer';
import SmartContractCustomisationsSection from '@/components/sections/smart-contract-customisations';
import EReducerState from '@/constants/reducer-state';
import { chainsDataInitialState, chainsDataReducer } from '@/reducers/chains-data';
import { LlmService } from '@/sdk/llmService.sdk';
import { IChain } from '@/sdk/src/db-schemas/ChainSchema';
import useSCIterStore from '@/store/smart-contract-iter';

export default function HomePage() {
  const [chainsDataState, dispatchChainsDataState] = useReducer<
    Reducer<TChainsDataState, IChainsDataAction>
  >(chainsDataReducer, chainsDataInitialState);

  const compileSC = useSCIterStore((store) => store.compileSC);
  const auditSC = useSCIterStore((store) => store.auditSC);
  const finalSmartContractCode = compileSC.code;

  useEffect(() => {
    async function getAllChainsData() {
      dispatchChainsDataState({ state: EReducerState.start, payload: [] });

      try {
        const chainsDataResponse = await LlmService.getAllChains();

        if (chainsDataResponse && Array.isArray(chainsDataResponse)) {
          const mappedChainsData: IChain[] = [];

          for (const data of chainsDataResponse) {
            mappedChainsData.push(data);
          }

          dispatchChainsDataState({ state: EReducerState.success, payload: mappedChainsData });
        }
      } catch (error) {
        if (error instanceof Error) {
          dispatchChainsDataState({ state: EReducerState.error, payload: [] });

          console.error('ERROR GETTING ALL CHAINS DATA', error);
        }
      }
    }

    getAllChainsData();
  }, []);

  return (
    <div className='flex w-full max-w-[1140px] flex-col'>
      <ChainSelectorSection
        isChainsDataLoading={chainsDataState.isLoading}
        chainsData={chainsDataState.chainsData}
      />
      <SmartContractCustomisationsSection chainsData={chainsDataState.chainsData} />

      {compileSC.isSuccess && auditSC.isSuccess ? (
        <>
          <AuditSection />
          <SmartContractCodeViewer smartContractCode={finalSmartContractCode} />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
