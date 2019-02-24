import { getSchema, getSelectedItem } from './../../reducers/selectors';
import { Component, OnInit} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { IFormStruct } from '../../models';
import { deepCopy, equals } from '../../utility/utility.functions';
import { LibraryState } from '../../models/store.interface';
import { DynamicFormService } from '../../services/dynamic-form.service';
import { DataUpdate } from '../../actions/data.actions';
import { Entity } from '../../models/common.interface';

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
    private data: Entity;
    private form: FormGroup;
    private stopPropagation: boolean;

    private grids: any;
    private readonly breakPoints: string[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    private currentBP: string;

    constructor(private mediaObserver: MediaObserver,
         private store: Store<LibraryState>) {
        this.mediaObserver.media$.subscribe((media: MediaChange) => {
            this.currentBP = media.mqAlias;
            this.adjustGrid();
        });
        this.stopPropagation = false;
    }

    ngOnInit() {
        this.store.pipe(select(getSchema))
            .subscribe((value) => {
                if (value.loaded) {
                    this.formSchema = value.item;
                    this.initForm();
                }
            });
        this.store.pipe(select(getSelectedItem))
            .subscribe(value => {
                this.data = value;
                this.parseData();
            });
    }

    private parseData() {
        if (!this.data) {
            this.data = new Entity();
        }
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
                        this.data.data[key] = values[key];
                    }
                }
                this.store.dispatch(new DataUpdate(this.data));
            }
        });
    }

    submit() {
        console.log(this.form);
    }

    resetForm() {
        this.stopPropagation = true;
        for (const key in this.form.controls) {
            if (this.form.controls.hasOwnProperty(key)) {
                this.form.controls[key].setValue(this.data.data[key]);
            }
        }
        // this.store.dispatch(new DetailReset(false));
        // this.store.dispatch(new DetailUpdated(false));
        this.stopPropagation = false;
    }
}
