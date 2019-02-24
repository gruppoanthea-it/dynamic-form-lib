import { Action } from '@ngrx/store';
import { ActionTypes } from './types';
import { EventBase } from '../models/events.interface';

export class Event implements Action {
    readonly type = ActionTypes.EVENT;
    constructor(public event: EventBase) {}
}

export class EventResult implements Action {
    readonly type = ActionTypes.EVENT_RESULT;
    constructor(public eventResult: EventBase) {}
}

export type EventAction = Event | EventResult;
