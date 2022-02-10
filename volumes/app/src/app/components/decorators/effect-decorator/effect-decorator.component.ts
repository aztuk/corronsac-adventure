import {EFFECT_TIMERS, EFFECTS_VALUES} from '../../../sharedScript/resources';
import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'eff-deco',
  templateUrl: './effect-decorator.component.html',
  styleUrls: ['./effect-decorator.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EffectDecoratorComponent implements OnInit {

  @Input() effect: string;
  @Input() withTime;
  @Input() power;
  text;
  time;
  displayTime: boolean = false;

  //@HostBinding('attr.effect') effect: string;

  constructor() {
  }

  ngOnInit(): void {
    if (this.withTime !== undefined) {
      this.displayTime = true;
    }
    switch (this.effect) {
      case 'STUN':
        this.text = 'étourdit';
        this.time = ' pendant ' + EFFECT_TIMERS.STUN + ' tour';
        this.time += (EFFECT_TIMERS.STUN > 1) ? 's' : '';
        break;
      case 'TAUNT':
        this.text = 'provocation';
        this.time = ' pendant ' + EFFECT_TIMERS.TAUNT + ' tour';
        this.time += (EFFECT_TIMERS.TAUNT > 1) ? 's' : '';
        break;
      case 'UP_AP':
        this.text = '+' + EFFECTS_VALUES.UP_AP;
        this.text += ' puissance';
        this.text += (EFFECTS_VALUES.UP_AP > 1) ? 's' : '';
        this.time = ' pendant ' + EFFECT_TIMERS.UP_AP + ' tour';
        this.time += (EFFECT_TIMERS.UP_AP > 1) ? 's' : '';
        break;
      case 'UP_AD':
        this.text = '+' + EFFECTS_VALUES.UP_AD;
        this.text += ' attaque';
        this.text += (EFFECTS_VALUES.UP_AD > 1) ? 's' : '';
        this.time = ' pendant ' + EFFECT_TIMERS.UP_AD + ' tour';
        this.time += (EFFECT_TIMERS.UP_AD > 1) ? 's' : '';
        break;
      case 'UP_CRIT':
        this.text = '+' + EFFECTS_VALUES.UP_CRIT;
        this.text += '% de coups critiques';
        this.time = ' pendant ' + EFFECT_TIMERS.UP_CRIT + ' tour';
        this.time += (EFFECT_TIMERS.UP_CRIT > 1) ? 's' : '';
        break;
      case 'UP_CRIT_DMG':
        this.text = '+' + EFFECTS_VALUES.UP_CRIT_DMG * 100;
        this.text += '% de dégâts aux coups critiques';
        this.time = ' pendant ' + EFFECT_TIMERS.UP_CRIT_DMG + ' tour';
        this.time += (EFFECT_TIMERS.UP_CRIT_DMG > 1) ? 's' : '';
        break;
      case 'UP_DODGE':
        this.text = '+' + EFFECTS_VALUES.UP_DODGE;
        this.text += '% d\'esquive';
        this.time = ' pendant ' + EFFECT_TIMERS.UP_DODGE + ' tour';
        this.time += (EFFECT_TIMERS.UP_DODGE > 1) ? 's' : '';
        break;
      case 'DOWN_DODGE':
        this.text = '-' + EFFECTS_VALUES.DOWN_DODGE;
        this.text += '% d\'esquive';
        this.time = ' pendant ' + EFFECT_TIMERS.DOWN_DODGE + ' tour';
        this.time += (EFFECT_TIMERS.DOWN_DODGE > 1) ? 's' : '';
        break;
      case 'DOWN_AP':
        this.text = '-' + EFFECTS_VALUES.DOWN_AP;
        this.text += ' puissance';
        this.text += (EFFECTS_VALUES.DOWN_AP > 1) ? 's' : '';
        this.time = ' pendant ' + EFFECT_TIMERS.DOWN_AP + ' tour';
        this.time += (EFFECT_TIMERS.DOWN_AP > 1) ? 's' : '';
        break;
      case 'DOWN_AD':
        this.text = '-' + EFFECTS_VALUES.DOWN_AD;
        this.text += ' attaque';
        this.text += (EFFECTS_VALUES.DOWN_AD > 1) ? 's' : '';
        this.time = ' pendant ' + EFFECT_TIMERS.DOWN_AD + ' tour';
        this.time += (EFFECT_TIMERS.DOWN_AD > 1) ? 's' : '';
        break;
      case 'POISON':
        this.text = Math.round(EFFECTS_VALUES.POISON + this.power * 0.2);
        this.text += ' dégâts';
        this.time = ' à chaque tour pendant ' + EFFECT_TIMERS.POISON + ' tour';
        this.time += (EFFECT_TIMERS.POISON > 1) ? 's' : '';
        break;
    }
  }


}
