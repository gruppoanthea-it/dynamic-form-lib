import { Action } from '@ngrx/store';
import { ActionTypes } from './types';
import { DataRetrieve } from '../models';

export class DataFetch implements Action {
    readonly type = ActionTypes.DATA_FETCH;
    constructor(public options: DataRetrieve) {}
}

export class DataError implements Action {
    readonly type = ActionTypes.DATA_ERROR;
    constructor(public error: string) {}
}

export class DataSuccess implements Action {
    readonly type = ActionTypes.DATA_SUCCESS;
    constructor(public items: {[key: string]: any}) {}
}

export type DataActions = DataFetch | DataError | DataSuccess;
