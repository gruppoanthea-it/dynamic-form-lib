import { SchemaRetrieve, DataRetrieve } from 'projects/dynamic-form-lib/src/public_api';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { equals } from '../utility/utility.functions';

@Injectable({
    providedIn: 'root'
})
export class DynamicFormService {

    constructor(private http: HttpClient) {
    }

    retrieveSchema(options: SchemaRetrieve) {
        // Creo la richiesta per lo schema
        const schemaRequestDef = new HttpRequest(options.request.method,
            options.request.url, null, {
                headers: options.request.headers
            });
        if (options.onGetSchema) {
            options.onGetSchema(schemaRequestDef);
        }
        // Creo l'observable per la richiesta dello schema
        return this.http.request(schemaRequestDef);
    }

    retrieveData(options: DataRetrieve) {
        if (!options) {
            return null;
        }
        // Creo la richiesta per i dati
        const dataRequestDef = new HttpRequest(options.request.method,
            options.request.url, null, {
                headers: options.request.headers
            });
        if (options.onGetData) {
            options.onGetData(dataRequestDef);
        }
        // Creo l'observable per la richiesta dei dati
        return this.http.request(dataRequestDef);
    }
}
