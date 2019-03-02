import { FormField } from './form-field.interface';
import { ThemePalette } from '@angular/material/core';
import { ListField } from './list-field.interface';

export enum StructTypes {
    BOTH = 'BOTH',
    DETAIL = 'DETAIL',
    LIST = 'LIST'
}

export interface StructDisplayOptions {
    caption?: string;
    toolbarColor?: ThemePalette;
    disabled?: boolean; // Ignored in list -> always disabled
    canInsert?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
}

export interface Struct {
    id: string;
    type: StructTypes;
    displayOptions?: StructDisplayOptions;
    form?: Form;
    list?: List;
}

export interface Form {
    displayOptions?: StructDisplayOptions;
    fields: FormField[];
}

export interface List {
    displayOptions?: StructDisplayOptions;
    fields: ListField[];
}
