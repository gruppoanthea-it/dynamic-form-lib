import { EntityData } from './../models/store.interface';
import { DataActions } from './../actions/data.actions';
import { ActionTypes } from '../actions/types';
import { deepCopy, equals } from '../utility/utility.functions';
import { Entity } from '../models/common.interface';

const initialState: EntityData = {
    loading: false,
    loaded: false,
    items: null,
    changes: new Map()
};

export function reducerData(state = initialState, action: DataActions) {
  switch (action.type) {
    case ActionTypes.DATA_FETCH:
        if (state.loading) {
            return state;
        }
        return {...state, loading: true, loaded: false, items: null, changes: new Map()};
    case ActionTypes.DATA_SUCCESS:
        if (state.loaded) {
            return state;
        }
        return {...state, loading: false, loaded: true, items: action.items,
             changes: new Map()};
    case ActionTypes.DATA_UPDATE:
        if (!state.loaded) {
            return state;
        }
        const original = state.items.get(action.item.Id);
        const changed = !equals(original ? original.data : null, action.item.data);
        const change = new Map(state.changes);
        if (changed) {
            change.set(action.item.Id, action.item);
        } else {
            change.delete(action.item.Id);
        }
        return {...state, items: state.items, changes: change};
    case ActionTypes.DATA_RESET:
        if (!state.loaded && state.changes.size === 0) {
            return state;
        }
        return {...state, changes: new Map()};
    case ActionTypes.DATA_INSERT:
        if (!state.loaded) {
            return state;
        }
        const changes = new Map(state.changes);
        changes.set(action.item.Id, action.item);
        return {...state, changes: changes};
    default:
      return state;
  }
}
