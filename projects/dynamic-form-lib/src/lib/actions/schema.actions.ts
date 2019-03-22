import { SchemaRetrieve } from './../models/schema.retrieve';
import { Action } from '@ngrx/store';
import { Struct } from '../models';
import { ActionTypes, BaseAction } from './types';

export class SchemaFetch extends BaseAction implements Action {
    readonly type = ActionTypes.SCHEMA_FETCH;
    constructor(public options: SchemaRetrieve) { super (); }
}

export class SchemaError extends BaseAction implements Action {
    readonly type = ActionTypes.SCHEMA_ERROR;
    constructor(public error: string) { super (); }
}

export class SchemaSuccess extends BaseAction implements Action {
    readonly type = ActionTypes.SCHEMA_SUCCESS;
    constructor(public item: Struct) { super (); }
}

export type SchemaActions = SchemaFetch | SchemaError | SchemaSuccess;
