import { DynamicFormService } from '../services/dynamic-form.service';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError, filter, defaultIfEmpty } from 'rxjs/operators';
import { ActionTypes } from '../actions/types';
import { HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { throwError, of } from 'rxjs';
import { UiError } from '../actions/ui.actions';
import { DataFetch, DataSuccess, DataError } from '../actions/data.actions';

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
                    return new DataSuccess(response.body);
                } else {
                    console.log('Trowing error', response);
                    throwError(response.body || (response.status + ' - ' + response.statusText));
                }
            }),
            catchError((error) => {
                let err: string;
                if (error instanceof HttpErrorResponse) {
                    err = error.message;
                } else {
                    err = error;
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
