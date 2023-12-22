import { create } from 'zustand';

interface ISCCustomisation {
  template: string;
  features: string[];
  description: string;
}

interface IState {
  scCustomisations: ISCCustomisation;
}

interface IActions {
  setSCTemplate: (template: string) => void;
  setSCFeatures: (features: string[]) => void;
  setSCDescription: (description: string) => void;
}

const useSCCustomisationsStore = create<IState & IActions>((set) => ({
  scCustomisations: {
    template: 'Token',
    features: [],
    description: ''
  },
  setSCTemplate: (template: string) =>
    set((state) => ({
      scCustomisations: {
        ...state.scCustomisations,
        template
      }
    })),
  setSCFeatures: (features: string[]) =>
    set((state) => ({
      scCustomisations: {
        ...state.scCustomisations,
        features
      }
    })),
  setSCDescription: (description: string) =>
    set((state) => ({
      scCustomisations: {
        ...state.scCustomisations,
        description
      }
    }))
}));

export default useSCCustomisationsStore;
