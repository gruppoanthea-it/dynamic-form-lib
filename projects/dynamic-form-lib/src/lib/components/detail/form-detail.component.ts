import { getSchema, getSelectedItem, getDataEntity } from './../../reducers/selectors';
import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Struct } from '../../models';
import { DataUpdate } from '../../actions/data.actions';
import { Entity } from '../../models/common.interface';
import { DispatcherService } from '../../dispatcher.service';

@Component({
    selector: 'df-form-detail',
    template: `
      <form [formGroup]="form" *ngIf="formSchema">
            <div fxLayout="row wrap" fxLayoutGap="2rem grid">
                <df-field *ngFor="let field of formSchema.form.fields" [field]="field"
                [control]="form.get(field.name)" [fxFlex]="grids[field.name] / 12 * 100 + '%'"></df-field>
            </div>
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

    private formSchema: Struct;
    private data: Entity;
    private dataLoaded: boolean;
    private form: FormGroup;
    private stopPropagation: boolean;

    private grids: any;
    private readonly breakPoints: string[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    private currentBP: string;

    constructor(private mediaObserver: MediaObserver,
         private dispatchService: DispatcherService) {
        this.mediaObserver.media$.subscribe((media: MediaChange) => {
            this.currentBP = media.mqAlias;
            this.adjustGrid();
        });
        this.stopPropagation = false;
        this.dataLoaded = false;
    }

    ngOnInit() {
        this.dispatchService.getSelector(getSchema)
            .subscribe((value) => {
                if (value.loaded) {
                    this.formSchema = value.item;
                    this.initForm();
                }
            });
        this.dispatchService.getSelector(getSelectedItem)
            .subscribe(value => {
                this.data = value;
                this.parseData();
            });
        this.dispatchService.getSelector(getDataEntity)
            .subscribe(value => {
                this.dataLoaded = value.loaded;
                this.parseData();
            });
    }

    private parseData() {
        if (!this.dataLoaded) {
            return;
        }
        if (!this.data) {
            this.data = new Entity();
            return;
        }
        this.resetForm();
    }

    private initForm() {
        const controls = {};
        this.grids = {};
        this.formSchema.form.fields.forEach((el) => {
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
        this.formSchema.form.fields.forEach((el) => {
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
                this.dispatchService.dispatchAction(new DataUpdate(this.data));
            }
        });
    }

    private resetForm() {
        this.stopPropagation = true;
        for (const key in this.form.controls) {
            if (this.form.controls.hasOwnProperty(key)) {
                this.form.controls[key].setValue(this.data.data[key]);
            }
        }
        this.stopPropagation = false;
    }
}
