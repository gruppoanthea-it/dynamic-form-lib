import { Struct } from './struct/struct.interface';
import { Entity } from './common.interface';

export const STORE_NAME = 'dynamic_form';

export interface LibraryState {
    items: Map<string, {
        uiState: UiState;
        storeData: StoreData;
    }>;
}

export interface UiState {
    selectedKey: string;
    lastSelectedKey: string;
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
    paging: Paging;
    items: Map<string, Entity>;
    changes: Map<string, Entity>;
}

export interface Paging {
    ElementiPerPagina: number;
    ElementiTotali: number;
    NumeroPagina: number;
    PagineTotali: number;
}

export interface SchemaData {
    loading: boolean;
    loaded: boolean;
    item: Struct;
}
