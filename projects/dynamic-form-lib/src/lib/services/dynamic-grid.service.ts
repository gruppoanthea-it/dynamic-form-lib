import { Injectable } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DynamicGridService {

    private observers: Map<string, BreakpointObserver>;

    constructor(private mediaObserver: MediaObserver) {
        this.observers = new Map();
        this.mediaObserver.media$
            .subscribe(value => this.emitValues(value.mqAlias as Breakpoints));
    }

    private emitValues(current: Breakpoints) {
        this.observers.forEach((value, key) => {
            const mode = key.split('_')[0] as unknown as Mode;
            const breakpoint = key.split('_')[1] as unknown as Breakpoints;
            const ret = this.checkBp(current, breakpoint, mode);
            if (value.lastEmittedValue !== ret) {
                value.lastEmittedValue = ret;
                value.subject.next(ret);
            }
        });
    }

    private checkBp(current: Breakpoints, observed: Breakpoints, mode: Mode) {
        if ((observed === Breakpoints.XS && mode === Mode.BELOW) ||
        (observed === Breakpoints.XL && mode === Mode.ABOVE)) {
            return false;
        }
        switch (current) {
            case Breakpoints.XS:
                if (mode === Mode.BELOW) {
                    return true;
                } else {
                    return false;
                }
            case Breakpoints.SM:
                if (mode === Mode.BELOW) {
                    if (observed === Breakpoints.SM) {
                        return false;
                    }
                    return true;
                } else {
                    if (observed === Breakpoints.XS) {
                        return true;
                    }
                    return false;
                }
            case Breakpoints.MD:
                if (mode === Mode.BELOW) {
                    if (observed === Breakpoints.SM || observed === Breakpoints.MD) {
                        return false;
                    }
                    return true;
                } else {
                    if (observed === Breakpoints.XS || observed === Breakpoints.SM) {
                        return true;
                    }
                    return false;
                }
            case Breakpoints.LG:
                if (mode === Mode.BELOW) {
                    if (observed === Breakpoints.XL) {
                        return true;
                    }
                    return false;
                } else {
                    if (observed === Breakpoints.LG || observed === Breakpoints.XL) {
                        return false;
                    }
                    return true;
                }
            case Breakpoints.XL:
                if (mode === Mode.BELOW) {
                    if (observed === Breakpoints.XL) {
                        return false;
                    }
                    return true;
                } else {
                    if (observed === Breakpoints.XL) {
                        return false;
                    }
                    return true;
                }
        }
    }

    observe(mode: Mode, breakpoint: Breakpoints) {
        const key: string = mode + '_' + breakpoint;
        if (this.observers.has(key)) {
            return this.observers.get(key).subject;
        }
        const subject = new BehaviorSubject(false);
        const ob = new BreakpointObserver(false, subject);
        this.observers.set(key, ob);
        return subject;
    }
}

export class BreakpointObserver {
    constructor(public lastEmittedValue: boolean,
                public subject: BehaviorSubject<boolean>) {}
}

export enum Mode {
    ABOVE,
    BELOW
}

export enum Breakpoints {
    XS = 'xs',
    SM = 'sm',
    MD = 'md',
    LG = 'lg',
    XL = 'xl'
}
