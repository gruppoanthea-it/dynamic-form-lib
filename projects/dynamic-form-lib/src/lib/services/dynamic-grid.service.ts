import { Injectable } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DynamicGridService {

    private readonly breakPoints: string[] = ['xs', 'sm', 'md', 'lg', 'xl'];

    private currentBP$: Observable<string>;

    constructor(private mediaObserver: MediaObserver) {
        this.currentBP$ = this.mediaObserver.media$.pipe(map(value => value.mqAlias));
    }

}
