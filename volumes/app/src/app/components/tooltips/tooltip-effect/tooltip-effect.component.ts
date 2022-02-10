import {ISystemEffect} from '../../../sharedScript/interfaces';
import {EEffects} from '../../../sharedScript/enums';
import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {EFFECTS_VALUES} from '../../../sharedScript/resources';

@Component({
  selector: 'civ-tooltip-effect',
  templateUrl: './tooltip-effect.component.html',
  styleUrls: ['./tooltip-effect.component.scss']
})
export class TooltipEffectComponent implements OnInit {

  @Input() entity: ISystemEffect;
  @HostBinding('class.tooltip') isTooltip = true;

  public get description() {
    switch (this.entity.effect) {
      case EEffects.POISON:
        return `Inflige ${this.entity.getPoisonDamage()} dégâts au prochain tour`;
      case EEffects.UP_DODGE:
        return `Augmente l'esquive de ${this.entity.getBuffValue(EFFECTS_VALUES.UP_DODGE)}%`;
      case EEffects.DOWN_DODGE:
        return `Réduit l'esquive de ${this.entity.getBuffValue(EFFECTS_VALUES.DOWN_DODGE)}%`;
      case EEffects.UP_CRIT_DMG:
        return `Augmente les dégats critiques de ${this.entity.getBuffValue(EFFECTS_VALUES.UP_CRIT_DMG) * 100}%`;
      case EEffects.UP_CRIT:
        return `Augmente les chances de coups critiques de ${this.entity.getBuffValue(EFFECTS_VALUES.UP_CRIT)}%`;
      case EEffects.STUN:
        return `Ne peut pas attaquer.`;
      case EEffects.TAUNT:
        return `Redirige les attaques vers le personnage`;
      case EEffects.UP_AP:
        return `Augmente la puissance ${this.entity.getBuffValue(EFFECTS_VALUES.UP_AP)}`;
      case EEffects.UP_AD:
        return `Augmente l'attaque ${this.entity.getBuffValue(EFFECTS_VALUES.UP_AD)}`;
      case EEffects.DOWN_AP:
        return `Réduit la puissance ${this.entity.getBuffValue(EFFECTS_VALUES.DOWN_AP)}`;
      case EEffects.DOWN_AD:
        return `Réduit l'attaque ${this.entity.getBuffValue(EFFECTS_VALUES.DOWN_AD)}`;
    }
  }

  constructor() {
  }

  ngOnInit(): void {
  }

}
