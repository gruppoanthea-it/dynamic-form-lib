import { HttpRequest } from '@angular/common/http';
import { InvalidSchemaRetrieveError } from './exceptions';
import { RequestOptions } from './common.interface';

export class DataRetrieve {
    constructor(public request?: RequestOptions,
                public onGetData?: (request: HttpRequest<any>) => void,
                public afterGetData?: (error: Error, body: any) => void) {
                    if (!request) {
                        throw new InvalidSchemaRetrieveError('Request options is required');
                    }
                }
}
