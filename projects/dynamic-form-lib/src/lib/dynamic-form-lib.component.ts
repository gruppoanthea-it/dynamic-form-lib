import { LibraryState } from './models/store.interface';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { IFormStruct } from './models/struct/struct.interface';
import { InvalidStructError, InvalidSchemaRetrieveError } from './models/exceptions';
import { Store, select } from '@ngrx/store';
import { DataFetch } from './actions/data.actions';
import { SchemaRetrieve } from './models/schema.retrieve';
import { DataRetrieve } from './models/data.retrieve';
import { SchemaFetch } from './actions/schema.actions';
import { getSchema } from './reducers/selectors';
import { DynamicFormService } from './services/dynamic-form.service';
import { EventBase, EventOptions, EventTypes, EventReset, EventInsert, EventDelete } from './models/events.interface';
import { EventResult } from './actions/events.actions';

@Component({
  selector: 'df-dynamic-form',
  template: `
    <div class="df-form-container" (swipe)="onSwipe($event)">
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
    @Input() eventOptions: EventOptions;

    private schema: IFormStruct;
    private tabIndex: number;
    private loadingSchema: boolean;

    constructor(private store: Store<LibraryState>,
        private formService: DynamicFormService) {
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
        this.formService.eventNotifier$
            .subscribe((value) => {
                this.dispatchEvent(value);
            });
    }

    private dispatchEvent(event: EventBase) {
        // Chiamo l'evento per farlo gestire da fuori
        if (this.eventOptions) {
            switch (event.type) {
                case EventTypes.EVENT_RESET:
                    if (this.eventOptions.OnEventReset) {
                        this.eventOptions.OnEventReset(<EventReset>event);
                    }
                    break;
                case EventTypes.EVENT_INSERT:
                    if (this.eventOptions.OnEventInsert) {
                        this.eventOptions.OnEventInsert(<EventInsert>event);
                    }
                    break;
                case EventTypes.EVENT_DELETE:
                    if (this.eventOptions.OnEventDelete) {
                        this.eventOptions.OnEventDelete(<EventDelete>event);
                    }
                    break;
            }
        }
        this.store.dispatch(new EventResult(event));
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

    onSwipe(evt) {
        const x = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left') : '';
        if (x === 'right' && this.tabIndex === 1) {
            this.onChangeView();
        }
        if (x === 'left' && this.tabIndex === 0) {
            this.onChangeView();
        }
    }
}
