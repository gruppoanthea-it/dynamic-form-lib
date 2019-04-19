import {
    ComponentFactoryResolver,
    Injectable,
    Type,
    ViewContainerRef
} from '@angular/core';
import { ConfigOptions } from '../config.options';



@Injectable({
    providedIn: 'root'
})
export class DynamicDomService {

    rootViewContainer: ViewContainerRef;

    constructor(private factoryResolver: ComponentFactoryResolver,
        private config: ConfigOptions) {
    }

    setRootViewContainerRef(viewContainerRef: ViewContainerRef) {
        this.rootViewContainer = viewContainerRef;
    }

    addDynamicComponent(comp: Type<any> | string, properties?: {}) {
        let component;
        if (typeof comp === 'string') {
            component = this.getDynamicComponent(comp);
        } else {
            component = comp;
        }
        if (null == component) {
            return;
        }
        const factory = this.factoryResolver
                            .resolveComponentFactory(component);
        const compCreated = factory
        .create(this.rootViewContainer.injector);
        if (properties) {
            for (const key in properties) {
                if (properties.hasOwnProperty(key)) {
                    compCreated.instance[key] = properties[key];
                }
            }
        }
        this.rootViewContainer.insert(compCreated.hostView);
        return compCreated.instance;
    }

    getDynamicComponent(compKey: string) {
        const config = this.config.getConfig();
        if (config && config.customComponents) {
               return config.customComponents[compKey];
            }
        return null;
    }
}

