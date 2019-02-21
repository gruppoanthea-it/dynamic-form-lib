import { Action } from '@ngrx/store';
import { ActionTypes } from './types';

export enum ListCommandTypes {
    CHANGE_ROW = 'CHANGE_ROW',
    RESET = 'RESET',
    UPDATE = 'UPDATE'
}

export interface IListCommand {
    readonly type: ListCommandTypes;
}

export class ListCommandChangeRow implements IListCommand {
    type = ListCommandTypes.CHANGE_ROW;
    constructor(public index: number) {}
}

export class ListCommandReset implements IListCommand {
    type = ListCommandTypes.RESET;
    constructor() {}
}

export class ListCommandUpdate implements IListCommand {
    type = ListCommandTypes.UPDATE;
    constructor(public row: any) {}
}

export type ListCommandType = ListCommandReset | ListCommandUpdate;

export class ListCommand implements Action {
    readonly type = ActionTypes.LIST_COMMAND;
    constructor(public command: ListCommandType) {}
}

export class ListCommandResult implements Action {
    readonly type = ActionTypes.LIST_COMMAND_RESULT;
    constructor(public result: boolean, public error: string) {}
}

export type ListActions = ListCommand | ListCommandResult;
