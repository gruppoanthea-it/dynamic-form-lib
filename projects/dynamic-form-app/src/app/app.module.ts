import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NgModuleFactoryLoader, SystemJsNgModuleLoader } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { DynamicFormLibModule } from 'projects/dynamic-form-lib/src/public_api';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { CustomFieldComponent } from './custom.component';
import { AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { Route, provideRoutes } from '@angular/router';

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

const routes: Route[] = [
  {
    path: 'child',
    loadChildren: './child-module/child.module#ChildModule'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    CustomFieldComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DynamicFormLibModule.forRoot({
      customComponents: {
        'custom' : CustomFieldComponent
      },
      customValidators: {
        'custom': customValidatorFunction()
      }
    }),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      serialize: true
    })
  ],
  providers: [{ provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader }, provideRoutes(routes)],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule {

}
