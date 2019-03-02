import { map } from 'rxjs/operators';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Struct } from '../../models';
import { Store, select } from '@ngrx/store';
import { LibraryState } from '../../models/store.interface';
import { getSchema, getDataChanged, getItemsCount, getAllItems, getCurrentIndex } from '../../reducers/selectors';
import { EventReset, EventInsert, EventDelete } from '../../models/events.interface';
import { Event } from '../../actions/events.actions';
import { Observable } from 'rxjs';
import { Entity } from '../../models/common.interface';
import { UiChangeRow } from '../../actions/ui.actions';

@Component({
    selector: 'df-form-toolbar',
    template: `
        <mat-toolbar *ngIf="struct$ | async as struct" [color]="struct.toolbarColor">
            <mat-toolbar-row>
                <div class="title-container">
                    <span>{{struct.name}}</span>
                    <span class="row-count">Riga {{currentIndex || 0}} di {{(totalCount$ | async) || 0}}</span>
                </div>
                <div fxHide.gt-xs="true" style="flex: 1 auto"></div>
                <button fxHide.gt-xs="true" mat-icon-button [matMenuTriggerFor]="formMenu">
                    <mat-icon aria-label="Menu">menu</mat-icon>
                </button>
            </mat-toolbar-row>
            <mat-toolbar-row class="row-border" fxHide.lt-sm="true">
                <button (click)="changeView.emit()" *ngIf="struct.type === 'both'" mat-icon-button>
                    <mat-icon aria-label="Change View">{{tabIndex === 1 ? 'view_list' : 'create'}}</mat-icon>
                </button>
                <mat-divider [vertical]="true"></mat-divider>
                <button *ngIf="tabIndex === 1" [disabled]="currentIndex === 0 || currentIndex === 1"
                (click)="movePrevCommand()" mat-icon-button>
                    <mat-icon aria-label="Move Previous">navigate_before</mat-icon>
                </button>
                <button *ngIf="tabIndex === 1" [disabled]="currentIndex === 0 || data.length === currentIndex"
                (click)="moveNextCommand()" mat-icon-button>
                    <mat-icon aria-label="Move Next">navigate_next</mat-icon>
                </button>
                <mat-divider [vertical]="true"></mat-divider>
                <button (click)="resetFormCommand()" [disabled]="!(isFormModified$ | async)" mat-icon-button>
                    <mat-icon aria-label="Reset Form">undo</mat-icon>
                </button>
                <button (click)="addItemCommand()" mat-icon-button>
                    <mat-icon aria-label="Add Item">add</mat-icon>
                </button>
                <button (click)="deleteItemCommand()" mat-icon-button>
                    <mat-icon aria-label="Delete Item">delete</mat-icon>
                </button>
            </mat-toolbar-row>
        </mat-toolbar>
        <mat-menu #formMenu="matMenu">
            <button mat-menu-item [disabled]="!(isFormModified$ | async)">
                <mat-icon>undo</mat-icon>
                <span>Annulla Modifiche</span>
              </button>
            <button mat-menu-item>
                <mat-icon>add</mat-icon>
                <span>Inserisci</span>
            </button>
            <button mat-menu-item>
                <mat-icon>delete</mat-icon>
                <span>Elimina</span>
            </button>
        </mat-menu>
    `,
    styles: [`
        mat-divider {
            height: 60%;
            margin: 0 1rem;
            border-right-color: rgba(0, 0, 0, .7);
        }
        .row-border:before {
            content: '';
            position: absolute;
        }
        .row-border:after {
            content: '';
            position: absolute;
        }
        .title-container {
            display: flex;
            flex-flow: column;
            height: 100%;
        }
        .row-count {
            font-weight: 400;
            font-size: .9rem;
        }
    `]
})
export class FormToolbarComponent implements OnInit {

    @Input() tabIndex: number;
    @Output() changeView: EventEmitter<void>;
    private isFormModified$: Observable<boolean>;
    private struct$: Observable<Struct>;
    private currentIndex: number;
    private totalCount$: Observable<number>;

    // Only to do next and prev
    private data: Entity[];

    constructor(private store: Store<LibraryState>) {
        this.changeView = new EventEmitter();
    }

    ngOnInit() {
        this.store.pipe(select(getCurrentIndex))
            .subscribe(value => this.currentIndex = value);
        this.totalCount$ = this.store.pipe(select(getItemsCount));
        this.struct$ = this.store.pipe(select(getSchema), map(value => value.item));
        this.isFormModified$ = this.store.pipe(select(getDataChanged));
        this.store.pipe(select(getAllItems))
            .subscribe(value => this.data = value);
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

    movePrevCommand() {
        const key = this.data[this.currentIndex - 2].Id;
        this.store.dispatch(new UiChangeRow(key));
    }

    moveNextCommand() {
        const key = this.data[this.currentIndex].Id;
        this.store.dispatch(new UiChangeRow(key));
    }
}
