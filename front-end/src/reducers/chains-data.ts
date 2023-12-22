import EReducerState from '@/constants/reducer-state';
import { IChain } from '@/sdk/src/db-schemas/ChainSchema';

const chainsDataInitialState = {
  isLoading: false,
  isError: false,
  chainsData: [] as IChain[]
};

type TState = typeof chainsDataInitialState;

interface IAction {
  state: EReducerState;
  payload: IChain[];
}

function chainsDataReducer(state: TState, action: IAction) {
  switch (action.state) {
    case EReducerState.start: {
      return {
        isLoading: true,
        isError: false,
        chainsData: [] as IChain[]
      };
    }
    case EReducerState.success: {
      return {
        ...state,
        isLoading: false,
        chainsData: action.payload
      };
    }
    case EReducerState.error: {
      return {
        isLoading: false,
        isError: true,
        chainsData: [] as IChain[]
      };
    }
    default: {
      return state;
    }
  }
}

export type { TState, IAction };
export { chainsDataInitialState, chainsDataReducer };
