import { create } from 'zustand';

import IAuditResponse from '@/interfaces/audit-response';

interface ICommonState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface IGenerateSCState extends ICommonState {
  smartContract: string;
}

interface ICompileSCState extends ICommonState {
  compilationOutput: string;
  artifact: unknown; // Hardhat Artifact
  code: string;
}

interface IAuditSCState extends ICommonState {
  auditingOutput: IAuditResponse[] | string;
}

interface IDeploySCState extends ICommonState {
  deploymentAddress: string;
  // args: uknown[];
}

interface IState {
  generateSC: IGenerateSCState;
  compileSC: ICompileSCState;
  auditSC: IAuditSCState;
  deploySC: IDeploySCState;
}

interface IActions {
  setGenerateSC: (state: IGenerateSCState) => void;
  setCompileSC: (state: ICompileSCState) => void;
  setAuditSC: (state: IAuditSCState) => void;
  setDeploySC: (state: IDeploySCState) => void;
  reset: () => void;
}

const initialState: IState = {
  generateSC: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    smartContract: ''
  },
  compileSC: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    code: '',
    compilationOutput: '',
    artifact: {}
  },
  auditSC: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    auditingOutput: [] as IAuditResponse[]
  },
  deploySC: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    deploymentAddress: ''
  }
};

const useSCIterStore = create<IState & IActions>((set) => ({
  ...initialState,
  setGenerateSC: (state: IGenerateSCState) =>
    set((previousState) => ({ generateSC: { ...previousState.generateSC, ...state } })),
  setCompileSC: (state: ICompileSCState) =>
    set((previousState) => ({ compileSC: { ...previousState.compileSC, ...state } })),
  setAuditSC: (state: IAuditSCState) =>
    set((previousState) => ({ auditSC: { ...previousState.auditSC, ...state } })),
  setDeploySC: (state: IDeploySCState) =>
    set((previousState) => ({ deploySC: { ...previousState.deploySC, ...state } })),
  reset: () => {
    set(initialState);
  }
}));

export default useSCIterStore;
