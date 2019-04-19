import { DataEffects } from './effects/data.effect';
import { NgModule, ANALYZE_FOR_ENTRY_COMPONENTS, SkipSelf, Optional,
        ModuleWithProviders, Injector, InjectFlags, InjectionToken, Inject} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormLibComponent } from './dynamic-form-lib.component';
import 'hammerjs';
import { StoreModule } from '@ngrx/store';
import { rootReducer } from './reducers';
import { STORE_NAME } from './models/store.interface';
import { HttpClientModule } from '@angular/common/http';
import { FormDetailComponent } from './components/detail/form-detail.component';
import { FieldComponent } from './components/detail/field.component';
import { FieldInputComponent } from './components/detail/dynamic/field-input.component';
import { DfMaterialModule } from './df-mateterial.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormToolbarComponent } from './components/detail/form-toolbar.component';
import { FieldCheckBoxComponent } from './components/detail/dynamic/field-checkbox.component';
import { FieldRadioComponent } from './components/detail/dynamic/field-radio.component';
import { FieldAutoCompleteComponent} from './components/detail/dynamic/field-autocomplete.component';
import { FieldSelectComponent } from './components/detail/dynamic/field-select.component';
import { FormListComponent } from './components/list/form-list.component';
import { EffectsModule } from '@ngrx/effects';
import { SchemaEffects } from './effects/schema.effect';
import { EventsEffects } from './effects/events.effects';
import { FormFooterComponent } from './components/footer/footer.component';
import { Config } from './models/config.interface';
import { ConfigOptions, ConfigToken } from './config.options';
import { CommonModule } from '@angular/common';


export const FORROOT_GUARD = new InjectionToken<void>('FORROOT_GUARD');

export class Guard {
  constructor() {}

  get() {
    return 'guarded';
  }
}


@NgModule({
  declarations: [
    DynamicFormLibComponent,
    FormDetailComponent,
    FieldInputComponent,
    FormToolbarComponent,
    FieldComponent,
    FieldCheckBoxComponent,
    FieldRadioComponent,
    FieldAutoCompleteComponent,
    FieldSelectComponent,
    FormListComponent,
    FormFooterComponent
],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    DfMaterialModule,
    StoreModule.forFeature(STORE_NAME, rootReducer),
    EffectsModule.forFeature([
        SchemaEffects,
        DataEffects,
        EventsEffects
    ])
  ],
  providers: [],
  exports: [DynamicFormLibComponent],
  entryComponents: [
      FieldInputComponent,
      FieldCheckBoxComponent,
      FieldRadioComponent,
      FieldAutoCompleteComponent,
      FieldSelectComponent
  ]
})
export class DynamicFormLibModule {

  constructor(@Optional() @Inject(FORROOT_GUARD) token: any, @Optional() guard: Guard) {}

  static forRoot(config?: Config): ModuleWithProviders<DynamicFormLibModule> {
    return {
      ngModule: DynamicFormLibModule,
      providers: [
        {
          provide: Guard,
          useClass: Guard
        },
        {
          provide: FORROOT_GUARD,
          useFactory: (guard: Guard) => {
            if (guard) {
              // tslint:disable-next-line: max-line-length
              throw new Error(`DynamicFormLibModule.forRoot() called twice. Lazy loaded modules should use DynamicFormLibModule.forChild() instead.`);
            }
            return new Guard().get();
          },
          deps: [[Guard, new Optional(), new SkipSelf()]]
        },
        {
          provide: ANALYZE_FOR_ENTRY_COMPONENTS,
          multi: true,
          useValue: config
        },
        {
          provide: ConfigToken,
          useValue: config
        },
        ConfigOptions
      ]
    };
  }

  static forChild(config?: Config): ModuleWithProviders<DynamicFormLibModule> {
    return {
      ngModule: DynamicFormLibModule,
      providers: [
        {
          provide: ANALYZE_FOR_ENTRY_COMPONENTS,
          multi: true,
          useValue: config
        },
        {
          provide: ConfigToken,
          useValue: config
        },
        {
          provide: ConfigOptions,
          useFactory: (injector: Injector) => {
            const confSrv = injector.get(ConfigOptions, new ConfigOptions(config), InjectFlags.SkipSelf);
            confSrv.mergeConfig(config);
            return confSrv;
          },
          deps: [Injector]
        }
      ]
    };
  }
}
