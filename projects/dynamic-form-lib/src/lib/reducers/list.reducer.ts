import { ListActions, ListCommandTypes, ListCommandChangeRow } from '../actions/list.actions';
import { ActionTypes } from '../actions/types';

const initialState: IListState = {
    selectedRow: 0
};

export function reducerList(state = initialState, action: ListActions) {
  switch (action.type) {
    case ActionTypes.LIST_COMMAND:
        switch(action.command.type) {
            case ListCommandTypes.CHANGE_ROW:
                return {...state, selectedRow: (<ListCommandChangeRow>action.command).index};
            default:
                return state;
        }
    default:
      return state;
  }
}

export interface IListState {
    selectedRow: number;
}
