import { DataEffects } from './effects/data.effect';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
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
    FormListComponent
],
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    DfMaterialModule,
    StoreModule.forFeature(STORE_NAME, rootReducer),
    EffectsModule.forFeature([
        SchemaEffects,
        DataEffects
    ])
],
  exports: [DynamicFormLibComponent],
  entryComponents: [
      FieldInputComponent,
      FieldCheckBoxComponent,
      FieldRadioComponent,
      FieldAutoCompleteComponent,
      FieldSelectComponent
  ]
})
export class DynamicFormLibModule { }
