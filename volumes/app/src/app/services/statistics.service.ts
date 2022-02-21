import { SpellDescription } from './../object/components/spell-description';
import { IEntityActor, ISpellDescription, ISystemDamage } from './../sharedScript/interfaces';
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


  public dots$: BehaviorSubject<ISystemDamage[]> = new BehaviorSubject([])

  public set dots(value: any) {
    this.dots$.next(value);
  }

  public get dots() {
    return this.dots$.getValue();
  }


  constructor() { }



  processHeroStats(heroes: IEntityActor[]):IHeroStat[] {
    let heroStat: IHeroStat[] = [];

    heroes.forEach(hero => {
      const name = hero.name;
      let spellStats: ISpellStat[] = [];

      this.getAllSpellCastFrom(hero.name).forEach(spell => {
        spellStats.push(this.getSpellStats(name, spell));
      });
      spellStats.push(this.getPoisonDamages(hero));

      heroStat.push({hero: name, spellStats:spellStats})
    });

    return heroStat;
  }

  getPoisonDamages(hero: IEntityActor): ISpellStat {
    const heroDots = this.dots.filter(d => d.caster.name === hero.name);

    return {
      spell: 'Poison',
      damage: Math.round(this.sumProperties(heroDots, 'damage')),
      heal: 0
    }
  }

  getSpellStats(hero:string, spell:string):ISpellStat{
    let totalDamages = 0, totalHeals = 0;
    this.getHeroSpellsOfName(hero, spell).forEach(spell => {
      totalDamages += this.sumProperties(spell.damages, 'damage');
      totalHeals += this.sumProperties(spell.heals, 'heal');
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
