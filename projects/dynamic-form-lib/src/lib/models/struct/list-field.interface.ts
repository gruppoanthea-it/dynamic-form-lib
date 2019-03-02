import { Grid } from '../common.interface';

export interface BaseListField {
    header?: string;
    grid?: Grid;
    name: string;
}

export interface ImageField extends BaseListField {
    matName?: string;
    url?: string;
    base64?: string;
}

export type ListField = ImageField;
