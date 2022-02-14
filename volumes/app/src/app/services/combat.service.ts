import { Combat } from './../object/system/combat';
import {EEffects, ELevelType} from '../sharedScript/enums';
import {ICombat, IEntityActor, ISpellDescription} from '../sharedScript/interfaces';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {getRandomInArray, getRandomInt} from '../sharedScript/helpers';
import {CharactersService} from './characters.service';
import {EnemiesService} from './enemies.service';
import {SpellCast} from '../object/system/spellCast';
import {Router} from '@angular/router';
import {Actor} from "../object/entities/actor";

@Injectable({
  providedIn: 'root'
})
export class CombatService {

  public actors$: BehaviorSubject<Actor[]> = new BehaviorSubject([]);

  public set actors(value: any) {
    this.actors$.next(value);
  }

  public get actors() {
    return this.actors$.getValue();
  }

  public enemies: Array<IEntityActor> = [];
  public characters: Array<IEntityActor>;

  constructor(private es: EnemiesService, private characterService: CharactersService, private _router: Router) {
    this.characterService.characters$.subscribe((characters) => {
      this.characters = characters;
  });
  }

  resetCombat() {
    this.enemies = [];
    this.actors = [];
  }

  initCombat(level: ICombat) {
    // Redirect if no character picked yet
    if (this.characterService.characters.length === 0) {
      this._router.navigate(['']);
    }

    // Reset initial values
    this.resetCombat();

    // TODO DELETE MOCK COMBAT (TESTING)
    /*const testingCombat = new Combat(0);
    testingCombat.type = ELevelType.COMBAT_TIER_1;
    this.enemies = this.es.generateEnemies(testingCombat);*/

    // Create enemies
    this.enemies = this.es.generateEnemies(level);

    // Normalize actor list (chars + enemis)
    this.actors = this.characters.concat(this.enemies);
  }


  aiTurn(ai: IEntityActor): SpellCast {
    const spells = this.getAiAvailableSpells(ai);
    if(spells.length === 0) {
      console.log('No spells available on cooldown for: ' + ai);
    }
    const spell = spells[getRandomInt(0, spells.length - 1)];

    const potentialSpellTarget = {
      allies: this.getEnemies(),
      enemies: this.getAllies(),
      target: this.getAiTarget()
    }
    spell.timer = spell.cooldown;

    return new SpellCast(ai, potentialSpellTarget, spell);
  }

  getAiAvailableSpells(ai: IEntityActor): ISpellDescription[] {
    let spells = ai.spells.filter((s) => s.timer === 0);
    if (spells.some(s => s.name === 'Attaque') && spells.length > 1) {
      spells.shift();
    }
    return spells;
  }

  getAiTarget(): IEntityActor {
    return getRandomInArray(this.getTauntActors(this.getAliveActors(this.getAllies())));
  }

  getTargetableAi(): IEntityActor[] {
    return this.getTauntActors(this.getAliveActors(this.getEnemies()));
  }

  getTauntActors(actors): IEntityActor[] {
    let tauntActors = actors.filter((a) => a.effects.some((e) => e.effect === EEffects.TAUNT));
    if (tauntActors.length > 0) {
      return tauntActors;
    }
    return actors;
  }

  getAliveActors(actors: IEntityActor[]): IEntityActor[] {
    return actors.filter((a) => !a.health.isDead);
  }

  getAllies(): IEntityActor[] {
    return this.actors.filter((a) => a.possessed);
  }

  getEnemies(): IEntityActor[] {
    return this.actors.filter((a) => !a.possessed);
  }

  isCombatWin(): boolean {
    return this.getAliveActors(this.getEnemies()).length === 0;
  }
}
