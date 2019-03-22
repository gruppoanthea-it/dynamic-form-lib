import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ICheckBoxField } from '../../../models';

@Component({
    selector: 'df-field-checkbox',
    template: `
        <mat-checkbox [labelPosition]="field.labelPosition" [formControl]="control">{{field.label || field.placeholder}}</mat-checkbox>
    `,
    styles: []
})
export class FieldCheckBoxComponent implements OnInit {

    @Input() field: ICheckBoxField;
    @Input() control: FormControl;

    private errors: string[];
    private value: any;
    private fieldInputType: string;

    constructor() {
        this.errors = [];
    }

    ngOnInit() {

    }
}
