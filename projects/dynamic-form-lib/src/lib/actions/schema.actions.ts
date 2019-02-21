import { Action } from '@ngrx/store';
import { IFormStruct } from '../models';
import { ActionTypes } from './types';

export class SchemaFetch implements Action {
    readonly type = ActionTypes.SCHEMA_FETCH;
}

export class SchemaError implements Action {
    readonly type = ActionTypes.SCHEMA_ERROR;
    constructor(public error: string) {}
}

export class SchemaSuccess implements Action {
    readonly type = ActionTypes.SCHEMA_SUCCESS;
    constructor(public schema: IFormStruct) {}
}

export type SchemaActions = SchemaFetch | SchemaError | SchemaSuccess;
