import { ValueOption } from './../../../models/form-struct/form-field.interface';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IAutoCompleteField } from '../../../models';
import { Observable } from 'rxjs';
import {startWith, map} from 'rxjs/operators';

@Component({
    selector: 'df-field-autocomplete',
    template: `
        <mat-form-field style="width: 100%">
            <label *ngIf="field.label">{{field.label}}</label>
            <input type="text" matInput [formControl]="control" [placeholder]="field.placeholder"
            [type]="fieldInputType" [maxlength]="field.maxLength" [matAutocomplete]="auto">
            <mat-hint *ngIf="field.hintText">{{field.hintText}}</mat-hint>
            <mat-hint *ngIf="field.maxLength" align="end">{{control.value ? control.value.length : 0}} / {{field.maxLength}}</mat-hint>
            <mat-error *ngFor="let error of errors">
              {{error}}
            </mat-error>
        </mat-form-field>
        <mat-autocomplete #auto="matAutocomplete">
            <mat-optgroup *ngFor="let group of groupsAsync | async" [label]="group.name">
                <mat-option *ngFor="let option of group.options" [value]="option.value">
                    {{option.value}}
                </mat-option>
            </mat-optgroup>
            <mat-option *ngFor="let option of valuesAsync | async" [value]="option.value">{{option.value}}</mat-option>
        </mat-autocomplete>
    `,
    styles: []
})
export class FieldAutoCompleteComponent implements OnInit {

    @Input() field: IAutoCompleteField;
    @Input() control: FormControl;

    private errors: string[];
    private groups: GroupedOptions[];
    private groupsAsync: Observable<GroupedOptions[]>;
    private values: ValueOption[];
    private valuesAsync: Observable<ValueOption[]>;

    constructor() {
        this.groups = [];
        this.values = [];
        this.errors = [];
    }

    ngOnInit() {
        if (this.field.options) {
            const optWithGroup = this.field.options.filter((value) => {
                return value.group && value.group.length > 0;
            });
            if (optWithGroup && optWithGroup.length > 0) {
                this.field.options.forEach((value) => {
                    let group = this.groups.find((val) => {
                        return val.name === value.group;
                    });
                    if (!group) {
                        group = {
                            name: value.group,
                            options: []
                        };
                        this.groups.push(group);
                    }
                    group.options.push(value);
                });
                this.groupsAsync = this.control.valueChanges
                  .pipe(
                    startWith(''),
                    map(value => this._filterGroup(value))
                  );
            } else {
                this.field.options.forEach((value) => {
                    this.values.push(value);
                });

                this.valuesAsync = this.control.valueChanges
                  .pipe(
                    startWith(''),
                    map(value => this._filter(this.values, value))
                  );
            }
        }

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


    private _filterGroup(value: string): GroupedOptions[] {
        if (value) {
            return this.groups
            .map(group => ({name: group.name, options: this._filter(group.options, value)}))
            .filter(group => group.options.length > 0);
        }
        return this.groups;
    }

    private _filter = (opt: ValueOption[], value: string): ValueOption[] => {
        if (typeof value === 'string') {
            const filterValue = value.toLowerCase();
            return opt.filter(item => item.value.toLowerCase().indexOf(filterValue) === 0);
        }
        return [];
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

interface GroupedOptions {
    name: string;
    options: ValueOption[];
}
