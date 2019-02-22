import { HttpHeaders } from '@angular/common/http';

export interface RequestOptions {
    url: string;
    method: 'get' | 'post' | 'delete' | 'update';
    headers?: HttpHeaders;
}
