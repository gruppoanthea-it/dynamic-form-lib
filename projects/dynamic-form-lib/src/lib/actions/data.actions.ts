import { Action } from '@ngrx/store';
import { ActionTypes } from './types';
import { DataRetrieve } from '../models';
import { Entity } from '../models/common.interface';

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
    constructor(public items: Map<string, Entity>) {}
}

export class DataUpdate implements Action {
    readonly type = ActionTypes.DATA_UPDATE;
    constructor(public item: Entity) {}
}

export class DataReset implements Action {
    readonly type = ActionTypes.DATA_RESET;
}

export class DataInsert implements Action {
    readonly type = ActionTypes.DATA_INSERT;
    constructor(public item: Entity) {}
}

export class DataDelete implements Action {
    readonly type = ActionTypes.DATA_DELETE;
    constructor(public id: string) {}
}

export type DataActions = DataFetch | DataError |
 DataSuccess | DataUpdate | DataReset | DataInsert | DataDelete;
