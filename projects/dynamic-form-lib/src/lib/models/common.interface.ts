import { HttpHeaders } from '@angular/common/http';
import { IFormStruct } from './form-struct/form-struct.interface';
import { IDataState } from '../reducers/data.reducer';
import { IDetailState } from '../reducers/detail.reducer';
import { IListState } from '../reducers/list.reducer';
import { ISchemaState } from '../reducers/schema.reducer';

export interface RequestOptions {
    url: string;
    method: 'get' | 'post' | 'delete' | 'update';
    headers?: HttpHeaders;
}

export const STORE_NAME = 'dynamic_form';

export interface IState {
    data: IDataState;
    detail: IDetailState;
    list: IListState;
    schema: ISchemaState;
}
