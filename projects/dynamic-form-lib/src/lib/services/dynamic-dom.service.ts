import {
    ComponentFactoryResolver,
    Injectable,
    Type,
    ViewContainerRef
} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DynamicDomService {

    rootViewContainer: ViewContainerRef;

    constructor(private factoryResolver: ComponentFactoryResolver) {
    }

    setRootViewContainerRef(viewContainerRef: ViewContainerRef) {
        this.rootViewContainer = viewContainerRef;
    }

    addDynamicComponent(component: Type<{}>, properties?: {}) {
        const factory = this.factoryResolver
                            .resolveComponentFactory(component);
        const comp = factory
        .create(this.rootViewContainer.parentInjector);
        if (properties) {
            for (const key in properties) {
                if (properties.hasOwnProperty(key)) {
                    comp.instance[key] = properties[key];
                }
            }
        }
        this.rootViewContainer.insert(comp.hostView);
    }
}
