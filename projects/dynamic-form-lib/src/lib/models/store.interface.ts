import { IFormStruct } from './form-struct/form-struct.interface';

export const STORE_NAME = 'dynamic_form';

export interface LibraryState {
    uiState: UiState;
    storeData: StoreData;
}

export interface UiState {
    selectedKey: string;
    error: ErrorData;
}

export interface ErrorData {
    context: string;
    message: string;
}

export interface StoreData {
    data: EntityData;
    schema: SchemaData;
}

export interface EntityData {
    loading: boolean;
    loaded: boolean;
    items: {
        [key: string]: any;
    };
    original: {
        [key: string]: any;
    };
}

export interface SchemaData {
    loading: boolean;
    loaded: boolean;
    item: IFormStruct;
}
