import { Injectable } from '@angular/core';
import { Config } from './models/config.interface';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormConfigService {

    config: Config;
    constructor() { }

    setConfig(conf: Config) {
        this.config = conf;
    }

    getConfig() {
        return this.config;
    }
}
