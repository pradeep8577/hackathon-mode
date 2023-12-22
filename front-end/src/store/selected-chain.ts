import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import EStorageKeys from '@/constants/storage-keys';

interface IState {
  selectedChain: string;
}

interface IActions {
  setSelectedChain: (selectedChain: string) => void;
}

const useSelectedChainStore = create(
  persist<IState & IActions>(
    (set) => ({
      selectedChain: 'Mode',
      setSelectedChain: (selectedChain: string) => set((state) => ({ ...state, selectedChain }))
    }),
    {
      name: EStorageKeys.selectedChain
    }
  )
);

export default useSelectedChainStore;
