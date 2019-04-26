import { Component, OnInit, Input } from '@angular/core';
import { IAutoCompleteField, ValueOption } from '../../../models';
import { Observable } from 'rxjs';
import {startWith, map, debounceTime, filter} from 'rxjs/operators';
import { DynamicFormService } from '../../../services/dynamic-form.service';
import { HttpEventType } from '@angular/common/http';
import { ValidationField } from './validation.field';
import { ConfigOptions } from '../../../config.options';

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
export class FieldAutoCompleteComponent extends ValidationField implements OnInit {

    @Input() field: IAutoCompleteField;

    private errors: string[];
    private groups: GroupedOptions[];
    private groupsAsync: Observable<GroupedOptions[]>;
    private values: ValueOption[];
    private valuesAsync: Observable<ValueOption[]>;

    constructor(private formService: DynamicFormService,
                private configService: ConfigOptions) {
        super(configService.getConfig());
        this.groups = [];
        this.values = [];
        this.errors = [];
    }

    ngOnInit() {
        super.ngOnInit();
        this.loadOptions();
        if (this.field.requestOnChange) {
            if (this.field.linkedFields) {
                const form = this.control.parent;
                const linkedFields = this.field.linkedFields.split(',');
                linkedFields.forEach(el => {
                    const linked = form.get(el);
                    if (linked) {
                        linked.valueChanges.pipe(debounceTime(this.field.debounceOnLinked || 0))
                            .subscribe(() => this.loadOptions());
                    }
                    this.control.valueChanges.pipe(debounceTime(this.field.debounce || 0))
                            .subscribe((value) => {
                                if (this.field.minDigits && value.length < this.field.minDigits) {
                                    this.clearOptions();
                                    return;
                                }
                                this.loadOptions();
                            });
                });
            }
        }
    }

    loadOptions() {
        if (!this.field.options) {
            this.formService.retrieveOptions(this.field.name, this.control.parent.value)
                .subscribe(value => {
                    if (value.request.type === HttpEventType.Response) {
                        let values: ValueOption[] = value.request.body as ValueOption[];
                        if (value.cb) {
                            values = value.cb(null, values, this.control.parent.value);
                        }
                        this.initOptions(values);
                    }
                });
        } else {
            this.initOptions(this.field.options);
        }
    }

    private clearOptions() {
        this.groups.splice(0, this.groups.length);
        this.values.splice(0, this.values.length);
    }

    private initOptions(options: ValueOption[]) {
        if (options) {
            this.clearOptions();
            const optWithGroup = options.filter((value) => {
                return value.group && value.group.length > 0;
            });
            if (optWithGroup && optWithGroup.length > 0) {
                options.forEach((value) => {
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
                options.forEach((value) => {
                    this.values.push(value);
                });
                this.valuesAsync = this.control.valueChanges
                    .pipe(
                      startWith(''),
                      map(value => this._filter(this.values, value))
                    );
            }
        }
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

    errorChanges(errors: string[]) {
        this.errors.splice(0, this.errors.length);
        this.errors.push(...errors);
    }
}

interface GroupedOptions {
    name: string;
    options: ValueOption[];
}
