import { HttpRequest } from '@angular/common/http';
import { IFormStruct } from './form-struct/form-struct.interface';
import { InvalidSchemaRetrieveError } from './exceptions';
import { RequestOptions } from './common.interface';

export class SchemaRetrieve {
    constructor(public request?: RequestOptions,
                public onGetSchema?: (request: HttpRequest<any>) => void,
                public afterGetSchema?: (error: Error, body: IFormStruct) => void) {
                    if (!request) {
                        throw new InvalidSchemaRetrieveError('Path or request options is required');
                    }
                }
}
