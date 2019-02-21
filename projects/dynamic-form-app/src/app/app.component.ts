import { Component } from '@angular/core';
import { SchemaRetrieve, DataRetrieve } from 'projects/dynamic-form-lib/src/public_api';

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
}
