import { map } from 'rxjs/operators';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Struct } from '../../models';
import { Store } from '@ngrx/store';
import { LibraryState, Paging } from '../../models/store.interface';
import { DispatcherService } from '../../dispatcher.service';
import { getPaging, getCurrentIndex, getItemsCount } from '../../reducers/selectors';
import { PageEvent } from '@angular/material/paginator';
import { DataFetch } from '../../actions/data.actions';
import { DynamicFormService } from '../../services/dynamic-form.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'df-form-footer',
    template: `
        <div class="footer">
            <div class="row-count-container">
                <span class="row-count">Riga {{currentIndex || 0}} di
                 {{(totalCount$ | async) || 0}}</span>
            </div>
            <div class="footer-divider"></div>
            <mat-paginator *ngIf="paging"
            [length]="paging.ElementiTotali"
            [pageSize]="paging.ElementiPerPagina"
            [pageSizeOptions]="pageOptions"
            (page)="pageChange($event)"></mat-paginator>
        </div>
    `,
    styles: [`
        .footer {
            display: flex;
            align-items: center;
            background-color: #f5f5f5;
        }
        .footer-divider {
            flex: 1 auto;
        }
        .mat-paginator {
            width: fit-content;
            background-color: transparent;
        }
        .row-count-container {
            width: 10rem;
            color: rgba(0, 0, 0, .54);
            margin-left: 1rem;
        }
        .row-count {
            font-weight: 400;
            font-size: .9rem;
            font-family: Roboto,"Helvetica Neue",sans-serif;
        }
    `]
})
export class FormFooterComponent implements OnInit {


    paging: Paging;
    pageOptions: number[] = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

    currentIndex: number;
    totalCount$: Observable<number>;

    constructor(private store: Store<LibraryState>,
        private dispatchService: DispatcherService,
        private formService: DynamicFormService) {
    }

    ngOnInit() {
        this.dispatchService.getSelector(getPaging)
            .subscribe((paging: Paging) => {
                this.paging = paging;
            });
        this.dispatchService.getSelector(getCurrentIndex)
            .subscribe(value => this.currentIndex = value);
        this.totalCount$ = this.dispatchService.getSelector(getItemsCount);
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
