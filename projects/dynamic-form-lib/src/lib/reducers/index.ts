import { combineReducers } from '@ngrx/store';
import { reducerData } from './data.reducer';
import { reducerSchema } from './schema.reducer';
import { uiStateReducer } from './uistate.reducer';

const storeDataReducer = combineReducers({
    data: reducerData,
    schema: reducerSchema
});

export const rootReducer = combineReducers({
    uiState: uiStateReducer,
    storeData: storeDataReducer
});
