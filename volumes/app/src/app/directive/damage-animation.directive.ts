import { ISystemEffect } from './../sharedScript/interfaces';
import { EDamageType, EEffects } from './../sharedScript/enums';
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

    if(damage.status === EAttackStatus.CRITICAL) {
      this.animateCritique();
    }

  }

  animateCritique() {
    this.renderer.addClass(document.body, 'animation-critical');
    setTimeout(() => {
      this.renderer.removeClass(document.body, 'animation-critical');
    }, 500);
  }

  animateHurt(damage: ISystemDamage) {
    if (damage.status !== EAttackStatus.DODGED) {
      setTimeout(() => {
        this.renderer.addClass(this.el.nativeElement, 'animation-hurt');
        this.renderer.addClass(this.el.nativeElement, this.getSprite(damage.damageType));
        console.log(this.getSprite(damage.damageType))
      },200);
      setTimeout(() => {
        this.renderer.removeClass(this.el.nativeElement, 'animation-hurt');
        this.renderer.removeClass(this.el.nativeElement, this.getSprite(damage.damageType));
      }, 500);
    }
  }

  animateEffect(type:EEffects) {
    let animatedElement = this.renderer.createElement('div');
    this.renderer.addClass(animatedElement, 'animation-effect');

    let effect = this.renderer.createElement('img');
    this.renderer.setAttribute(effect, 'src', '/assets/images/effects/'+ type.toString().toLowerCase() +'@2x.png');

    this.renderer.appendChild(this.el.nativeElement, animatedElement);
    this.renderer.appendChild(animatedElement, effect);

    setTimeout(() => {
      this.renderer.removeChild(this.el.nativeElement, animatedElement);
    }, 1000);
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

  getSprite(input: EDamageType | EEffects) {
    let ouput = '';
    switch(input) {
      case EDamageType.DOT:
        ouput = 'poison';
      break;
      case EDamageType.MAGIC:
        ouput = 'magic';
      break;
      case EDamageType.PHYSIC:
        ouput = 'physic';
      break;
    }

    return ouput;
  }

}
