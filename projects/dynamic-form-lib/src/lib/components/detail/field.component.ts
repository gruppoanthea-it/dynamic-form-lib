import { FieldSelectComponent } from './dynamic/field-select.component';
import { FieldCheckBoxComponent } from './dynamic/field-checkbox.component';
import { DynamicDomService } from './../../services/dynamic-dom.service';
import { Component, OnInit, Input, ViewChild, ViewContainerRef, Type } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormField } from '../../models';
import { FieldInputComponent } from './dynamic/field-input.component';
import { FieldRadioComponent } from './dynamic/field-radio.component';
import { FieldAutoCompleteComponent } from './dynamic/field-autocomplete.component';

@Component({
    selector: 'df-field',
    template: `
        <ng-template #dynamic></ng-template>
    `,
    styles: []
})
export class FieldComponent implements OnInit {

    @Input() field: FormField;
    @Input() control: FormControl;

    @ViewChild('dynamic', {
        read: ViewContainerRef
    }) viewContainerRef: ViewContainerRef;

    constructor(private dynamicDom: DynamicDomService) {

    }

    ngOnInit() {
        this.dynamicDom.setRootViewContainerRef(this.viewContainerRef);
        let component: Type<any> | string;
        if (this.field.component) {
            component = this.field.component;
        } else {
            switch (this.field.type) {
                case 'input':
                    component = FieldInputComponent;
                    break;
                case 'checkbox':
                    component = FieldCheckBoxComponent;
                    break;
                case 'radio':
                    component = FieldRadioComponent;
                    break;
                case 'autocomplete':
                    component = FieldAutoCompleteComponent;
                    break;
                case 'select' :
                    component = FieldSelectComponent;
                    break;
            }
        }
        this.dynamicDom.addDynamicComponent(component, {
            field: this.field,
            control: this.control
        });
    }
}
