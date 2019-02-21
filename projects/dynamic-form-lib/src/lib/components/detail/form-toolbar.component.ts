import { DynamicFormService } from '../../services/dynamic-form.service';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { IFormStruct } from '../../models';
import { Store } from '@ngrx/store';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { STORE_NAME, IState } from '../../models/common.interface';
import { DetailReset } from '../../actions/data.actions';

@Component({
    selector: 'df-form-toolbar',
    template: `
        <mat-toolbar *ngIf="formSchema" [color]="formSchema.toolbarColor">
            <mat-toolbar-row>
                <span>{{formSchema.name}}</span>
            </mat-toolbar-row>
            <mat-toolbar-row>
                <button (click)="changeView.emit()" *ngIf="formSchema.type === 'both'" mat-icon-button>
                    <mat-icon aria-label="Change View">{{tabIndex === 1 ? 'view_list' : 'create'}}</mat-icon>
                </button>
                <button (click)="resetFormCommand()" *ngIf="tabIndex === 1 && isFormModified" mat-icon-button>
                    <mat-icon aria-label="Reset Form">undo</mat-icon>
                </button>
            </mat-toolbar-row>
        </mat-toolbar>
    `,
    styles: []
})
export class FormToolbarComponent implements OnInit {

    private formSchema: IFormStruct;
    @Input() tabIndex: number;

    @Output() changeView: EventEmitter<void>;

    private isFormModified: boolean;

    constructor(private dynamicFormService: DynamicFormService,
                private store: Store<IState>) {
        this.changeView = new EventEmitter();
        this.isFormModified = false;
    }

    ngOnInit() {
        this.store.select(STORE_NAME)
            .pipe(map((state: IState) => state.schema), distinctUntilChanged())
            .subscribe((value) => {
                if (value.loaded) {
                    this.formSchema = value.data;
                    this.initToolbar();
                }
            });
        this.store.select(STORE_NAME)
            .pipe(map((state: IState) => state.detail), distinctUntilChanged())
            .subscribe((value) => {
                this.isFormModified = value.updated;
            });
    }

    private initToolbar() {
        if (this.formSchema) {
            this.dynamicFormService.isFormModified().subscribe((modified) => {
                this.isFormModified = modified;
            });
        }
    }

    resetFormCommand() {
        this.store.dispatch(new DetailReset(true));
    }
}
