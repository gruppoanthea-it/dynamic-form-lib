import { STORE_NAME, IState } from './models/common.interface';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { IFormStruct } from './models/form-struct/form-struct.interface';
import { InvalidStructError, InvalidSchemaRetrieveError } from './models/exceptions';
import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { SchemaFetch, SchemaSuccess, DataFetch, DataSuccess } from './actions/actions';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { SchemaRetrieve } from './models/schema.retrieve';
import { DataRetrieve } from './models/data.retrieve';

@Component({
  selector: 'df-dynamic-form',
  template: `
    <div class="df-form-container">
        <ng-container *ngIf="loadingSchema === true">
            <mat-toolbar color="primary">
                <mat-toolbar-row></mat-toolbar-row>
                <mat-toolbar-row></mat-toolbar-row>
            </mat-toolbar>
            <mat-spinner style="margin: 0 auto;"></mat-spinner>
        </ng-container>
        <ng-container *ngIf="loadingSchema === false">
            <df-form-toolbar [tabIndex]="tabIndex"
            (changeView)="onChangeView()"></df-form-toolbar>
            <mat-tab-group class="hide-header" [selectedIndex]="tabIndex">
                <mat-tab label="Dettaglio">
                    <df-form-list></df-form-list>
                </mat-tab>
                <mat-tab label="Lista">
                    <df-form-detail></df-form-detail>
                </mat-tab>
            </mat-tab-group>
        </ng-container>
    </div>
  `,
  styles: [
    `
    .hide-header > .mat-tab-header {
        display: none !important;
    }

    .df-form-container {
        border: 1px solid rgba(0, 0, 0, .2);
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
    `
  ],
  encapsulation: ViewEncapsulation.None
})
export class DynamicFormLibComponent implements OnInit {

    @Input() schemaRetrieve: SchemaRetrieve;
    @Input() dataRetrieve: DataRetrieve;

    private schema: IFormStruct;
    private tabIndex: number;
    private loadingSchema: boolean;

    constructor(private http: HttpClient, private store: Store<IState>) {
        this.loadingSchema = true;
    }

    ngOnInit() {
        // Mi serve lo schema per poter creare lista e dettaglio
        if (!this.schemaRetrieve) {
            throw new InvalidSchemaRetrieveError('Missing informations to retrieve schema');
        }
        // Check when finish loading
        this.store.select(STORE_NAME)
            .pipe(map((state: IState) => state.schema), distinctUntilChanged())
            .subscribe((value) => {
                this.loadingSchema = value.loading;
                if (value.loaded) {
                    this.schema = value.data;
                    this.validateSchema();
                }
            });
        this.store.dispatch(new SchemaFetch());
        const schemaRequest = this.getSchemaObservable();
        const dataRequest = this.getDataObservable();
        this.getSchema(schemaRequest);
        if (dataRequest) {
            this.store.dispatch(new DataFetch());
            this.getData(dataRequest);
        }
    }

    private getSchemaObservable() {
        // Creo la richiesta per lo schema
        const schemaRequestDef = new HttpRequest(this.schemaRetrieve.request.method,
            this.schemaRetrieve.request.url, null, {
                headers: this.schemaRetrieve.request.headers
            });
        if (this.schemaRetrieve.onGetSchema) {
            this.schemaRetrieve.onGetSchema(schemaRequestDef);
        }
        // Creo l'observable per la richiesta dello schema
        return this.http.request(schemaRequestDef);
    }

    private getDataObservable() {
        if (!this.dataRetrieve) {
            return null;
        }
        // Creo la richiesta per i dati
        const dataRequestDef = new HttpRequest(this.dataRetrieve.request.method,
            this.dataRetrieve.request.url, null, {
                headers: this.dataRetrieve.request.headers
            });
        if (this.dataRetrieve.onGetData) {
            this.dataRetrieve.onGetData(dataRequestDef);
        }
        // Creo l'observable per la richiesta dei dati
        return this.http.request(dataRequestDef);
    }

    private getSchema(request: Observable<HttpEvent<any>>) {
        request.subscribe((value) => {
            if (value.type === HttpEventType.Response) {
                if (value.status === 200) {
                    this.store.dispatch(new SchemaSuccess(value.body));
                }
            }
        });
    }

    private getData(request: Observable<HttpEvent<any>>) {
        request.subscribe((value) => {
            if (value.type === HttpEventType.Response) {
                if (value.status === 200) {
                    this.store.dispatch(new DataSuccess(value.body));
                }
            }
        });
    }

    private validateSchema = () => {
        if (!this.schema) {
            throw new InvalidStructError();
        }
        this.initValues();
    }

    private initValues() {
        this.tabIndex = (this.schema.type === 'both' || this.schema.type === 'list')
            ? 0 : 1;
    }

    onChangeView() {
        if (this.tabIndex === 0) {
            this.tabIndex = 1;
        } else {
            this.tabIndex = 0;
        }
    }
}
