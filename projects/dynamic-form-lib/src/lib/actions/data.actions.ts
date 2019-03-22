import { Action } from '@ngrx/store';
import { ActionTypes, BaseAction } from './types';
import { DataRetrieve } from '../models';
import { Entity } from '../models/common.interface';
import { Paging } from '../models/store.interface';

export class DataFetch extends BaseAction implements Action {
    readonly type = ActionTypes.DATA_FETCH;
    constructor(public options: DataRetrieve) { super(); }
}

export class DataError extends BaseAction implements Action {
    readonly type = ActionTypes.DATA_ERROR;
    constructor(public error: string) { super (); }
}

export class DataSuccess extends BaseAction implements Action {
    readonly type = ActionTypes.DATA_SUCCESS;
    constructor(public items: Map<string, Entity>, public paging: Paging) { super (); }
}

export class DataUpdate extends BaseAction implements Action {
    readonly type = ActionTypes.DATA_UPDATE;
    constructor(public item: Entity) { super (); }
}

export class DataReset extends BaseAction implements Action {
    readonly type = ActionTypes.DATA_RESET;
}

export class DataInsert extends BaseAction implements Action {
    readonly type = ActionTypes.DATA_INSERT;
    constructor(public item: Entity) { super (); }
}

export class DataDelete extends BaseAction implements Action {
    readonly type = ActionTypes.DATA_DELETE;
    constructor(public id: string) { super (); }
}

export class DataSave extends BaseAction implements Action {
    readonly type = ActionTypes.DATA_SAVE;
}

export type DataActions = DataFetch | DataError |
 DataSuccess | DataUpdate | DataReset | DataInsert |
 DataDelete | DataSave;
