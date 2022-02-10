import {DamageComponent} from '../components/combat/damage/damage.component';
import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  Input,
  OnInit,
  Renderer2,
  ViewContainerRef
} from '@angular/core';

@Directive({
  selector: '[damageDisplay]'
})
export class DamageDisplayDirective implements OnInit {

  @Input('damageDisplay') id: string;


  constructor(private container: ViewContainerRef, private renderer: Renderer2, private el: ElementRef, private resolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
  }

  displayDamage(damage: this) {
    const factory = this.resolver.resolveComponentFactory(DamageComponent);
    const damageComponent: ComponentRef<DamageComponent> = this.container.createComponent(factory);
    damageComponent.instance.damage = damage;
    damageComponent.instance.terminate.subscribe(() => damageComponent.destroy());

    const domElem = (damageComponent.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    this.renderer.appendChild(this.el.nativeElement, domElem);
  }

}
