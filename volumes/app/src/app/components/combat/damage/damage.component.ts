import { EDamageType } from './../../../sharedScript/enums';
import {Heal} from '../../../object/system/heal';
import {EAttackStatus} from '../../../sharedScript/enums';
import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {getRandomInt} from '../../../sharedScript/helpers';

@Component({
  selector: 'civ-damage',
  templateUrl: './damage.component.html',
  styleUrls: ['./damage.component.scss']
})
export class DamageComponent implements OnInit {

  @Input() damage: any;
  @Output() terminate = new EventEmitter();

  public get isHeal() {
    return this.damage instanceof Heal;
  }

  get textDamage() {
    let text = '';

    if (this.damage.status === EAttackStatus.DODGED) {
      text = 'Raté';
    }
    if (this.damage.status === EAttackStatus.CRITICAL) {
      text = '-' + Math.round(this.damage.damage) + ' (critique)';
    }
    if (this.damage.status === EAttackStatus.HIT) {
      text += '-' + Math.round(this.damage.damage);
    }

    if(this.damage.damageType === EDamageType.DOT) {
      text += ' (poison)'
    }

    return text;
  }


  get textHeal() {
    return '+' + Math.round(this.damage.heal);
  }

  constructor(private render: Renderer2, private el: ElementRef) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.render.setStyle(this.el.nativeElement, 'transform', 'translate(' + getRandomInt(-50, 50) + 'px, ' + getRandomInt(-200, -180) + 'px)');
    }, 1);

    setTimeout(() => {
      this.render.setStyle(this.el.nativeElement, 'opacity', 0);
    }, 1000);


    setTimeout(() => {
      this.terminate.emit();
    }, 2000);
  }

}
