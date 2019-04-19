import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-custom-component',
    template: `
        <div>
            I'm a custom component
        </div>
    `,
    styles: [
        `
        `
    ]
})
export class CustomFieldComponent implements OnInit {

    @Input() field;
    @Input() control: FormControl;

    constructor() {
    }

    ngOnInit() {
    }
}
