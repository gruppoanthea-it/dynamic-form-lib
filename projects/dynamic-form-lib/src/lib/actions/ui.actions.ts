import { Action } from '@ngrx/store';
import { ActionTypes } from './types';

export enum CommandTypes {
    COMMAND_RESET = 'COMMAND_RESET'
}

export interface Command {
    type: CommandTypes;
    params?: {
        [key: string]: any;
    }
}

export class UiError implements Action {
    readonly type = ActionTypes.UI_ERROR;
    constructor(public context: string, public message: string) {}
}

export class UiChangeRow implements Action {
    readonly type = ActionTypes.UI_CHANGE_ROW;
    constructor(public rowKey: string) {}
}

export class UiCommand implements Action {
    readonly type = ActionTypes.UI_COMMAND;
    constructor(public command: Command) {}
}

export class UiCommandResult implements Action {
    readonly type = ActionTypes.UI_COMMAND_RESULT;
}

export type UiActions = UiError | UiChangeRow | UiCommand | UiCommandResult;
