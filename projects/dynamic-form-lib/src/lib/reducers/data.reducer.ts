import { DataActions } from './../actions/data.actions';
import { ActionTypes } from '../actions/types';
import { deepCopy, equals, mergeChanges } from '../utility/utility.functions';
import { Entity } from '../models/common.interface';
import { EntityData, Paging } from '../models/store.interface';

const defaultPaging: Paging = {
    ElementiTotali: 0,
    ElementiPerPagina: 15,
    NumeroPagina: 1,
    PagineTotali: 0
};

export function reducerData(state: EntityData, action: DataActions) {
  switch (action.type) {
    case ActionTypes.DATA_FETCH:
        if (state.loading) {
            return state;
        }
        return {...state, loading: true, loaded: false, items: null, changes: new Map(),
        paging: defaultPaging};
    case ActionTypes.DATA_SUCCESS:
        if (state.loaded) {
            return state;
        }
        return {...state, loading: false, loaded: true, items: action.items,
             changes: new Map(), paging: action.paging};
    case ActionTypes.DATA_UPDATE:
        if (!state.loaded) {
            return state;
        }
        const original = state.items.get(action.item.Id);
        const changed = !equals(original ? original.data : null, action.item.data);
        const change = new Map(state.changes);
        if (!action.item.Deleted && !action.item.Inserted) {
            action.item.Updated = changed;
        }
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
    case ActionTypes.DATA_SAVE:
        if (!state.loaded) {
            return state;
        }
        const newItems = mergeChanges(state.items, state.changes, true);
        return {...state, items: newItems, changes: new Map()};
    default:
      return state;
  }
}
