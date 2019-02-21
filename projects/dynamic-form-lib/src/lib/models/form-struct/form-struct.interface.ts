import { FormField } from './form-field.interface';
import { ThemePalette } from '@angular/material/core';

export interface IFormStruct {
    id: string;
    type: 'both' | 'detail' | 'list';
    name: string;
    toolbarColor?: ThemePalette;
    fields: FormField[];
}
