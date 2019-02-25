import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { IFormStruct } from '../../models';
import { Store, select } from '@ngrx/store';
import { LibraryState } from '../../models/store.interface';
import { getSchema, getDataChanged } from '../../reducers/selectors';
import { EventReset, EventInsert, EventDelete } from '../../models/events.interface';
import { Event } from '../../actions/events.actions';

@Component({
    selector: 'df-form-toolbar',
    template: `
        <mat-toolbar *ngIf="formSchema" [color]="formSchema.toolbarColor">
            <mat-toolbar-row>
                <span>{{formSchema.name}}</span>
            </mat-toolbar-row>
            <mat-toolbar-row>
                <button (click)="changeView.emit()" *ngIf="formSchema.type === 'both'" mat-icon-button>
                    <mat-icon aria-label="Change View">{{tabIndex === 1 ? 'view_list' : 'create'}}</mat-icon>
                </button>
                <mat-divider [vertical]="true"></mat-divider>
                <button (click)="resetFormCommand()" *ngIf="tabIndex === 1 && isFormModified" mat-icon-button>
                    <mat-icon aria-label="Reset Form">undo</mat-icon>
                </button>
                <button (click)="addItemCommand()" *ngIf="tabIndex === 1" mat-icon-button>
                    <mat-icon aria-label="Add Item">add</mat-icon>
                </button>
                <button (click)="deleteItemCommand()" mat-icon-button>
                    <mat-icon aria-label="Delete Item">delete</mat-icon>
                </button>
            </mat-toolbar-row>
        </mat-toolbar>
    `,
    styles: [`
        mat-divider {
            height: 60%;
            margin: 0 1rem;
            border-right-color: rgba(0, 0, 0, .7);
        }
    `]
})
export class FormToolbarComponent implements OnInit {

    private formSchema: IFormStruct;
    @Input() tabIndex: number;
    @Output() changeView: EventEmitter<void>;
    private isFormModified: boolean;

    constructor(private store: Store<LibraryState>) {
        this.changeView = new EventEmitter();
        this.isFormModified = false;
    }

    ngOnInit() {
        this.store.pipe(select(getSchema))
            .subscribe((value) => {
                if (value.loaded) {
                    this.formSchema = value.item;
                }
            });
        this.store.pipe(select(getDataChanged))
            .subscribe((value) => {
                this.isFormModified = value;
            });
    }

    resetFormCommand() {
        this.store.dispatch(new Event(new EventReset()));
    }

    addItemCommand() {
        this.store.dispatch(new Event(new EventInsert()));
    }

    deleteItemCommand() {
        this.store.dispatch(new Event(new EventDelete()));
    }
}
