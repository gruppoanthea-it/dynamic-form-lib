import { DynamicFormService } from './../services/dynamic-form.service';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError, filter } from 'rxjs/operators';
import { ActionTypes } from '../actions/types';
import { SchemaFetch, SchemaSuccess, SchemaError } from '../actions/schema.actions';
import { HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { UiError } from '../actions/ui.actions';
import { DispatcherService } from '../dispatcher.service';

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
                        const schema = new SchemaSuccess(response.body);
                        schema.formId = action.formId;
                        return schema;
                    } else {
                        throwError(response.body || (response.status + ' - ' + response.statusText));
                    }
                }
            }),
            catchError((error) => {
                let err: string;
                if (error instanceof HttpErrorResponse) {
                    err = error.message;
                } else {
                    err = error;
                }
                if (action.options.afterGetSchema) {
                    action.options.afterGetSchema(new Error(err), null);
                }
                const schemaError = new SchemaError(err);
                schemaError.formId = action.formId;
                const uiError = new UiError('SCHEMA', err);
                uiError.formId = action.formId;
                return [
                    schemaError,
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
