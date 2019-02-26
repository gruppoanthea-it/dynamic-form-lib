import { Store } from '@ngrx/store';
import { DynamicFormService } from './../services/dynamic-form.service';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, takeWhile, catchError, filter } from 'rxjs/operators';
import { ActionTypes } from '../actions/types';
import { SchemaFetch, SchemaSuccess, SchemaError } from '../actions/schema.actions';
import { HttpEventType, HttpResponse, HttpEvent } from '@angular/common/http';
import { LibraryState } from '../models/store.interface';
import { throwError } from 'rxjs';
import { UiError } from '../actions/ui.actions';

@Injectable()
export class SchemaEffects {

  @Effect()
  loadSchema$ = this.actions$
    .pipe(
      ofType(ActionTypes.SCHEMA_FETCH),
      mergeMap((action: SchemaFetch) => this.dfService.retrieveSchema(action.options)
        .pipe(
            filter(response => response.type === HttpEventType.Response),
            map((response: HttpResponse<any>) => {
                if (response.type === HttpEventType.Response) {
                    if (response.status === 200) {
                        if (action.options.afterGetSchema) {
                            action.options.afterGetSchema(null, response.body);
                        }
                        return new SchemaSuccess(response.body);
                    } else {
                        throwError(response.body || (response.status + ' - ' + response.statusText));
                    }
                }
            }),
            catchError((error) => {
                if (action.options.afterGetSchema) {
                    action.options.afterGetSchema(error, null);
                }
                return [
                new SchemaError(error),
                new UiError('SCHEMA', error)
                ];
            })
        ))
      );

  constructor(
    private actions$: Actions,
    private dfService: DynamicFormService
  ) {}
}
