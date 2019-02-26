import { DynamicFormService } from '../services/dynamic-form.service';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError, filter, defaultIfEmpty, combineAll, tap, switchMap } from 'rxjs/operators';
import { ActionTypes } from '../actions/types';
import { HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { throwError, of } from 'rxjs';
import { UiError, UiChangeRow } from '../actions/ui.actions';
import { DataFetch, DataSuccess, DataError } from '../actions/data.actions';
import * as _ from 'lodash';
import { UUID } from 'angular2-uuid';
import { Entity } from '../models/common.interface';

interface Success {
    data: any;
}

interface Error {
    message: string;
}

@Injectable()
export class DataEffects {

  @Effect()
  loadData$ = this.actions$
    .pipe(
      ofType(ActionTypes.DATA_FETCH),
      mergeMap((action: DataFetch) => this.dfService.retrieveData(action.options)
        .pipe(
            defaultIfEmpty(new HttpResponse<any>({
                body: null,
                status: 200
            })),
            filter(response => response.type === HttpEventType.Response),
            map((response: HttpResponse<any>) => {
                if (response.status === 200) {
                    return response.body as [];
                } else {
                    throwError(response.body || (response.status + ' - ' + response.statusText));
                }
            }),
            map(item => item.map((el: any) => new Entity(el))),
            map(items => new Map<string, Entity>(
                items.map(el => [el.Id, el] as [string, Entity])
            )),
            switchMap((items: Map<string, Entity>) => {
                let first = null;
                for (let i = 0; i < items.size; i++) {
                    const item = items.keys().next();
                    first = item.value;
                    break;
                }
                if (action.options.afterGetData) {
                    action.options.afterGetData(null, items);
                }
                return [
                    new DataSuccess(items),
                    new UiChangeRow(first)
                ];
            }),
            catchError((error) => {
                let err: string;
                if (error instanceof HttpErrorResponse) {
                    err = error.message;
                } else {
                    err = error;
                }
                if (action.options.afterGetData) {
                    action.options.afterGetData(error, null);
                }
                return [
                    new DataError(err),
                    new UiError('DATA', err)
                ];
            })
        ))
      );

  constructor(
    private actions$: Actions,
    private dfService: DynamicFormService
  ) {}
}
