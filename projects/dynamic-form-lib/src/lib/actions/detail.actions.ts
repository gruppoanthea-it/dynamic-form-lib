import { Action } from '@ngrx/store';
import { ActionTypes } from './types';

export enum DetailCommandTypes {
    RESET = 'RESET',
    UPDATE = 'UPDATE'
}

export interface IDetailCommand {
    readonly type: DetailCommandTypes;
}

export class DetailCommandReset implements IDetailCommand {
    type = DetailCommandTypes.RESET;
    constructor() {}
}

export class DetailCommandUpdate implements IDetailCommand {
    type = DetailCommandTypes.UPDATE;
    constructor(public row: any) {}
}

export type DetailCommandType = DetailCommandReset | DetailCommandUpdate;

export class DetailCommand implements Action {
    readonly type = ActionTypes.DETAIL_COMMAND;
    constructor(public command: DetailCommandType) {}
}

export class DetailCommandResult implements Action {
    readonly type = ActionTypes.DETAIL_COMMAND_RESULT;
    constructor(public result: boolean, public error: string) {}
}

export type DetailActions = DetailCommand | DetailCommandResult;
