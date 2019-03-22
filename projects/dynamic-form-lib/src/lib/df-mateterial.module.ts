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
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatPaginatorModule} from '@angular/material/paginator';

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
        MatProgressSpinnerModule,
        MatDividerModule,
        MatMenuModule,
        MatSnackBarModule,
        MatPaginatorModule
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
        MatProgressSpinnerModule,
        MatDividerModule,
        MatMenuModule,
        MatSnackBarModule,
        MatPaginatorModule
    ]
  })
  export class DfMaterialModule {
  }
