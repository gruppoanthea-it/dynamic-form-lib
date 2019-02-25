import { DynamicFormService } from '../services/dynamic-form.service';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ActionTypes, ActionVoid } from '../actions/types';
import { UiChangeRow } from '../actions/ui.actions';
import { DataReset, DataInsert, DataDelete } from '../actions/data.actions';
import { Entity } from '../models/common.interface';
import { Action } from '@ngrx/store';
import { Event, EventResult } from '../actions/events.actions';
import { EventTypes, EventDelete } from '../models/events.interface';

@Injectable()
export class EventsEffects {

  @Effect()
  notifyEvent$ = this.actions$
    .pipe(
      ofType(ActionTypes.EVENT),
      map((action: Event) => {
        this.dfService.notifyCommand(action.event);
        // Non faccio nulla perché devo farlo gestire al
        // Componente
        return new ActionVoid();
      })
    );
  @Effect()
  eventProcess$ = this.actions$
      .pipe(
        ofType(ActionTypes.EVENT_RESULT),
        switchMap((action: EventResult): Action[] => {
          if (action.eventResult.cancel) {
            return [
              new ActionVoid()
            ];
          }
          switch (action.eventResult.type) {
              case EventTypes.EVENT_RESET:
                return [
                  new DataReset()
                ];
              case EventTypes.EVENT_INSERT:
                const item = new Entity();
                item.Inserted = true;
                return [
                  new DataInsert(item),
                  new UiChangeRow(item.Id)
                ];
              case EventTypes.EVENT_DELETE:
              console.log(action);
                return [
                  new DataDelete((<EventDelete>action.eventResult).item.Id)
                ]
          }
        })
      );
  constructor(
    private actions$: Actions,
    private dfService: DynamicFormService
  ) {}
}
