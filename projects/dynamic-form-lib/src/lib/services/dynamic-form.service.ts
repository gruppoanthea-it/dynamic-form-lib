import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { equals } from '../utility/utility.functions';

@Injectable({
    providedIn: 'root'
})
export class DynamicFormService {

    private formModifiedSubject: BehaviorSubject<boolean>;
    private formModifiedValue: boolean;

    constructor() {
        this.formModifiedSubject = new BehaviorSubject(false);
        this.formModifiedValue = false;
    }

    setFormModified(original: any, current: any) {
        const modified = equals(original, current);
        if (modified !== this.formModifiedValue) {
            this.formModifiedValue = modified;
            this.formModifiedSubject.next(this.formModifiedValue);
        }
    }

    isFormModified() {
        return this.formModifiedSubject;
    }
}
