import { NgModule } from '@angular/core';
import { DynamicFormLibModule } from 'projects/dynamic-form-lib/src/public_api';
import { StoreModule } from '@ngrx/store';
import { AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChildComponent } from './child.component';

export function customValidatorFunction(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<{[key: string]: any}> | null => {
    // test as async http
    const observable = Observable.create((observer: Observer<{[key: string]: any}>) => {
      setTimeout(() => {
        observer.next({'custom': true});
        observer.complete();
      }, 4000);
    });
    return observable;
  };
}

@NgModule({
  declarations: [
    ChildComponent
  ],
  imports: [
    CommonModule,
    DynamicFormLibModule.forChild({
      customValidators: {
        'custom-child': customValidatorFunction()
      }
    }),
    StoreModule.forFeature('child', {})
  ],
  exports: [ChildComponent],
  providers: [{
      provide: 'ENTRY_POINT',
      useValue: ChildComponent
  }],
  entryComponents: [ChildComponent]
})
export class ChildModule {

}
