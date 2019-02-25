import { combineReducers, Action } from '@ngrx/store';
import { reducerData } from './data.reducer';
import { reducerSchema } from './schema.reducer';
import { uiStateReducer } from './uistate.reducer';
import { ActionTypes } from '../actions/types';
import { EventAction } from '../actions/events.actions';
import { EventTypes, EventReset, EventDelete } from '../models/events.interface';
import { LibraryState } from '../models/store.interface';

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
        case ActionTypes.EVENT_RESULT:
            switch (action.eventResult.type) {
                case EventTypes.EVENT_RESET:
                    (<EventReset>action.eventResult).changes = state.storeData.data.changes;
                    break;
                case EventTypes.EVENT_DELETE:
                    const selectedKey = state.uiState.selectedKey;
                    const item = state.storeData.data.items.get(selectedKey) || state.storeData.data.changes.get(selectedKey);
                    (<EventDelete>action.eventResult).item = item;
                    break;
            }

    }
    return appReducer(state, action);
}
