import { map } from 'rxjs/operators';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Struct } from '../../models';
import { Store } from '@ngrx/store';
import { LibraryState, Paging } from '../../models/store.interface';
import { DispatcherService } from '../../dispatcher.service';
import { getPaging } from '../../reducers/selectors';
import { PageEvent } from '@angular/material/paginator';
import { DataFetch } from '../../actions/data.actions';
import { DynamicFormService } from '../../services/dynamic-form.service';

@Component({
    selector: 'df-form-footer',
    template: `
        <mat-toolbar>
            <mat-paginator *ngIf="paging"
            [length]="paging.ElementiTotali"
            [pageSize]="paging.ElementiPerPagina"
            [pageSizeOptions]="pageOptions"
            (page)="pageChange($event)"></mat-paginator>
        </mat-toolbar>
    `,
    styles: [`
        .mat-paginator {
            background-color: transparent;
        }
    `]
})
export class FormFooterComponent implements OnInit {


    paging: Paging;
    pageOptions: number[] = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    constructor(private store: Store<LibraryState>,
        private dispatchService: DispatcherService,
        private formService: DynamicFormService) {
    }

    ngOnInit() {
        this.dispatchService.getSelector(getPaging)
            .subscribe((paging: Paging) => {
                this.paging = paging;
            });
    }

    pageChange($event: PageEvent) {
        const pag: Paging = {
            ElementiTotali: $event.length,
            ElementiPerPagina: $event.pageSize,
            PagineTotali: this.paging.PagineTotali,
            NumeroPagina: $event.pageIndex + 1
        };
        const dataRetrieve = this.formService.getDefaultDataRetrieve(this.dispatchService.formId);
        dataRetrieve.paging = pag;
        this.dispatchService.dispatchAction(new DataFetch(dataRetrieve));
    }
}
