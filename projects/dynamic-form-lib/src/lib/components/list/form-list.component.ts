import { getAllItems, getUiState } from './../../reducers/selectors';
import { LibraryState } from './../../models/store.interface';
import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { IFormStruct } from '../../models';
import { Store, select } from '@ngrx/store';
import { getSchema } from '../../reducers/selectors';
import { UiChangeRow } from '../../actions/ui.actions';
import { Entity } from '../../models/common.interface';
import { map } from 'rxjs/operators';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'df-form-list',
    template: `
    <table mat-table [dataSource]="data" class="mat-elevation-z8">
        <ng-container *ngFor="let field of formSchema.fields" [matColumnDef]="field.name">
            <th mat-header-cell *matHeaderCellDef>{{field.label || field.placeholder}}</th>
            <td mat-cell *matCellDef="let element"> {{element.data[field.name]}} </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columns; sticky: true"></tr>
        <tr mat-row [ngClass]="row.Id === selectedKey ? 'mat-row-selected' : ''"
        *matRowDef="let row; columns: columns;let i = index" (click)="rowClicked(row)"></tr>
    </table>
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

    formSchema: IFormStruct;
    data: any[];

    private columns: string[];
    private selectedKey: string;

    constructor(private mediaObserver: MediaObserver,
                private store: Store<LibraryState>) {
        this.columns = [];
    }

    ngOnInit() {
        this.store.pipe(select(getSchema))
            .subscribe((value) => {
                if (value.loaded) {
                    this.formSchema = value.item;
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
        this.formSchema.fields.forEach((field) => {
            this.columns.push(field.name);
        });
    }

    rowClicked(row: Entity) {
        this.store.dispatch(new UiChangeRow(row.Id));
    }

}
