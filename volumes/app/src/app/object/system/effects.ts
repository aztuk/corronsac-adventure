import {EDamageType, EEffects} from '../../sharedScript/enums';
import {Damage} from './damage';
import {IEntityActor, ISystemDamage, ISystemEffect} from '../../sharedScript/interfaces';
import {EFFECT_TIMERS, EFFECTS_VALUES, STACK_TYPES} from '../../sharedScript/resources';

export class Effects implements ISystemEffect {

  public effect: EEffects;
  public target: IEntityActor;
  public caster: IEntityActor;
  public timer: number;
  public maxTime: number;
  public stackType: string;
  public stacks: number = 1;

  public stackTypeMapping = {
    UP_DODGE: 'DURATION',
    UP_CRIT_DMG: 'DURATION',
    UP_CRIT: 'DURATION',
    POISON: 'INTENSITY',
    UP_AP: 'DURATION',
    DOWN_AP: 'DURATION',
    UP_AD: 'DURATION',
    DOWN_DODGE: 'DURATION',
    DOWN_SPEED: 'DURATION',
    DOWN_AD: 'DURATION'
  }

  constructor(caster: IEntityActor, target: IEntityActor, effect: EEffects) {
    this.effect = effect;
    this.target = target;
    this.caster = caster;
    this.timer = EFFECT_TIMERS[this.effect];
    this.maxTime = this.timer;
    this.stackType = STACK_TYPES[this.effect];

    this.applyEffect();
  }

  applyEffect() {
    this.target.effects.push(this);
  }

  addStack(): void {
    if (this.stackType === 'DURATION') {
      this.timer = this.maxTime;
    }
    if (this.stackType === 'INTENSITY') {
      this.timer += this.maxTime;
      this.stacks++;
    }
  }

  runPoison(): ISystemDamage {
    return new Damage(this.caster, this.target, EDamageType.DOT, this.getPoisonDamage());
  }

  getPoisonDamage() {
    return Math.round((EFFECTS_VALUES.POISON + this.caster.stats.power * this.caster.stats.damageMultiplier * EFFECTS_VALUES.POISON_COEFF) * this.stacks);
  }

  getBuffValue(value) {
    return value * this.stacks;
  }
}
