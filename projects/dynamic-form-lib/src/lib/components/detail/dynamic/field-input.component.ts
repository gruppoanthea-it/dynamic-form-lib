import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormField, IInputField } from '../../../models';

@Component({
    selector: 'df-field-input',
    template: `
    <mat-form-field style="width: 100%">
        <label *ngIf="field.label">{{field.label}}</label>
        <input matInput [placeholder]="field.placeholder" [formControl]="control"
            [type]="fieldInputType" [maxlength]="field.maxLength">
        <button mat-button *ngIf="field.inputType === 'password'" matSuffix mat-icon-button aria-label="Show Password"
        (click)="fieldInputType === 'password' ? (fieldInputType = 'text') : (fieldInputType = 'password')">
            <mat-icon>remove_red_eye</mat-icon>
        </button>
        <mat-hint *ngIf="field.hintText">{{field.hintText}}</mat-hint>
        <mat-hint *ngIf="field.maxLength" align="end">{{control.value ? control.value.length : 0}} / {{field.maxLength}}</mat-hint>
        <mat-error *ngFor="let error of errors">
          {{error}}
        </mat-error>
    </mat-form-field>
    `,
    styles: []
})
export class FieldInputComponent implements OnInit {

    @Input() field: IInputField;
    @Input() control: FormControl;

    private errors: string[];
    private value: any;
    private fieldInputType: string;

    constructor() {
        this.errors = [];
    }

    ngOnInit() {
        this.fieldInputType = this.field.inputType;
            // if (this.field.validators) {
            //     const validators = [];
            //     this.field.validators.forEach((validator) => {
            //         validators.push(validator.validator);
            //     });
            //     if (validators.length > 0) {
            //         this.control.valueChanges.subscribe((value) => {
            //             this.validate();
            //         });
            //         this.control.setValidators(validators);
            //     }
            // }
    }

    private validate() {
        if (this.control.invalid && (this.control.dirty || this.control.touched)) {
            this.errors.splice(0);
            for (const key in this.control.errors) {
                if (this.control.errors[key]) {
                    const error = this.field.validators.find((val) => {
                        return val.key === key;
                    });
                    if (error) {
                        this.errors.push(error.message);
                    }
                }
            }
        }
    }
}
