import { Action } from '@ngrx/store';
import { ActionTypes, ListSelectedRow } from '../actions/actions';

const initialState: IListState = {
    selectedRow: 0
};

export function reducerList(state = initialState, action: Action) {
  switch (action.type) {
    case ActionTypes.LIST_SELECTED_ROW:
        if (state.selectedRow === (<ListSelectedRow>action).row) {
            return state;
        }
        return {...state, selectedRow: (<ListSelectedRow>action).row};
    default:
      return state;
  }
}

export interface IListState {
    selectedRow: number;
}
