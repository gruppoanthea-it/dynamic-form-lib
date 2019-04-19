import { SchemaRetrieve, DataRetrieve } from 'projects/dynamic-form-lib/src/public_api';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { EventBase } from '../models/events.interface';
import { ValueOptionRetrieve } from '../models';

@Injectable({
    providedIn: 'root'
})
export class DynamicFormService {

    public eventNotifier$: Subject<EventBase>;
    public valueOptionRetrieve: Map<string, ValueOptionRetrieve>;
    private dataRetrieveOptions: Map<string, DataRetrieve>;

    constructor(private http: HttpClient) {
        this.eventNotifier$ = new Subject();
        this.dataRetrieveOptions = new Map<string, DataRetrieve>();
    }

    getDefaultDataRetrieve(formId: string) {
        return this.dataRetrieveOptions.get(formId);
    }

    setValueOptionRetrieve(options: Map<string, ValueOptionRetrieve>) {
        this.valueOptionRetrieve = options;
    }

    retrieveSchema(options: SchemaRetrieve) {
        // Creo la richiesta per lo schema
        let schemaRequestDef = new HttpRequest(options.request.method,
            options.request.url, options.request.body, {
                headers: options.request.headers
            });
        if (options.onGetSchema) {
            schemaRequestDef = options.onGetSchema(schemaRequestDef);
        }
        // Creo l'observable per la richiesta dello schema
        return this.http.request(schemaRequestDef);
    }

    retrieveData(formId: string, options: DataRetrieve) {
        if (!options && !this.dataRetrieveOptions) {
            return null;
        }
        if (!this.dataRetrieveOptions.has(formId)) {
            this.dataRetrieveOptions.set(formId, options);
        }
        if (!options) {
            options = this.dataRetrieveOptions.get(formId);
        }
        // Creo la richiesta per i dati
        let dataRequestDef = new HttpRequest(options.request.method,
            options.request.url, options.request.body, {
                headers: options.request.headers
            });
        if (options.onGetData) {
            dataRequestDef = options.onGetData(dataRequestDef, options.paging);
        }
        // Creo l'observable per la richiesta dei dati
        return this.http.request(dataRequestDef);
    }

    retrieveOptions(fieldName: string) {
        if (!this.valueOptionRetrieve.has(fieldName)) {
            return null;
        }
        const options = this.valueOptionRetrieve.get(fieldName);
        let valueOptionRequest = new HttpRequest(options.request.method,
            options.request.url, options.request.body, {
                headers: options.request.headers
            });
        if (options.onGetOptions) {
            valueOptionRequest = options.onGetOptions(valueOptionRequest);
        }
        return this.http.request(valueOptionRequest);
    }

    notifyCommand(event: EventBase) {
        this.eventNotifier$.next(event);
    }
}
