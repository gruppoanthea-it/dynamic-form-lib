import { getAllItems, getUiState, getListSchema } from './../../reducers/selectors';
import { LibraryState } from './../../models/store.interface';
import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Struct, List } from '../../models';
import { Store, select } from '@ngrx/store';
import { getSchema } from '../../reducers/selectors';
import { UiChangeRow } from '../../actions/ui.actions';
import { Entity } from '../../models/common.interface';

@Component({
    selector: 'df-form-list',
    template: `
    <div style="overflow: auto; height: 100%">
        <table mat-table [dataSource]="data" class="mat-elevation-z8">
            <ng-container *ngFor="let field of struct.fields" [matColumnDef]="field.name">
                <th mat-header-cell *matHeaderCellDef>{{field.label || field.placeholder}}</th>
                <td mat-cell *matCellDef="let element"> {{element.data[field.name]}} </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns; sticky: true"></tr>
            <tr mat-row [ngClass]="row.Id === selectedKey ? 'mat-row-selected' : ''"
            *matRowDef="let row; columns: columns;let i = index" (click)="rowClicked(row)"></tr>
        </table>
    </div>
    `,
    styles: [`
        table {
            width: 100%;
        }
        .mat-row-selected {
            background-color: #E0E0E0;
        }
    `]
})
export class FormListComponent implements OnInit {

    struct: List;
    data: any[];

    private columns: string[];
    private selectedKey: string;

    constructor(private store: Store<LibraryState>) {
        this.columns = [];
    }

    ngOnInit() {
        this.store.pipe(select(getListSchema))
            .subscribe((value) => {
                if (value) {
                    this.struct = value;
                    this.init();
                }
            });
        this.store.pipe(select(getAllItems))
            .subscribe(value => {
                this.data = value;
            });
        this.store.pipe(select(getUiState))
            .subscribe(value => {
                this.selectedKey = value.selectedKey;
            });
    }

    private init() {
        this.struct.fields.forEach((field) => {
            this.columns.push(field.name);
        });
    }

    rowClicked(row: Entity) {
        this.store.dispatch(new UiChangeRow(row.Id));
    }

}
