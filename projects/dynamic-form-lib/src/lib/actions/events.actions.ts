import { Action } from '@ngrx/store';
import { ActionTypes, BaseAction } from './types';
import { EventBase } from '../models/events.interface';

export class Event extends BaseAction implements Action {
    readonly type = ActionTypes.EVENT;
    constructor(public event: EventBase) { super (); }
}

export class EventResult extends BaseAction implements Action {
    readonly type = ActionTypes.EVENT_RESULT;
    constructor(public eventResult: EventBase) { super (); }
}

export type EventAction = Event | EventResult;
