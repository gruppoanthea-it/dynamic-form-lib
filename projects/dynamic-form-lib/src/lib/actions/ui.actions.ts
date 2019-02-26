import { Action } from '@ngrx/store';
import { ActionTypes } from './types';

export class UiError implements Action {
    readonly type = ActionTypes.UI_ERROR;
    constructor(public context: string, public message: string) {}
}

export class UiChangeRow implements Action {
    readonly type = ActionTypes.UI_CHANGE_ROW;
    constructor(public rowKey?: string) {}
}

export type UiActions = UiError | UiChangeRow;
