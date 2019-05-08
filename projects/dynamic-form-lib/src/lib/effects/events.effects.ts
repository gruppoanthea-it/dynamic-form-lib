import { DynamicFormService } from '../services/dynamic-form.service';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom, take } from 'rxjs/operators';
import { ActionTypes, ActionVoid } from '../actions/types';
import { UiChangeRow } from '../actions/ui.actions';
import { DataReset, DataInsert, DataDelete, DataSave } from '../actions/data.actions';
import { Action, Store, select } from '@ngrx/store';
import { Event, EventResult } from '../actions/events.actions';
import { EventTypes, EventDelete, EventInsert } from '../models/events.interface';
import { LibraryState } from '../models/store.interface';
import { mergeChanges } from '../utility/utility.functions';
import { getRootState } from '../reducers/selectors';

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
        const voidAction = new ActionVoid();
        voidAction.formId = action.formId;
        return voidAction;
      })
    );
  @Effect()
  eventProcess$ = this.actions$
      .pipe(
        ofType(ActionTypes.EVENT_RESULT),
        withLatestFrom(this.store.pipe(select(getRootState))),
        switchMap(([act, state]): Action[] => {
          const action = act as EventResult;
          const form = state.items.get(action.formId);
          if (action.eventResult.cancel) {
            const voidAction = new ActionVoid();
            voidAction.formId = action.formId;
            return [
              voidAction
            ];
          }
          const changeRow = new UiChangeRow();
          changeRow.formId = action.formId;
          let rowKey = form.uiState.lastSelectedKey;
          const itemsMap = mergeChanges(form.storeData.data.items, form.storeData.data.changes, true);
          const items = [...Array.from(itemsMap.values())];
          if (!rowKey || !itemsMap.has(rowKey)) {
            if (items.length > 0) {
              let found = false;
              for (let i = 0; i < items.length; i++) {
                rowKey = items[i].Id;
                switch (action.eventResult.type) {
                  case EventTypes.EVENT_RESET:
                  case EventTypes.EVENT_INSERT:
                    found = true;
                    break;
                  case EventTypes.EVENT_DELETE:
                    const deleteId = (<EventDelete>action.eventResult).item.Id;
                    if (deleteId !== rowKey) {
                      found = true;
                    }
                    break;
                }
                if (found) {
                  break;
                }
              }
            }
          }
          changeRow.rowKey = rowKey;
          switch (action.eventResult.type) {
              case EventTypes.EVENT_RESET:
                const dataReset = new DataReset();
                dataReset.formId = action.formId;
                return [
                  dataReset,
                  changeRow
                ];
              case EventTypes.EVENT_INSERT:
                const item = (<EventInsert>action.eventResult).item;
                const dataInsert = new DataInsert(item);
                dataInsert.formId = action.formId;
                changeRow.rowKey = item.Id;
                return [
                  dataInsert,
                  changeRow
                ];
              case EventTypes.EVENT_DELETE:
                const dataDelete = new DataDelete((<EventDelete>action.eventResult).item.Id);
                dataDelete.formId = action.formId;
                return [
                  dataDelete,
                  changeRow
                ];
              case EventTypes.EVENT_SAVE:
                const dataSave = new DataSave();
                dataSave.formId = action.formId;
                return [
                  dataSave
                ];
          }
        })
      );
  constructor(
    private actions$: Actions,
    private dfService: DynamicFormService,
    private store: Store<LibraryState>
  ) {}
}
