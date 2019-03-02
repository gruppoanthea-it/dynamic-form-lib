import { ValueOptionRetrieve } from '../valueoption.retrieve';
import { Grid } from '../common.interface';

export interface BaseFormField {
    name: string;
    type: 'input' | 'checkbox' | 'radio' | 'autocomplete' | 'select' | 'custom';
    component?: string;
    label?: string;
    placeholder?: string;
    grid?: Grid;
}

export interface IFieldError {
    validator: 'required' | string;
    key: string;
    message: string;
    priority: number;
}

export interface ValueOption {
    key: string;
    value: string;
    group?: string;
}

export interface IInputField extends BaseFormField {
    inputType: 'color' | 'date' | 'datetime-local' | 'email' | 'month' | 'number'
    | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week';
    maxLength?: number;
    hintText?: string;
    validators?: IFieldError[];
}

export interface ICheckBoxField extends BaseFormField {
    labelPosition: 'before' | 'after';
}

export interface IRadioField extends BaseFormField {
    labelPosition: 'before' | 'after';
    orientation: 'vertical' | 'horizontal';
    options: ValueOption[] | ValueOptionRetrieve;
}

export interface IAutoCompleteField extends IInputField {
    options?: ValueOption[] | ValueOptionRetrieve;
}

export interface ISelectField extends BaseFormField {
    multiple: boolean;
    hintText?: string;
    emptyText?: string;
    validators?: IFieldError[];
    options?: ValueOption[] | ValueOptionRetrieve;
}

export type FormField = IInputField | ICheckBoxField |
IRadioField | IAutoCompleteField | ISelectField;
