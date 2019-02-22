import { IFormStruct } from '../models';
import { SchemaActions } from '../actions/schema.actions';
import { ActionTypes } from '../actions/types';

const initialState: ISchemaState = {
    loading: false,
    loaded: false,
    data: null,
    error: null
};

export function reducerSchema(state = initialState, action: SchemaActions) {
  switch (action.type) {
    case ActionTypes.SCHEMA_FETCH:
        if (state.loading) {
            return state;
        }
        return {...state, loading: true, loaded: false, data: null };
    case ActionTypes.SCHEMA_ERROR:
        if (state.error && state.error === action.error) {
            return state;
        }
        return {...state, loading: false, loaded: false, data: null, error: action.error};
    case ActionTypes.SCHEMA_SUCCESS:
        if (state.loaded) {
            return state;
        }
        return {...state, loading: false, loaded: true, data: action.schema};
    default:
      return state;
  }
}

export interface ISchemaState {
    loading: boolean;
    loaded: boolean;
    data: IFormStruct;
    error: string;
}
