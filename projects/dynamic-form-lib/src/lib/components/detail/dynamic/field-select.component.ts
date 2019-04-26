import { ValueOption, ISelectField } from '../../../models/struct/form-field.interface';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ValueOptionRetrieve } from '../../../models';
import { DynamicFormService } from '../../../services/dynamic-form.service';
import { HttpEventType } from '@angular/common/http';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'df-field-select',
    template: `
        <mat-form-field style="width: 100%">
            <label *ngIf="field.label">{{field.label}}</label>
            <mat-select *ngIf="field.multiple" [compareWith]="compareFunction"
            [formControl]="control" [placeholder]="field.placeholder" multiple>
                <mat-option *ngFor="let option of valuesAsync | async" [value]="option.key">{{option.value}}</mat-option>
                <mat-optgroup *ngFor="let group of groupsAsync | async" [label]="group.name">
                    <mat-option *ngFor="let option of group.options" [value]="option.key">
                        {{option.value}}
                    </mat-option>
                </mat-optgroup>
            </mat-select>
            <mat-select *ngIf="!field.multiple" [compareWith]="compareFunction"
            [formControl]="control" [placeholder]="field.placeholder">
                <mat-option *ngFor="let option of valuesAsync | async" [value]="option.key">{{option.value}}</mat-option>
                <mat-optgroup *ngFor="let group of groupsAsync | async" [label]="group.name">
                    <mat-option *ngFor="let option of group.options" [value]="option.key">
                        {{option.value}}
                    </mat-option>
                </mat-optgroup>
            </mat-select>
            <mat-hint *ngIf="field.hintText">{{field.hintText}}</mat-hint>
            <mat-hint *ngIf="field.maxLength" align="end">{{control.value ? control.value.length : 0}} / {{field.maxLength}}</mat-hint>
            <mat-error *ngFor="let error of errors">
              {{error}}
            </mat-error>
        </mat-form-field>
    `,
    styles: []
})
export class FieldSelectComponent implements OnInit {

    @Input() field: ISelectField;
    @Input() control: FormControl;

    private errors: string[];
    private groups: GroupedOptions[];
    private groupsAsync: Observable<GroupedOptions[]>;
    private values: ValueOption[];
    private valuesAsync: Observable<ValueOption[]>;

    constructor(private formService: DynamicFormService) {
        this.groups = [];
        this.values = [];
        this.errors = [];
    }

    ngOnInit() {
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
        if (!this.field.multiple) {
            this.values.push({
                key: '',
                value: this.field.emptyText || '*** NESSUN VALORE ***'
            });
        }
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
                this.groupsAsync = of(this._filterGroup(''));
            } else {
                options.forEach((value) => {
                    this.values.push(value);
                });
                this.valuesAsync = of(this._filter(this.values, ''));
            }
        }
    }

    private compareFunction(o1: string, o2: string) {
        return o1 && o2 &&  o1 === o2;
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
