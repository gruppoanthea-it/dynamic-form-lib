import { ListSelectedRow } from './../../actions/actions';
import { Component, OnInit, Input } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { IFormStruct } from '../../models';
import { Store } from '@ngrx/store';
import { STORE_NAME, IState } from '../../models/common.interface';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'df-form-list',
    template: `
    <table mat-table [dataSource]="data" class="mat-elevation-z8">
        <ng-container *ngFor="let field of formSchema.fields" [matColumnDef]="field.name">
            <th mat-header-cell *matHeaderCellDef>{{field.label || field.placeholder}}</th>
            <td mat-cell *matCellDef="let element"> {{element[field.name]}} </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columns; sticky: true"></tr>
        <tr mat-row [ngClass]="i === selectedRow ? 'mat-row-selected' : ''"
        *matRowDef="let row; columns: columns;let i = index" (click)="rowClicked(i)"></tr>
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
    private selectedRow: number;

    constructor(private mediaObserver: MediaObserver,
                private store: Store<IState>) {
        this.columns = [];
    }

    ngOnInit() {
        this.store.select(STORE_NAME)
            .pipe(map((state: IState) => state.schema), distinctUntilChanged())
            .subscribe((value) => {
                if (value.loaded) {
                    this.formSchema = value.data;
                    this.init();
                }
            });
        this.store.select(STORE_NAME)
            .pipe(map((state: IState) => state.data), distinctUntilChanged())
            .subscribe((value) => {
                if (value.loaded) {
                    this.data = value.data;
                }
            });
        this.store.select(STORE_NAME)
            .pipe(map((state: IState) => state.list), distinctUntilChanged())
            .subscribe((value) => {
                this.selectedRow = value.selectedRow;
            });
    }

    private init() {
        this.formSchema.fields.forEach((field) => {
            this.columns.push(field.name);
        });
    }

    rowClicked(index) {
        this.store.dispatch(new ListSelectedRow(index));
    }

}

