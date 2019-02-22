import { SchemaData } from './../models/store.interface';
import { SchemaActions } from '../actions/schema.actions';
import { ActionTypes } from '../actions/types';

const initialState: SchemaData = {
    loading: false,
    loaded: false,
    item: null
};

export function reducerSchema(state = initialState, action: SchemaActions) {
  switch (action.type) {
    case ActionTypes.SCHEMA_FETCH:
        if (state.loading) {
            return state;
        }
        return {...state, loading: true, loaded: false, item: null };
    case ActionTypes.SCHEMA_ERROR:
        if (!state.loading) {
            return state;
        }
        return {...state, loading: false, loaded: false, item: null};
    case ActionTypes.SCHEMA_SUCCESS:
        if (state.loaded) {
            return state;
        }
        return {...state, loading: false, loaded: true, item: action.item};
    default:
      return state;
  }
}
