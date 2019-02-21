import { Action } from '@ngrx/store';
import { ActionTypes, SchemaError, SchemaSuccess } from '../actions/data.actions';
import { IFormStruct } from '../models';

const initialState: ISchemaState = {
    loading: false,
    loaded: false,
    data: null,
    error: null
};

export function reducerSchema(state = initialState, action: Action) {
  switch (action.type) {
    case ActionTypes.SCHEMA_FETCH:
        if (state.loading) {
            return state;
        }
        return {...state, loading: true, loaded: false, data: null };
    case ActionTypes.SCHEMA_ERROR:
        if (state.error && state.error === (<SchemaError>action).error) {
            return state;
        }
        return {...state, loading: false, loaded: false, data: null, error: (<SchemaError>action).error};
    case ActionTypes.SCHEMA_SUCCESS:
        if (state.loaded) {
            return state;
        }
        return {...state, loading: false, loaded: true, data: (<SchemaSuccess>action).schema};
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
