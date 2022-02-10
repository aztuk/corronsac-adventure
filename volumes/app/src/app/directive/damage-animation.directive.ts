import {EAttackStatus} from '../sharedScript/enums';
import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {ISystemDamage} from "../sharedScript/interfaces";

@Directive({
  selector: '[damageAnimation]'
})
export class DamageAnimationDirective {

  @Input('damageAnimation') id: string;

  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  animateHit(damage: ISystemDamage) {
    let animationClass = '';
    if (damage.caster.possessed) {
      animationClass = 'animation-hit-top';
    } else {
      animationClass = 'animation-hit-bottom';
    }
    this.renderer.addClass(this.el.nativeElement, animationClass);
    setTimeout(() => {
      this.renderer.removeClass(this.el.nativeElement, animationClass);
    }, 500);
  }

  animateHurt(damage: ISystemDamage) {
    if (damage.status !== EAttackStatus.DODGED) {
      this.renderer.addClass(this.el.nativeElement, 'animation-hurt');
      setTimeout(() => {
        this.renderer.removeClass(this.el.nativeElement, 'animation-hurt');
      }, 500);
    }
  }

  animateHealing() {
    this.renderer.addClass(this.el.nativeElement, 'animation-healing');
    setTimeout(() => {
      this.renderer.removeClass(this.el.nativeElement, 'animation-healing');
    }, 500);
  }

  animateHealed() {
    this.renderer.addClass(this.el.nativeElement, 'animation-healed');
    setTimeout(() => {
      this.renderer.removeClass(this.el.nativeElement, 'animation-healed');
    }, 500);
  }

}
