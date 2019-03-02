import { HttpHeaders } from '@angular/common/http';
import { UUID } from 'angular2-uuid';
import { deepCopy } from '../utility/utility.functions';

export interface Grid {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
}

export interface RequestOptions {
    url: string;
    method: 'get' | 'post' | 'delete' | 'update';
    headers?: HttpHeaders;
    body?: any;
}

export class Entity {
    public Id: string;
    public Updated: boolean;
    public Inserted: boolean;
    public Deleted: boolean;

    constructor(public data?: any) {
        this.Updated = false;
        this.Inserted = false;
        this.Deleted = false;
        this.Id = UUID.UUID();
        if (!this.data) {
            this.data = {};
        }
    }

    public static from(obj: Entity) {
        const el = new Entity();
        Object.assign(el, obj);
        el.data = deepCopy(obj.data);
        return el;
    }

    public delete() {
        this.Deleted = true;
    }
}
