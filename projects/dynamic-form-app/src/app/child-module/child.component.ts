import { Component } from '@angular/core';
import { SchemaRetrieve, DataRetrieve, ValueOptionRetrieve } from 'projects/dynamic-form-lib/src/public_api';
import { EventOptions, EventInsert, EventReset, EventDelete, EventSave } from 'projects/dynamic-form-lib/src/lib/models/events.interface';

@Component({
    selector: 'app-child',
    template: `
        <df-dynamic-form [schemaRetrieve]="schemaRetrieve" 
            [dataRetrieve]="dataRetrieve" [eventOptions]="eventOptions" [valueOptionRetrieve]="valueOptionRetrieve"></df-dynamic-form>
    `
})
export class ChildComponent {
    schemaRetrieve = new SchemaRetrieve({
        url: location + '/assets/json/schema.json',
        method: 'get',
    }, (request) => {
        // console.log('Before schema', request);
        return request;
    },
    (err, result) => {
        // console.log('After get schema', err, result);
    });

    dataRetrieve = new DataRetrieve({
        url: location + '/assets/json/data1.json',
        method: 'get'
    }, {
        ElementiPerPagina: 15,
        NumeroPagina: 1,
        ElementiTotali: 0,
        PagineTotali: 0
    },
    (request, paging) => {
        let url = location + 'assets/json/data{page}.json';
        if (!paging) {
            url = url.replace('{page}', '1');
        } else {
            url = url.replace('{page}', String(paging.NumeroPagina));
        }
        const req = request.clone({
            url: url
        });
        return req;
    },
    (err, result) => {
        // console.log('After get data', err, result);
    });
    options: ReadonlyArray<[string, ValueOptionRetrieve]> = [
        ['select', new ValueOptionRetrieve({
            url: location + '/assets/json/valueoption.json',
            method: 'get'})]
    ];
    valueOptionRetrieve = new Map<string, ValueOptionRetrieve>([
        ['select',  new ValueOptionRetrieve({
            url: location + '/assets/json/valueoption.json',
            method: 'get',
        })],
        ['autocomplete',  new ValueOptionRetrieve({
            url: location + '/assets/json/valueoption.json',
            method: 'get'
        })],
    ]);

    eventOptions: EventOptions = {
        OnEventInsert: (event: EventInsert) => {
            // console.log(event);
        },
        OnEventReset: (event: EventReset) => {
            // console.log(event);
        },
        OnEventDelete: (event: EventDelete) => {
            // console.log(event);
        },
        OnEventSave: (event: EventSave) => {
            console.log(event);
        }
    };
}