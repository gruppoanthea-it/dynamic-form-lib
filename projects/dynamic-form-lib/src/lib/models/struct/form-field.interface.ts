import { Grid } from '../common.interface';

export interface BaseFormField {
    name: string;
    type: 'input' | 'checkbox' | 'radio' | 'autocomplete' | 'select' | 'custom';
    component?: string;
    label?: string;
    placeholder?: string;
    grid?: Grid;
    validators?: IFieldError[];
}

export interface IFieldError {
    validator: 'min' | 'max' | 'required' | 'requiredTrue' | 'email' | 'minLength' |
                'maxLength' | 'pattern' | 'custom';
    params?: any;
    async: boolean; // Used for custom validators
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
}

export interface ICheckBoxField extends BaseFormField {
    labelPosition: 'before' | 'after';
}

export interface IRadioField extends BaseFormField {
    labelPosition: 'before' | 'after';
    orientation: 'vertical' | 'horizontal';
    options: ValueOption[];
}

export interface IAutoCompleteField extends IInputField {
    options?: ValueOption[];
}

export interface ISelectField extends BaseFormField {
    multiple: boolean;
    hintText?: string;
    emptyText?: string;
    options?: ValueOption[];
}

export type FormField = IInputField | ICheckBoxField |
IRadioField | IAutoCompleteField | ISelectField;
