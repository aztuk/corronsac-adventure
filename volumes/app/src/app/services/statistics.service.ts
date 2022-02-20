import { ESPells } from './../sharedScript/spells-enum';
import { EHero } from './../sharedScript/enums';
import { SpellCast } from './../object/system/spellCast';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ISpellStat{
  spell: string,
  damage: number,
  heal: number,
  invocations: number
}

interface IHeroStat {
  hero: EHero,
  //spellStats: ISpellStat[]
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {


  public spells$: BehaviorSubject<SpellCast[]> = new BehaviorSubject([])

  public set spells(value: any) {
    this.spells$.next(value);
  }

  public get spells() {
    return this.spells$.getValue();
  }

  constructor() { }



  processHeroStats():IHeroStat[] {
    let heroes = this.getHeroes();
    let heroStat: IHeroStat[] = [];

    heroes.forEach(hero => {
      let stat:IHeroStat = {
        hero: hero
      };

      heroStat.push(stat);
    });

    console.log(heroStat);

    return heroStat;
  }

  getHeroes():EHero[] {
    let heroes: EHero[] = [];

    this.spells.forEach(spellCast => {
      if(!heroes.includes(spellCast.caster)) {
        heroes.push(spellCast.caster);
      }
    });

    return heroes;
  }


}
