import { DetailActions, DetailCommandTypes, DetailCommandUpdate } from '../actions/detail.actions';
import { ActionTypes } from '../actions/types';

const initialState: IDetailState = {
    originalValue: null,
    currentValue: null,
    updated: false
};

export function reducerDetail(state = initialState, action: DetailActions) {
  switch (action.type) {
    case ActionTypes.DETAIL_COMMAND:
        switch (action.command.type) {
            case DetailCommandTypes.RESET:
                return {...state, currentValue: state.originalValue, updated: false};
            case DetailCommandTypes.UPDATE:
                return {...state, currentValue: (<DetailCommandUpdate>action.command).row, updated: true};
            default:
                return state;
        }
    case ActionTypes.DETAIL_COMMAND_RESULT:
        return state;
    default:
      return state;
  }
}

export interface IDetailState {
    originalValue: any;
    currentValue: any;
    updated: boolean;
}
