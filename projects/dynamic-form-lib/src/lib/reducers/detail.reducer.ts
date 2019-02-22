import { DetailActions } from '../actions/detail.actions';
import { ActionTypes } from '../actions/types';

const initialState: IDetailState = {
    updated: false
};

export function reducerDetail(state = initialState, action: DetailActions) {
  switch (action.type) {
    case ActionTypes.DETAIL_COMMAND:
        return state;
    case ActionTypes.DETAIL_COMMAND_RESULT:
        return state;
    default:
      return state;
  }
}

export interface IDetailState {
    updated: boolean;
}
