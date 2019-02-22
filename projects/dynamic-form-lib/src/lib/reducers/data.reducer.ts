import { EntityData } from './../models/store.interface';
import { DataActions } from './../actions/data.actions';
import { ActionTypes } from '../actions/types';

const initialState: EntityData = {
    loading: false,
    loaded: false,
    items: null,
    original: null
};

export function reducerData(state = initialState, action: DataActions) {
  switch (action.type) {
    case ActionTypes.DATA_FETCH:
        if (state.loading) {
            return state;
        }
        return {...state, loading: true, loaded: false, items: null, original: null};
    case ActionTypes.DATA_SUCCESS:
        if (state.loaded) {
            return state;
        }
        return {...state, loading: false, loaded: true, items: action.items,
             original: action.items};
    default:
      return state;
  }
}
