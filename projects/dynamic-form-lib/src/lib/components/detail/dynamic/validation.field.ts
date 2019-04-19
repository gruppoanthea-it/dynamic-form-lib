import { Input, OnInit } from '@angular/core';
import { FormControl, ValidatorFn, AsyncValidatorFn, Validators } from '@angular/forms';
import { FormField, IFieldError, InvalidParamsError } from '../../../models';
import { Config } from '../../../models/config.interface';
import { distinctUntilChanged } from 'rxjs/operators';

export abstract class ValidationField implements OnInit {
    @Input() control: FormControl;
    @Input() field: FormField;

    constructor(private config: Config) {
    }

    ngOnInit() {
        if (this.field.validators) {
            const validators: ValidatorFn[] = [];
            const asyncValidators: AsyncValidatorFn[] = [];
            this.field.validators.forEach((value) => {
                if (value.validator !== 'custom') {
                    const validator = this.parseDefaultValidator(value);
                    if (validator) {
                        validators.push(validator);
                    }
                } else {
                    const validator = this.parseCustomValidator(value);
                    if (validator) {
                        if (value.async) {
                            asyncValidators.push(validator as AsyncValidatorFn);
                        } else {
                            validators.push(validator);
                        }
                    }
                }
            });
            if (validators.length > 0) {
                this.control.setValidators(validators);
            }
            if (asyncValidators.length > 0) {
                this.control.setAsyncValidators(asyncValidators);
            }
            this.control.statusChanges
            .pipe(distinctUntilChanged())
            .subscribe(status => {
                if (status === 'INVALID') {
                    if (this.control.errors != null) {
                        const errors: string[] = [];
                        for (const key in this.control.errors) {
                            if (this.control.errors.hasOwnProperty(key)) {
                                const validator = this.field.validators.find((el) => {
                                    return el.key === key;
                                });
                                if (validator) {
                                    errors.push(validator.message);
                                }
                            }
                        }
                        this.errorChanges(errors);
                    }
                }
            });
        }
    }

    abstract errorChanges(errors: string[]);

    parseDefaultValidator(value: IFieldError): ValidatorFn {
        switch (value.validator) {
            case 'min':
                if (typeof value.params !== 'number') {
                    throw new InvalidParamsError('Invalid params for Validators.min(value: number)');
                }
                return Validators.min(value.params);
            case 'max':
                if (typeof value.params !== 'number') {
                    throw new InvalidParamsError('Invalid params for Validators.max(value: number)');
                }
                return Validators.max(value.params);
            case 'required':
                return Validators.required;
            case 'requiredTrue':
                return Validators.requiredTrue;
            case 'email':
                return Validators.email;
            case 'minLength':
                if (typeof value.params !== 'number') {
                    throw new InvalidParamsError('Invalid params for Validators.minLength(value: number)');
                }
                return Validators.minLength(value.params);
            case 'maxLength':
                if (typeof value.params !== 'number') {
                    throw new InvalidParamsError('Invalid params for Validators.maxLength(value: number)');
                }
                return Validators.maxLength(value.params);
            case 'pattern':
                if (typeof value.params !== 'string') {
                    throw new InvalidParamsError('Invalid params for Validators.pattern(value: string | RegExp)');
                }
                return Validators.pattern(value.params);
        }
        return null;
    }

    parseCustomValidator(value: IFieldError): ValidatorFn | AsyncValidatorFn {
        if (this.config && this.config.customValidators && this.config.customValidators[value.key]) {
            return this.config.customValidators[value.key];
        }
        return null;
    }
}
