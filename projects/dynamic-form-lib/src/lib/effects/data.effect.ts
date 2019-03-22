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
import { Entity } from '../models/common.interface';
import { Paging } from '../models/store.interface';

@Injectable()
export class DataEffects {

  @Effect()
  loadData$ = this.actions$
    .pipe(
      ofType(ActionTypes.DATA_FETCH),
      mergeMap((action: DataFetch) => this.dfService.retrieveData(action.formId, action.options)
        .pipe(
            defaultIfEmpty(new HttpResponse<any>({
                body: null,
                status: 200
            })),
            filter(response => response.type === HttpEventType.Response),
            map((response: HttpResponse<any>) => {
                if (response.status === 200) {
                    return response.body;
                } else {
                    throwError(response.body || (response.status + ' - ' + response.statusText));
                }
            }),
            map(body => {
                const paging = body.Paging;
                if (!paging) {
                    body.Data = body;
                }
                const items = body.Data.map((el: any) => new Entity(el));
                return {
                    Paging: paging,
                    Data: items
                };
            }),
            map(content => {
                return {
                    Paging: content.Paging,
                    Data: new Map<string, Entity>(
                        content.Data.map(el => [el.Id, el] as [string, Entity]))
                };
            }),
            switchMap((content: {Paging: Paging, Data: Map<string, Entity>}) => {
                let first = null;
                for (let i = 0; i < content.Data.size; i++) {
                    const item = content.Data.keys().next();
                    first = item.value;
                    break;
                }
                if (action.options.afterGetData) {
                    action.options.afterGetData(null, content);
                }
                const dataSuccess = new DataSuccess(content.Data, content.Paging);
                dataSuccess.formId = action.formId;
                const uiChangeRow = new UiChangeRow(first);
                uiChangeRow.formId = action.formId;
                return [
                    dataSuccess,
                    uiChangeRow
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
                const dataError = new DataError(err);
                dataError.formId = action.formId;
                const uiError = new UiError('DATA', err);
                uiError.formId = action.formId;
                return [
                    dataError,
                    uiError
                ];
            })
        ))
      );

  constructor(
    private actions$: Actions,
    private dfService: DynamicFormService
  ) {}
}
