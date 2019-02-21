import { DetailUpdated, DetailReset } from '../../actions/data.actions';
import { Component, OnInit} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { STORE_NAME, IState } from '../../models/common.interface';
import { IFormStruct } from '../../models';
import { DynamicFormService } from '../../services/dynamic-form.service';
import { deepCopy, equals } from '../../utility/utility.functions';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'df-form-detail',
    template: `
      <form [formGroup]="form" *ngIf="formSchema">
            <div fxLayout="row wrap" fxLayoutGap="2rem grid">
                <df-field *ngFor="let field of formSchema.fields" [field]="field"
                [control]="form.get(field.name)" [fxFlex]="grids[field.name] / 12 * 100 + '%'"></df-field>
            </div>
            <button mat-button (click)="submit()">Submit</button>
      </form>
    `,
    styles: [`
        form {
            padding: 1rem;
            margin: 1rem;
        }
    `]
})
export class FormDetailComponent implements OnInit {

    private formSchema: IFormStruct;
    private data: any;
    private originalData: any;
    private form: FormGroup;
    private stopPropagation: boolean;

    private grids: any;
    private readonly breakPoints: string[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    private currentBP: string;

    constructor(private mediaObserver: MediaObserver,
         private dynamicFormService: DynamicFormService,
         private store: Store<IState>) {
        this.mediaObserver.media$.subscribe((media: MediaChange) => {
            this.currentBP = media.mqAlias;
            this.adjustGrid();
        });
        this.stopPropagation = false;
    }

    ngOnInit() {
        this.store.select(STORE_NAME)
            .pipe(map((state: IState) => state.schema), distinctUntilChanged())
            .subscribe((value) => {
                if (value.loaded) {
                    this.formSchema = value.data;
                    this.initForm();
                }
            });
        this.store.select(STORE_NAME)
            .pipe(map((state: IState) => {
                return {
                    data: state.data,
                    row: state.list ? state.list.selectedRow : 0
                };
            })
            , distinctUntilChanged())
            .subscribe((value) => {
                if (value.data.loaded) {
                    console.log('Data changed');
                    if (value.data.data.length > 0) {
                        this.data = value.data.data[value.row];
                        this.parseData();
                    }
                }
            });
    }

    private parseData() {
        if (!this.data) {
            this.data = {};
        }
        this.originalData = deepCopy(this.data);
        this.resetForm();
    }

    private initForm() {
        const controls = {};
        this.grids = {};
        this.formSchema.fields.forEach((el) => {
            const control = new FormControl();
            controls[el.name] = control;
        });
        this.form = new FormGroup(controls);
        this.registerChanges();
        this.adjustGrid();
    }

    private adjustGrid() {
        if (!this.formSchema) {
            return;
        }
        this.formSchema.fields.forEach((el) => {
            if (!el.grid) {
                this.grids[el.name] = 12;
                return;
            }
            let lastColSpan = 12;
            for (let i = 0; i < this.breakPoints.length; i++) {
                const bp = this.breakPoints[i];
                if (bp === this.currentBP && el.grid[bp]) {
                    this.grids[el.name] = el.grid[bp];
                    break;
                } else if (bp !== this.currentBP && el.grid[bp]) {
                    lastColSpan = el.grid[bp];
                } else if (bp === this.currentBP && !el.grid[bp]) {
                    this.grids[el.name] = lastColSpan;
                    break;
                }
            }
        });
    }

    private registerChanges() {
        this.form.valueChanges.subscribe((values) => {
            if (!this.stopPropagation) {
                for (const key in values) {
                    if (values.hasOwnProperty(key)) {
                        this.data[key] = values[key];
                    }
                }
                const updated = equals(this.data, this.originalData);
                this.store.dispatch(new DetailUpdated(updated));
            }
        });
    }

    submit() {
        console.log(this.form);
    }

    resetForm() {
        this.stopPropagation = true;
        this.data = deepCopy(this.originalData);
        for (const key in this.form.controls) {
            if (this.form.controls.hasOwnProperty(key)) {
                this.form.controls[key].setValue(this.data[key]);
            }
        }
        // this.store.dispatch(new DetailReset(false));
        // this.store.dispatch(new DetailUpdated(false));
        this.stopPropagation = false;
    }
}
