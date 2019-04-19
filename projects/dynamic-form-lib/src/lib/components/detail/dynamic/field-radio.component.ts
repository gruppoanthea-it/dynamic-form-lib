import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IRadioField } from '../../../models';

@Component({
    selector: 'df-field-radio',
    template: `
        <div>
            <label>{{field.label || field.placeholder}}</label>
            <mat-radio-group [ngClass]="{'group-vertical': field.orientation === 'vertical',
            'group-horizontal': field.orientation === 'horizontal'}"
            [labelPosition]="field.labelPosition" [formControl]="control">
                <mat-radio-button [ngClass]="{'button-vertical': field.orientation === 'vertical',
                'button-horizontal': field.orientation === 'horizontal'}"
                *ngFor="let option of field.options" [value]="option.key">{{option.value}}</mat-radio-button>
            </mat-radio-group>
        </div>
    `,
    styles: [
        `
        label {
            margin-right: 5px;
            font-size: inherit;
            font-weight: 400;
            line-height: 1.125;
            font-family: Roboto,"Helvetica Neue",sans-serif;
        }
        .group-vertical {
            display: inline-flex;
            flex-direction: column;
        }
        .button-vertical {
            margin: 5px;
        }
        .group-horizontal {
            display: inline-flex;
            flex-direction: row;
        }
        .button-horizontal {
            margin-left: 1rem;
        }
        `
    ]
})
export class FieldRadioComponent {

    @Input() field: IRadioField;
    @Input() control: FormControl;

    constructor() {}
}
