import { EventAction } from './../actions/events.actions';
import { combineReducers, Action } from '@ngrx/store';
import { reducerData } from './data.reducer';
import { reducerSchema } from './schema.reducer';
import { uiStateReducer } from './uistate.reducer';
import { ActionTypes } from '../actions/types';
import { EventTypes, EventReset, EventDelete, EventInsert } from '../models/events.interface';
import { LibraryState } from '../models/store.interface';
import { Entity } from '../models/common.interface';

const storeDataReducer = combineReducers({
    data: reducerData,
    schema: reducerSchema
});

export const appReducer = combineReducers({
    uiState: uiStateReducer,
    storeData: storeDataReducer
});

export function rootReducer(state: LibraryState, action: EventAction) {
    switch (action.type) {
        case ActionTypes.EVENT:
            switch (action.event.type) {
                case EventTypes.EVENT_RESET:
                    (<EventReset>action.event).changes = state.storeData.data.changes;
                    break;
                case EventTypes.EVENT_INSERT:
                    const en = new Entity();
                    en.Inserted = true;
                    (<EventInsert>action.event).item = en;
                    break;
                case EventTypes.EVENT_DELETE:
                    const selectedKey = state.uiState.selectedKey;
                    const item = state.storeData.data.items.get(selectedKey) || state.storeData.data.changes.get(selectedKey);
                    (<EventDelete>action.event).item = item;
                    break;
            }
            break;
    }
    return appReducer(state, action);
}
