import { DataActions } from './../actions/data.actions';
import { ActionTypes } from '../actions/types';

const initialState: IDataState = {
    loading: false,
    loaded: false,
    data: null,
    error: null
};

export function reducerData(state = initialState, action: DataActions) {
  switch (action.type) {
    case ActionTypes.DATA_FETCH:
        if (state.loading) {
            return state;
        }
        return {...state, loading: true, loaded: false, data: null, error: null };
    case ActionTypes.DATA_ERROR:
        if (state.error && state.error === action.error) {
            return state;
        }
        return {...state, loading: false, loaded: false, data: null, error: action.error};
    case ActionTypes.DATA_SUCCESS:
        if (state.loaded) {
            return state;
        }
        return {...state, loading: false, loaded: true, data: action.data};
    default:
      return state;
  }
}

export interface IDataState {
    loading: boolean;
    loaded: boolean;
    data: any[];
    error: string;
}
