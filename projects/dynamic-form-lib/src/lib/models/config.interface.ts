import { Type } from '@angular/core';
import { ValidatorFn, AsyncValidatorFn } from '@angular/forms';

export interface Config {
    customComponents?: {
        [key: string]: Type<any>
    };
    customValidators?: {
        [key: string]: ValidatorFn | AsyncValidatorFn;
    };
}
