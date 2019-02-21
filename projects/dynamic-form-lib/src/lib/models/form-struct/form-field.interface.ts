import { IInputField, ICheckBoxField } from './form-field.interface';
import { ValidatorFn } from '@angular/forms';
import { Type } from '@angular/core';

export interface IBaseField {
    name: string;
    type: 'input' | 'checkbox' | 'radio' | 'autocomplete' | 'select' | 'custom';
    component?: Type<{}>;
    label?: string;
    placeholder?: string;
    grid?: IGrid;
}

export interface IGrid {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
}

export interface IFieldError {
    validator: ValidatorFn;
    key: string;
    message: string;
    priority: number;
}

export interface ValueOption {
    key: string;
    value: string;
    group?: string;
}

export interface IInputField extends IBaseField {
    inputType: 'color' | 'date' | 'datetime-local' | 'email' | 'month' | 'number'
    | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week';
    maxLength?: number;
    hintText?: string;
    validators?: IFieldError[];
}

export interface ICheckBoxField extends IBaseField {
    labelPosition: 'before' | 'after';
}

export interface IRadioField extends IBaseField {
    labelPosition: 'before' | 'after';
    orientation: 'vertical' | 'horizontal';
    options: ValueOption[];
}

export interface IAutoCompleteField extends IInputField {
    options?: ValueOption[];
}

export interface ISelectField extends IBaseField {
    multiple: boolean;
    hintText?: string;
    emptyText?: string;
    validators?: IFieldError[];
    options?: ValueOption[];
}

export type FormField = IInputField | ICheckBoxField | IRadioField | IAutoCompleteField | ISelectField;
