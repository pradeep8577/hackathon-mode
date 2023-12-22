import EReducerState from '@/constants/reducer-state';
import { IPrompt } from '@/sdk/src/db-schemas/PromptSchema';

const promptsDataInitialState = {
  isLoading: false,
  isError: false,
  promptsData: [] as IPrompt[]
};

type TState = typeof promptsDataInitialState;

interface IAction {
  state: EReducerState;
  payload: IPrompt[];
}

function promptsDataReducer(state: TState, action: IAction) {
  switch (action.state) {
    case EReducerState.start: {
      return {
        isLoading: true,
        isError: false,
        promptsData: [] as IPrompt[]
      };
    }
    case EReducerState.success: {
      return {
        ...state,
        isLoading: false,
        promptsData: action.payload
      };
    }
    case EReducerState.error: {
      return {
        isLoading: false,
        isError: true,
        promptsData: [] as IPrompt[]
      };
    }
    default: {
      return state;
    }
  }
}

export type { TState, IAction };
export { promptsDataInitialState, promptsDataReducer };
