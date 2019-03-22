import { HttpRequest } from '@angular/common/http';
import { InvalidSchemaRetrieveError } from './exceptions';
import { RequestOptions } from './common.interface';
import { Paging } from './store.interface';

export class DataRetrieve {
    constructor(public request?: RequestOptions,
                public paging?: Paging,
                public onGetData?: (request: HttpRequest<any>, paging?: Paging) => HttpRequest<any>,
                public afterGetData?: (error: Error, body: any) => void) {
                    if (!request) {
                        throw new InvalidSchemaRetrieveError('Request options is required');
                    }
                }
}
