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
    case ActionTypes.DATA_DELETE:
        if (!state.loaded) {
            return state;
        }
        let item: Entity = null;
        const change1 = new Map(state.changes);
        if (change1.has(action.id)) {
            item = change1.get(action.id);
            console.log(item);
            if (item.Inserted) {
                change1.delete(action.id);
            } else {
                item.Deleted = true;
                change1.set(item.Id, item);
            }
        } else {
            item = deepCopy(state.items.get(action.id));
            item.Deleted = true;
            change1.set(item.Id, item);
        }
        return {...state, changes: change1};
    default:
      return state;
  }
}
