import { Action } from '@ngrx/store';
import { ActionTypes } from './types';

export class DataFetch implements Action {
    readonly type = ActionTypes.DATA_FETCH;
}

export class DataError implements Action {
    readonly type = ActionTypes.DATA_ERROR;
    constructor(public error: string) {}
}

export class DataSuccess implements Action {
    readonly type = ActionTypes.DATA_SUCCESS;
    constructor(public data: any[]) {}
}

export type DataActions = DataFetch | DataError | DataSuccess;
