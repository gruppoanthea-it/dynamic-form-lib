import { EventAction } from './../actions/events.actions';
import { combineReducers, Action } from '@ngrx/store';
import { reducerData } from './data.reducer';
import { reducerSchema } from './schema.reducer';
import { uiStateReducer } from './uistate.reducer';
import { ActionTypes, BaseAction } from '../actions/types';
import { EventTypes, EventReset, EventDelete, EventInsert, EventSave, Changes } from '../models/events.interface';
import { LibraryState, StoreData, UiState, SchemaData, EntityData } from '../models/store.interface';
import { Entity } from '../models/common.interface';


const uiInitialState: UiState = {
    selectedKey: null,
    lastSelectedKey: null,
    error: null
};

const schemaInitialState: SchemaData = {
    loading: false,
    loaded: false,
    item: null
};

const dataInitialState: EntityData = {
    loading: false,
    loaded: false,
    paging: null,
    items: null,
    changes: new Map()
};

const storeInitialState: StoreData = {
    data: dataInitialState,
    schema : schemaInitialState
};


const storeDataReducer = combineReducers({
    data: reducerData,
    schema: reducerSchema
});

const itemReducer = combineReducers({
    items: itemsReducerFun
});

export const appReducer = combineReducers({
    uiState: uiStateReducer,
    storeData: storeDataReducer
});

export function itemsReducerFun(state: Map<string, {
    uiState: UiState;
    storeData: StoreData;
}>, action: BaseAction & Action) {
    switch (action.type) {
        case ActionTypes.NEW_FORM: {
            state.set(action.formId, {uiState: uiInitialState, storeData: storeInitialState});
            const entries = state.entries();
            return new Map(entries);
        }
    }
    if (!state) {
        return new Map();
    }
    if (!state.has(action.formId)) {
        return state;
    }
    const appState = appReducer(state.get(action.formId), action);
    state.set(action.formId, appState);
    return new Map(state.entries());
}

export function rootReducer(state: LibraryState, action: EventAction) {
    switch (action.type) {
        case ActionTypes.EVENT:
            if (state.items.has(action.formId)) {
                const curForm = state.items.get(action.formId);
                switch (action.event.type) {
                    case EventTypes.EVENT_RESET:
                        (<EventReset>action.event).changes = curForm.storeData.data.changes;
                        break;
                    case EventTypes.EVENT_INSERT:
                        const en = new Entity();
                        en.Inserted = true;
                        (<EventInsert>action.event).item = en;
                        break;
                    case EventTypes.EVENT_DELETE:
                        const selectedKey = curForm.uiState.selectedKey;
                        const item = curForm.storeData.data.items.get(selectedKey) ||
                            curForm.storeData.data.changes.get(selectedKey);
                        (<EventDelete>action.event).item = item;
                        break;
                    case EventTypes.EVENT_SAVE:
                        const formChanges =  curForm.storeData.data.changes;
                        const changes: Changes = {
                            inserted: [],
                            updated: [],
                            deleted: []
                        };
                        formChanges.forEach((value) => {
                            if (value.Inserted) {
                                changes.inserted.push(value);
                            } else if (value.Updated) {
                                changes.updated.push(value);
                            } else {
                                changes.deleted.push(value);
                            }
                        });
                        (<EventSave>action.event).changes = changes;
                    break;
                }
            }
            break;
    }
    if (!state) {
        return {
            items: new Map<string, {
                uiState: UiState;
                storeData: StoreData;
            }>()
        };
    }
    const newState = itemReducer(state, action);
    return {...state, ...newState };
}
