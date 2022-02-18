import { Damage } from './../object/system/damage';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ISystemDamage } from '../sharedScript/interfaces';
import { CharactersService } from './characters.service';
import { getRandomInt, objectToArray } from '../sharedScript/helpers';
import { HttpClient } from '@angular/common/http';

interface scoreComponent {
  floorsClimbed: number
  tierOneKilled: number
  tierTwoKilled: number
  tierThreeKilled: number
  damageInflicted: number
  fullStuffCharacters: number
  fullTeam: number
  goldAcquired: number
}

@Injectable({
  providedIn: 'root'
})
export class ScoreService {


  // Singleton
  static instance: ScoreService;
  static getInstance() {
    if (ScoreService.instance) {
      return ScoreService.instance;
    }

    ScoreService.instance = new ScoreService();
    return ScoreService.instance;
  }

  public score$: BehaviorSubject<number> = new BehaviorSubject(0)

  public set scoreTotal(value: any) {
    this.score$.next(value);
  }

  public get scoreTotal() {
    return this.score$.getValue();
  }

  public score:any;

  public scoreValues = {
    floorsClimbed: 5,
    tierOneKilled:  2,
    tierTwoKilled: 20,
    tierThreeKilled:  150,
    death: -30,
    damageInflicted:  50,
    damageReceived:  -30,
    fullStuffCharacters:  50,
    sizeTeam:  40,
    goldAcquired:  25,
    goldSpent:  35,
  }

  public stats$ = {
    floorsClimbed: 0,
    tierOneKilled:  0,
    tierTwoKilled: 0,
    tierThreeKilled:  0,
    death: 0,
    damageInflicted:  0,
    damageReceived:  0,
    fullStuffCharacters:  0,
    sizeTeam:  0,
    goldAcquired:  0,
    goldSpent:  0,
  }


  public stats = new Proxy(this.stats$, {
    get: function(target, name) {
      return target[name];
    },
    set: function(target, name, value) {
      target[name] = Math.round(value);
      ScoreService.getInstance().updateScore();
      return true;
    }
  });

  constructor() {
  }

  updateScore(){
    this.scoreTotal = this.getScore();
  }

  setDamageInflicted(damage: ISystemDamage) {
    if(damage.caster.possessed) {
      this.stats.damageInflicted += damage.damage
    }
    if(!damage.caster.possessed) {
      this.stats.damageReceived += damage.damage
    }
  }

  constructScoreArray() {
    this.score = {};
    this.score.floorsClimbed = this.stats.floorsClimbed * this.scoreValues.floorsClimbed;
    this.score.tierOneKilled=this.stats.tierOneKilled * this.scoreValues.tierOneKilled;
    this.score.tierTwoKilled=this.stats.tierTwoKilled * this.scoreValues.tierTwoKilled;
    this.score.tierThreeKilled=this.stats.tierThreeKilled * this.scoreValues.tierThreeKilled;
    this.score.death=this.stats.death * this.scoreValues.death;
    this.score.damageInflicted=Math.floor(this.stats.damageInflicted / 300 * this.scoreValues.damageInflicted);
    this.score.damageReceived=Math.floor(this.stats.damageReceived / 300 * this.scoreValues.damageReceived);
    this.score.goldAcquired=Math.floor(this.stats.goldAcquired / 200) * this.scoreValues.goldAcquired;
    this.score.goldSpent = Math.floor(this.stats.goldSpent / 150) * this.scoreValues.goldSpent;
    this.score.sizeTeam = (this.stats.sizeTeam === 0) ? 0 : (this.stats.sizeTeam - 1) * this.scoreValues.sizeTeam;
    this.score.fullStuffCharacters = this.stats.fullStuffCharacters * this.scoreValues.fullStuffCharacters;
  }

  public getScore() {
    let score = 0;

    this.constructScoreArray();

    Object.values(this.score).forEach(item => {
      score += Number(item);
    });

    return score;
  }
}
