import { Component } from '@angular/core';
import { SchemaRetrieve, DataRetrieve } from 'projects/dynamic-form-lib/src/public_api';
import { EventOptions, EventInsert, EventReset } from 'projects/dynamic-form-lib/src/lib/models/events.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'dynamic-form-app';

    schemaRetrieve = new SchemaRetrieve({
        url: location + '/assets/json/schema.json',
        method: 'get'
    });

    dataRetrieve = new DataRetrieve({
        url: location + '/assets/json/data.json',
        method: 'get'
    });

    eventOptions: EventOptions = {
        OnEventInsert: (event: EventInsert) => {
            console.log(event);
        },
        OnEventReset: (event: EventReset) => {
            console.log(event);
        }
    };
}
