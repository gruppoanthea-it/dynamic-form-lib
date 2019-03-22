import { Action } from '@ngrx/store';

export enum ActionTypes {
    VOID = 'VOID',
    NEW_FORM = 'NEW_FORM',
    EVENT = 'EVENT',
    EVENT_RESULT = 'EVENT_RESULT',
    // UI
    UI_ERROR = 'UI_ERROR',
    UI_CHANGE_ROW = 'UI_CHANGE_ROW',
    // SCHEMA
    SCHEMA_FETCH = 'SCHEMA_FETCH',
    SCHEMA_ERROR = 'SCHEMA_ERROR',
    SCHEMA_SUCCESS = 'SCHEMA_SUCCESS',
    // DATA
    DATA_FETCH = 'DATA_FETCH',
    DATA_ERROR = 'DATA_ERROR',
    DATA_SUCCESS = 'DATA_SUCCESS',
    DATA_UPDATE = 'DATA_UPDATE',
    DATA_INSERT = 'DATA_INSERT',
    DATA_DELETE = 'DATA_DELETE',
    DATA_RESET = 'DATA_RESET',
    DATA_SAVE = 'DATA_SAVE'
}

export class BaseAction {
    formId: string;
}

export class ActionVoid extends BaseAction implements Action {
    readonly type = ActionTypes.VOID;
}

export class NewFormAction extends BaseAction implements Action {
    readonly type = ActionTypes.NEW_FORM;
    constructor(public formId: string) { super(); }
}
