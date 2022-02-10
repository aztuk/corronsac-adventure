import { ESPells } from './../../sharedScript/spells-enum';
import { IEquipmentDescription } from './../../sharedScript/interfaces';
import {Stats} from '../components/stats';
import {AbstractEntity} from './abstract-entity';
import {
  IComponentHealth,
  IComponentShield,
  IComponentStats,
  IEntityActor,
  ISpellDescription, ISystemDamage,
  ISystemEffect
} from '../../sharedScript/interfaces';
import {EClass, EEffects} from '../../sharedScript/enums';
import {EFFECTS_VALUES} from '../../sharedScript/resources';
import {Damage} from "../system/damage";

export class Actor extends AbstractEntity implements IEntityActor {

  name: string;
  specialty: EClass;
  possessed: boolean = false;
  health: IComponentHealth;
  buffs: IComponentStats;
  shield: IComponentShield;
  stats$: IComponentStats;
  effects: ISystemEffect[] = [];
  spells: ISpellDescription[] = [];
  equipment: IEquipmentDescription[] = [];

  constructor(name: string, specialty: EClass, possessed?: boolean) {
    super();
    this.name = name;
    this.specialty = specialty;
    this.possessed = possessed;
    this.buffs = new Stats(0, 0, 0);
  }

  // TODO : Optimize ? Maybe get the getBuffs function out of here and make it a setBuffs() called upon applying effects and unlocking new equipment
  get stats() {
    let stats = Object.assign({}, this.stats$);
    const buffs = this.getBuffs();
    const $this = this;

    Object.keys(stats).map(function(key, index) {
      stats[key] += buffs[key];
      stats[key] = $this.trimStat(stats[key]);
    });

    return stats;
  }

  getBuffs() {
    let buffs: any = {};

    let dodgeUpEffect = this.getBuff(EEffects.UP_DODGE)?.getBuffValue(EFFECTS_VALUES.UP_DODGE) || 0;
    let dodgeDownEffect = this.getBuff(EEffects.DOWN_DODGE)?.getBuffValue(EFFECTS_VALUES.DOWN_DODGE) || 0;
    let critDmgEffect = this.getBuff(EEffects.UP_CRIT_DMG)?.getBuffValue(EFFECTS_VALUES.UP_CRIT_DMG) || 0;
    let critEffect = this.getBuff(EEffects.UP_CRIT)?.getBuffValue(EFFECTS_VALUES.UP_CRIT) || 0;
    let powerUpEffect = this.getBuff(EEffects.UP_AP)?.getBuffValue(EFFECTS_VALUES.UP_AP) || 0;
    let powerDownEffect = this.getBuff(EEffects.DOWN_AP)?.getBuffValue(EFFECTS_VALUES.DOWN_AP) || 0;
    let attackUpEffect = this.getBuff(EEffects.UP_AD)?.getBuffValue(EFFECTS_VALUES.UP_AD) || 0;
    let attackDownEffect = this.getBuff(EEffects.DOWN_AD)?.getBuffValue(EFFECTS_VALUES.DOWN_AD) || 0;

    buffs.dodge = dodgeUpEffect - dodgeDownEffect;
    buffs.criticalDamage = critDmgEffect;
    buffs.critical = critEffect;
    buffs.power = powerUpEffect - powerDownEffect;
    buffs.attack = attackUpEffect - attackDownEffect;
    buffs.touch = 0;
    buffs.speed = 0;

    const equipment =  this.equipment.filter(e => e.unlocked);
    Object.keys(buffs).map(function(key, index) {
      equipment.forEach((e) => {
        buffs[key] += e.stats[key];
      });
    });

    this.buffs = buffs;

    return buffs;
  }

  trimStat(value:number) {
    if(value < 0) {
      return 0;
    } else {
      return value;
    }
  }

  hasSpell(spell: ESPells): boolean {
    return this.spells.find(s => s.name === spell.name).unlocked
  }

  getBuff(effect): ISystemEffect {
    return this.effects.find((e) => e.effect === effect);
  }

  isIncapacitated(): boolean {
    return this.effects.some((e) => e.effect === EEffects.STUN);
  }

  runDots(): ISystemDamage[] {
    let dots = [];
    this.effects.filter((e) => {
      return e.effect === EEffects.POISON
    }).forEach((e) => dots.push(e.runPoison()));
    return dots;
  }

  public runCooldowns() {
    this.spellTimers();
    this.effectTimers();
  }

  private spellTimers() {
    this.spells.forEach((s) => {
      s.timer--;
      if (s.timer <= 0) {
        s.timer = 0;
      }
    });
  }

  private effectTimers() {
    let index = this.effects.length - 1;

    while (index >= 0) {
      this.effects[index].timer--;
      if (this.effects[index].timer <= 0) {
        this.effects.splice(index, 1)
      }
      index--;
    }
  }
}
