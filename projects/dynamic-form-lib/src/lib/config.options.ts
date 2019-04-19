import { Injectable, Inject, InjectionToken } from '@angular/core';
import { Config } from './models/config.interface';

export const ConfigToken = new InjectionToken<Config>('Config');
@Injectable()
export class ConfigOptions {

    private config: Config;
    constructor(@Inject(ConfigToken) config: Config) {
        this.config = config;
    }

    getConfig(): Config {
        return Object.freeze(this.config);
    }

    mergeConfig(config: Config) {
        if (!this.config) {
            this.config = config;
        } else {
            if (config.customComponents) {
                if (!this.config.customComponents) {
                    this.config.customComponents = {};
                }
                for (const key in config.customComponents) {
                    if (config.customComponents.hasOwnProperty(key)) {
                        this.config.customComponents[key] = config.customComponents[key];
                    }
                }
            }
            if (config.customValidators) {
                if (!this.config.customValidators) {
                    this.config.customValidators = {};
                }
                for (const key in config.customValidators) {
                    if (config.customValidators.hasOwnProperty(key)) {
                        this.config.customValidators[key] = config.customValidators[key];
                    }
                }
            }
        }
    }
}
