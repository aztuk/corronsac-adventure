import {ComponentFactoryResolver, EmbeddedViewRef, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentFactoryService {

  constructor(private resolver: ComponentFactoryResolver) {
  }

  createComponent(container, type, appendBody = true) {
    this.clearContainer(container);
    const factory = this.resolver.resolveComponentFactory(type);
    const result = container.createComponent(factory);

    if (appendBody) {
      this.appendToBody(result);
    }

    return result;
  }

  clearContainer(container) {
    container.clear();
  }

  appendToBody(container) {
    const domElem = (container.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
  }

}
