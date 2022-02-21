import { SpellDescription } from './../object/components/spell-description';
import { ESPells } from './../sharedScript/spells-enum';
import { Heal } from './../object/system/heal';
import { EAttackStatus, EHero, EEffects, EDamageType } from './../sharedScript/enums';
import { IEntityActor } from './../sharedScript/interfaces';
import { SpellCast } from './../object/system/spellCast';
import { Injectable } from '@angular/core';
import { exists, getRandomInArray } from '../sharedScript/helpers';
import { Damage } from '../object/system/damage';

@Injectable({
  providedIn: 'root'
})
export class PassiveService {

  public costyHealIncrement: number = 0;
  public costyTotalBonus: number = 0;
  public costyHealThreshold: number = 10;
  public kevinPassiveCurrentPoisonned: number  = 0;
  public kevinPassiveDamageIncrement: number  = 0.2;
  public clementPassiveProcThreshold: number  = 0.2;
  public adrienBlackPantherPassive: number = 0;

  constructor() { }

  getPassiveDescription(hero:IEntityActor): string {
    let description:string;
    switch(hero.name) {
      case EHero.ADRIEN:
        description = `Adrien emmagazine les dégâts qu'il subit pour les renvoyer à sa prochaine attaque. (Bonus dégâts: ${Math.round(this.adrienBlackPantherPassive)})`;
      break;
      case EHero.CLEMENT:
        description = `Clément gagne <eff-deco effect="TAUNT" with-time></eff-deco> à chaque fois qu'un allié passe sous la barre des ${this.clementPassiveProcThreshold * 100}% PV.`;
      break;
      case EHero.COSTY:
        description = `Tous les  ${this.costyHealThreshold} PV soignés, Costy augmente ses points de vie maximum de 1. (Bonus PV: ${this.costyTotalBonus})`;
      break;
      case EHero.KEVIN:
        description = `Kevin gagne  ${this.kevinPassiveDamageIncrement * 100}% de dégâts supplémentaire par ennemis empoisonnés. (Bonus dégats: ${this.kevinPassiveCurrentPoisonned * this.kevinPassiveDamageIncrement * 100}%)`;
      break;
      case EHero.LOIC:
        description = `Loïc réduit tous ses temps de récupération de 1 tour à chaque fois qu'il réussi un coup critique.`;
      break;
      case EHero.QUENTIN:
        description = `Si Quentin réussi un coup fatal sur une cible, il lance Smart Life sur une nouvelle cible.`;
      break;
    }

    return description
  }

  runPassives(cast: SpellCast): SpellCast[] {
    let newSpellCasts: SpellCast[] = [];

    const adrienPassive = this.checkAdrienPassive(cast);
    if(adrienPassive !== null) {
      newSpellCasts.push(adrienPassive);
    }

    const clementPassive = this.checkClementPassive(cast);
    if(clementPassive !== null) {
      newSpellCasts.push(clementPassive);
    }

    const quentinPassive = this.checkQuentinPassive(cast);
    if(quentinPassive !== null) {
      newSpellCasts.push(quentinPassive);
    }

    this.checkCostyPassive(cast);
    this.checkLoicPassive(cast);
    this.checkKevinPassive(cast);


    return newSpellCasts;
  }

  checkLoicPassive(cast: SpellCast) {
    if(cast._caster.name === EHero.LOIC) {
      if(cast.damages.some(d => d.status == EAttackStatus.CRITICAL)) {
        cast._caster.spellTimers();
      }
    }
  }

  checkQuentinPassive(cast: SpellCast): SpellCast  {
    let spell = null;

    if(cast._caster.name === EHero.QUENTIN) {
      cast.damages.forEach(d => {
        if(d.target.health.isDead) {
          const aliveEnemies = cast._combatActors.enemies.filter(e => e.id !== d.target.id && !e.isDead);
          if(aliveEnemies.length > 0) {
            cast._combatActors.enemies = aliveEnemies;
            spell = new SpellCast(cast._caster, cast._combatActors, new SpellDescription(ESPells.SMART_LIFE));
          }
        }
      });
    }

    return spell;
  }

  checkCostyPassive(cast: SpellCast) {
    if(cast._caster.name === EHero.COSTY && cast.heals.length > 0) {
      let increment = cast.heals.reduce((p, c) => { return p + c.heal; }, 0);
      this.costyHealIncrement += increment;
      if(this.costyHealIncrement >= this.costyHealThreshold){
        this.costyHealIncrement -= this.costyHealThreshold;
        this.costyTotalBonus++;
        cast._caster.health.max++;
        cast._caster.health.heal(1);
      }
    }
  }

  checkKevinPassive(cast: SpellCast) {
    const actors = cast._combatActors.allies.concat(...cast._combatActors.enemies);
    const kevin = actors.find(a => a.name === EHero.KEVIN);

    if(exists(kevin)) {
      this.kevinPassiveCurrentPoisonned = 0;

      actors.forEach(a => {
        if(a.effects.some(e => e.effect === EEffects.POISON)) {
          this.kevinPassiveCurrentPoisonned++;
        }
      });

      kevin.stats$.damageMultiplier = 1 + this.kevinPassiveCurrentPoisonned * this.kevinPassiveDamageIncrement;
    }
  }

  checkClementPassive(cast: SpellCast): SpellCast {
    let spell = null;
    const actors = cast._combatActors.allies.concat(...cast._combatActors.enemies);

    const clement = actors.find(a => a.name === EHero.CLEMENT);
    if(exists(clement)) {
        cast.damages.forEach(d => {
          const previousHealthPerc = (d.damage + d.target.health.current)  / d.target.health.max;
          const newHealthPerc = d.target.health.current / d.target.health.max;

          if(d.target.possessed && previousHealthPerc >= this.clementPassiveProcThreshold && newHealthPerc <= this.clementPassiveProcThreshold) {
            spell = new SpellCast(clement, cast._combatActors, new SpellDescription(ESPells.CLEMENT_PASSIVE_PROC));
          }
        });
    }

    return spell;
  }

  checkAdrienPassive(cast: SpellCast): SpellCast {
    let spell = null;

    cast.damages.forEach(d => {
      if(d.target.name === EHero.ADRIEN) {
        this.adrienBlackPantherPassive += d.damage;
      }
    });

    if(cast._caster.name === EHero.ADRIEN &&  this.adrienBlackPantherPassive > 0) {
      const aliveEnemies = cast._combatActors.enemies.filter(e => !e.isDead);
      cast._combatActors.enemies = aliveEnemies;
      if(aliveEnemies.length > 0) {
        if(cast._combatActors.target.health.isDead) {
          cast._combatActors.target = getRandomInArray(aliveEnemies);
        }

        spell = new SpellCast(cast._caster, cast._combatActors, new SpellDescription(ESPells.ADRIEN_PASSIVE_PROC));
        spell.damages.push(new Damage(cast._caster, cast._combatActors.target, EDamageType.PHYSIC, this.adrienBlackPantherPassive));
        this.adrienBlackPantherPassive = 0;
      }
    }


    return spell;
  }
}
