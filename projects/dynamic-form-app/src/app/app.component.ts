import { Component, OnInit, ViewChild, ViewContainerRef, Injector, NgModuleFactoryLoader, Type, Inject, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { SchemaRetrieve, DataRetrieve, ValueOptionRetrieve, DynamicFormLibComponent } from 'projects/dynamic-form-lib/src/public_api';
import { EventOptions, EventInsert, EventReset, EventDelete, EventSave } from 'projects/dynamic-form-lib/src/lib/models/events.interface';
import { ROUTES, Route } from '@angular/router';
import { AstMemoryEfficientTransformer } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    @ViewChild('container', {
        read: ViewContainerRef
    }) container: ViewContainerRef;

    @ViewChild('myForm') myForm: DynamicFormLibComponent;

    constructor(private loader: NgModuleFactoryLoader,  private injector: Injector, @Inject(ROUTES) private paths: Route[][]) {}

    title = 'dynamic-form-app';

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
        }, null, (err, body, formdata) => {
            console.log(formdata);
            return body.filter(el => {
                return formdata.check ? el.value.startsWith('A') : el.value.startsWith('B');
            });
        })],
        ['autocomplete',  new ValueOptionRetrieve({
            url: location + '/assets/json/valueoption.json',
            method: 'get'
        }, null, (err, body, formdata) => {
            if (!formdata.autocomplete || formdata.autocomplete.length === 0) {
                return body;
            }
            return body.filter(el => {
                return el.value.indexOf(formdata.autocomplete) >= 0;
            });
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

    ngOnInit() {
        /*
        const paths = this.paths.reduce((a, b) => a.concat(b));
        this.loader.load(paths[0].loadChildren as string)
            .then(factory => {
                const mod = factory.create(this.injector);
                const compType = mod.injector.get('ENTRY_POINT') as Type<any>;
                const compFact = mod.componentFactoryResolver.resolveComponentFactory(compType);
                const comp = this.container.createComponent(compFact);
            })
            .catch(err => console.log(err));
        */
    }

    reloadData() {
        this.myForm.reloadData();
    }
}
