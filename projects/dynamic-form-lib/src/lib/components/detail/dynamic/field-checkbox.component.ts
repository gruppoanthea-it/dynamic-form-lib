import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ICheckBoxField } from '../../../models';

@Component({
    selector: 'df-field-checkbox',
    template: `
        <mat-checkbox [labelPosition]="field.labelPosition" [formControl]="control">{{field.label || field.placeholder}}</mat-checkbox>
    `,
    styles: []
})
export class FieldCheckBoxComponent {

    @Input() field: ICheckBoxField;
    @Input() control: FormControl;

    constructor() {}
}
