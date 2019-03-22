import { Action } from '@ngrx/store';
import { ActionTypes, BaseAction } from './types';

export class UiError extends BaseAction implements Action {
    readonly type = ActionTypes.UI_ERROR;
    constructor(public context: string, public message: string) { super (); }
}

export class UiChangeRow extends BaseAction implements Action {
    readonly type = ActionTypes.UI_CHANGE_ROW;
    constructor(public rowKey?: string) { super (); }
}

export type UiActions = UiError | UiChangeRow;
