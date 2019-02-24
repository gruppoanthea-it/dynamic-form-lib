import { Entity } from './common.interface';

export enum EventTypes {
    EVENT_RESET,
    EVENT_INSERT
}

export abstract class EventBase {
    cancel: boolean;
    abstract readonly type: EventTypes;
    constructor() {
        this.cancel = false;
    }
}

export interface EventOptions {
    OnEventReset?: (event: EventReset) => void;
    OnEventInsert?: (event: EventInsert) => void;
}

/**
 * Event fired when reset button is pressed
 */
export class EventReset extends EventBase {
    readonly type = EventTypes.EVENT_RESET;
    constructor(public changes?: Map<string, Entity>) {
        super();
    }
}
/**
 * Event fired when new item is added
 */
export class EventInsert extends EventBase {
    readonly type = EventTypes.EVENT_INSERT;
    constructor(public item?: Entity) {
        super();
    }
}
