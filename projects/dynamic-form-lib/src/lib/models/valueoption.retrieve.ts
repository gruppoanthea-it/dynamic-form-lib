import { HttpRequest } from '@angular/common/http';
import { Struct } from './struct/struct.interface';
import { InvalidSchemaRetrieveError } from './exceptions';
import { RequestOptions } from './common.interface';
import { ValueOption } from './struct/form-field.interface';

export class ValueOptionRetrieve {
    constructor(public request?: RequestOptions,
                public onGetOptions?: (request: HttpRequest<any>) => HttpRequest<any>,
                public afterGetOptions?: (error: Error, body: ValueOption[]) => void) {
                    if (!request) {
                        throw new InvalidSchemaRetrieveError('Request options is required');
                    }
                }
}
