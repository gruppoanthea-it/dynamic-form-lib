import { DynamicFormService } from './../services/dynamic-form.service';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { ActionTypes } from '../actions/types';
import { UiCommand, UiCommandResult } from '../actions/ui.actions';

@Injectable()
export class UiEffects {

  @Effect()
  notifyCommand$ = this.actions$
    .pipe(
      ofType(ActionTypes.UI_COMMAND),
      map((action: UiCommand) => {
        this.dfService.notifyCommand(action.command);
        return new UiCommandResult();
      })
    );

  constructor(
    private actions$: Actions,
    private dfService: DynamicFormService
  ) {}
}
