import { Entity } from './common.interface';

export enum EventTypes {
    EVENT_RESET,
    EVENT_INSERT,
    EVENT_DELETE,
    EVENT_SAVE
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
    OnEventDelete?: (event: EventDelete) => void;
    OnEventSave?: (event: EventSave) => void;
}

export interface Changes {
    inserted: Entity[];
    updated: Entity[];
    deleted: Entity[];
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

export class EventDelete extends EventBase {
    readonly type = EventTypes.EVENT_DELETE;
    constructor(public item?: Entity) {
        super();
    }
}

export class EventSave extends EventBase {
    readonly type = EventTypes.EVENT_SAVE;
    constructor(public changes?: Changes) {
        super();
    }
}
