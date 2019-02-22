import { LibraryState, STORE_NAME, SchemaData } from './models/store.interface';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { IFormStruct } from './models/form-struct/form-struct.interface';
import { InvalidStructError, InvalidSchemaRetrieveError } from './models/exceptions';
import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { DataFetch, DataSuccess } from './actions/data.actions';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { SchemaRetrieve } from './models/schema.retrieve';
import { DataRetrieve } from './models/data.retrieve';
import { SchemaFetch, SchemaSuccess } from './actions/schema.actions';
import { getSchema } from './reducers/selectors';

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

    constructor(private http: HttpClient, private store: Store<LibraryState>) {
        this.loadingSchema = true;
    }

    ngOnInit() {
        // Mi serve lo schema per poter creare lista e dettaglio
        if (!this.schemaRetrieve) {
            throw new InvalidSchemaRetrieveError('Missing informations to retrieve schema');
        }
        // Check when finish loading
        this.store.pipe(select(getSchema))
            .subscribe((value) => {
                this.loadingSchema = value.loading;
                if (value.loaded) {
                    this.schema = value.item;
                    this.validateSchema();
                }
            });
        this.store.dispatch(new SchemaFetch(this.schemaRetrieve));
        this.store.dispatch(new DataFetch(this.dataRetrieve));
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
