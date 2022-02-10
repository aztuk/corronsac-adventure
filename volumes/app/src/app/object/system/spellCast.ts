import { EnemiesService } from './../../services/enemies.service';
import {Actor} from '../entities/actor';
import {Heal} from './heal';
import {Effects} from './effects';
import {IEntityActor, ISpellDescription, ISystemEffect, ISystemHeal} from '../../sharedScript/interfaces';
import {EAttackStatus, EDamageType, EEffects, ETargetTypes} from '../../sharedScript/enums';
import {Damage} from './damage';
import {exists, getRandomElementsInArray} from '../../sharedScript/helpers';

interface damageInstance {
  targetsType: ETargetTypes | IEntityActor;
  damageType: EDamageType;
  amount: number;
  targetsAmount?: number;

  condition?($this: SpellCast)

  onMissed?($this: SpellCast, damage: Damage)

  onHit?($this: SpellCast, damage: Damage)
}

type damageInstances = damageInstance[];

interface effectInstance {
  targetsType: ETargetTypes | IEntityActor;
  effect: EEffects;
  targetsAmount?: number;

  condition?($this: SpellCast)
}

type effectInstances = effectInstance[];

export class SpellCast {

  private _caster: IEntityActor;
  private _combatActors: any;
  public damages: Damage[] = [];
  public effects: ISystemEffect[] = [];
  public heals: ISystemHeal[] = [];
  public invocations: IEntityActor[] = [];
  public spellDescription: ISpellDescription;
  public targets: IEntityActor[];

  constructor(_caster: IEntityActor, _combatActors: any, spell: ISpellDescription) {
    this._caster = _caster;
    this._combatActors = _combatActors;
    this.spellDescription = spell;
    this.createDamageInstances(spell.damageInstances);
    this.createEffectInstances(spell.effectInstances);
    this.createHealInstances(spell.healInstances);
    this.invocations = spell.invocation ? spell.invocation(this) : [];
    if (exists(spell.onSpellCast)) {
      spell.onSpellCast(this);
    }
    this.resetSpellCooldown(spell);
  }

  public resetSpellCooldown(spell) {
    spell.timer = spell.cooldown + 1;
  }


  public createHealInstances(instances) {
    if(instances === null){
      return false;
    }
    instances.forEach((heal) => {
      this.targets = this.getTargets(heal.targetsType, heal.targetsAmount);

      this.targets.forEach((target) => {
        if (heal.condition === undefined || heal.condition(this)) {
          this.heals.push(new Heal(this._caster, target, heal.amount));
        }
      });
    });
  }

  public createEffectInstances(instances: effectInstances) {
    if(instances === null ){
      return false;
    }
    instances.forEach((effectDescription) => {
      this.targets = this.getTargets(effectDescription.targetsType, effectDescription.targetsAmount);

      this.targets.forEach((target) => {
        if (effectDescription.condition === undefined || effectDescription.condition(this)) {
          // Check if effect already exist
          const existingEffect = this.getExistingEffect(target, effectDescription.effect);
          if (existingEffect === undefined) {
            this.effects.push(new Effects(this._caster, target, effectDescription.effect));
          } else {
            existingEffect.addStack();
          }
        }
      });
    });
  }

  public createDamageInstances(instances: damageInstances) {
    if(instances === null){
      return false;
    }
    instances.forEach((damageDescription) => {
      this.targets = this.getTargets(damageDescription.targetsType, damageDescription.targetsAmount);
      const damage = this.getDamageAmount(damageDescription.damageType, damageDescription.amount);

      this.targets.forEach((target) => {
        const damageInstance = new Damage(this._caster, target, damageDescription.damageType, damage);
        if (damageDescription.condition === undefined) {
          this.damages.push(damageInstance);
        } else if (damageDescription.condition(this)) {
          this.damages.push(damageInstance);
        }
        if (exists(damageDescription.onMissed) && damageInstance.status === EAttackStatus.DODGED) {
          damageDescription.onMissed(this, damageInstance);
        }
        if (exists(damageDescription.onHit) && damageInstance.status === EAttackStatus.HIT) {
          damageDescription.onHit(this, damageInstance);
        }
      });
    });
  }

  public getTargets(targetsType, amount?) {
    if (targetsType instanceof Actor) {
      return [targetsType];
    }

    switch (targetsType) {
      case ETargetTypes.TARGET:
        return [this._combatActors.target];
      case ETargetTypes.SELF:
        return [this._caster];
      case ETargetTypes.ALL_ALLIES:
        return this._combatActors.allies;
      case ETargetTypes.ALL_ENEMIES:
        return this._combatActors.enemies;
      case ETargetTypes.RANDOM_ALLY:
        if (this._combatActors.allies.length < amount) {
          amount = this._combatActors.allies.length;
        }
        return getRandomElementsInArray(this._combatActors.allies, amount);
      case ETargetTypes.RANDOM_ENEMY:
        if (this._combatActors.enemies.length < amount) {
          amount = this._combatActors.enemies.length;
        }
        return getRandomElementsInArray(this._combatActors.enemies, amount);
      default:
        return [this._combatActors.target];
    }
  }

  public getExistingEffect(target: IEntityActor, effect: EEffects) {
    return target.effects.find((e) => e.effect === effect);
  }

  public getDamageAmount(type: EDamageType, amount: number) {
    if (type === EDamageType.PHYSIC) {
      return this._caster.stats.attack * amount;
    }
    if (type === EDamageType.MAGIC) {
      return this._caster.stats.power * amount;
    }
  }
}
