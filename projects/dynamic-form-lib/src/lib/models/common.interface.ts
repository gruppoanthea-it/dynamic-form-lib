import { HttpHeaders } from '@angular/common/http';
import { UUID } from 'angular2-uuid';

export interface RequestOptions {
    url: string;
    method: 'get' | 'post' | 'delete' | 'update';
    headers?: HttpHeaders;
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

    public delete() {
        this.Deleted = true;
    }
}
