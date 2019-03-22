import { HttpRequest } from '@angular/common/http';
import { Struct } from './struct/struct.interface';
import { InvalidSchemaRetrieveError } from './exceptions';
import { RequestOptions } from './common.interface';

export class SchemaRetrieve {
    constructor(public request?: RequestOptions,
                public onGetSchema?: (request: HttpRequest<any>) => HttpRequest<any>,
                public afterGetSchema?: (error: Error, body: Struct) => void) {
                    if (!request) {
                        throw new InvalidSchemaRetrieveError('Request options is required');
                    }
                }
}
