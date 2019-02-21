import { combineReducers } from '@ngrx/store';
import { reducerData } from './data.reducer';
import { reducerDetail } from './detail.reducer';
import { reducerList } from './list.reducer';
import { reducerSchema } from './schema.reducer';

export const reducers = combineReducers({
    data: reducerData,
    detail: reducerDetail,
    list: reducerList,
    schema: reducerSchema
});
