import { NgModule } from '@angular/core';

import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
    imports: [
        MatInputModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatRadioModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatTabsModule,
        MatTableModule,
        MatProgressSpinnerModule
    ],
    exports: [
        MatInputModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatRadioModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatTabsModule,
        MatTableModule,
        MatProgressSpinnerModule
    ]
  })
  export class DfMaterialModule { }
