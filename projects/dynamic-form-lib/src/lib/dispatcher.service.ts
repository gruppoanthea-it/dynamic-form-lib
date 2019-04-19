import { Injectable } from '@angular/core';
import { LibraryState } from './models/store.interface';
import { Store, Action, select, MemoizedSelectorWithProps } from '@ngrx/store';
import { UUID } from 'angular2-uuid';
import { BaseAction, NewFormAction } from './actions/types';

@Injectable()
export class DispatcherService {

    formId: string;
    constructor(private store: Store<LibraryState>) {
        this.formId = UUID.UUID();
        this.store.dispatch(new NewFormAction(this.formId));
    }

    dispatchAction(action: BaseAction & Action) {
        action.formId = this.formId;
        this.store.dispatch(action);
    }

    getSelector(selector: MemoizedSelectorWithProps<any, any, any>) {
        return this.store.pipe(select(selector, {formId: this.formId}));
    }
}
