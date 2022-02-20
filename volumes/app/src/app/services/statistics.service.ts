import { SpellDescription } from './../object/components/spell-description';
import { IEntityActor, ISpellDescription } from './../sharedScript/interfaces';
import { ESPells } from './../sharedScript/spells-enum';
import { EHero } from './../sharedScript/enums';
import { SpellCast } from './../object/system/spellCast';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ISpellStat{
  spell: string,
  damage: number,
  heal: number
}

interface IHeroStat {
  hero: string,
  spellStats: ISpellStat[]
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



  processHeroStats(heroes: IEntityActor[]):IHeroStat[] {
    let heroStat: IHeroStat[] = [];

    heroes.forEach(hero => {
      const name = hero.name;
      let spellStats: ISpellStat[] = [];

      this.getAllSpellCastFrom(hero.name).forEach(spell => { //hero.spells to change to detected in this.spells
        spellStats.push(this.getSpellStats(name, spell));
      });

      heroStat.push({hero: name, spellStats:spellStats})
    });

    return heroStat;
  }

  getSpellStats(hero:string, spell:string):ISpellStat{
    let totalDamages = 0, totalHeals = 0;
    this.getHeroSpellsOfName(hero, spell).forEach(spell => {
      totalDamages += this.sumProperties(spell.damages, 'damage');
      totalDamages += this.sumProperties(spell.heals, 'heal');
    });

    let spellStat:ISpellStat = {
      spell: spell,
      damage: Math.round(totalDamages),
      heal: Math.round(totalHeals),
    };

    return spellStat;
  }

  sumProperties(array, property):number {
    return array.reduce((p, c) => { return p + c[property]; }, 0);
  }

  getHeroSpellsOfName(hero:string, name:string):SpellCast[] {
   return this.spells.filter(s => s.spellDescription.name === name && s._caster.name === hero);
  }

  getAllSpellCastFrom(hero: string):string[] {
    let spells = [];

    this.spells.forEach(spell => {
      if(spell._caster.name === hero && !spells.includes(spell.spellDescription.name)) {
        spells.push(spell.spellDescription.name);
      }
    });

    return spells;
  }


}
