import { Component, OnInit, Input } from '@angular/core';
import { IInputField } from '../../../models';
import { ValidationField } from './validation.field';
import { ConfigOptions } from '../../../config.options';

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
export class FieldInputComponent extends ValidationField implements OnInit {

    @Input() field: IInputField;

    private errors: string[];
    private fieldInputType: string; // Hold the reference to type when switching between text and password

    constructor(private configService: ConfigOptions) {
        super(configService.getConfig());
        this.errors = [];
    }

    ngOnInit() {
        super.ngOnInit();
        this.fieldInputType = this.field.inputType;
    }

    errorChanges(errors: string[]) {
        this.errors.splice(0, this.errors.length);
        this.errors.push(...errors);
    }
}
