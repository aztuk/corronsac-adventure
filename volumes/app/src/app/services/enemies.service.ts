import { ICombat } from './../sharedScript/interfaces';
import {EClass, ELevelType} from '../sharedScript/enums';
import {IEntityActor} from '../sharedScript/interfaces';
import {Stats} from '../object/components/stats';
import {Health} from '../object/components/health';
import {Actor} from '../object/entities/actor';
import {Injectable} from '@angular/core';
import {SpellDescription} from '../object/components/spell-description';
import {ESPells} from '../sharedScript/spells-enum';
import {getRandomInArray} from '../sharedScript/helpers';

@Injectable({
  providedIn: 'root'
})
export class EnemiesService {

  public enemyBucketTierOne = [
    () => {
      return [this.createPatron(), this.createRacaille()]
    },
    () => {
      return [this.createRacaille(), this.createRacaille()]
    },
    () => {
      return [this.createVieilleConnaissance(), this.createRacaille()]
    },
    () => {
      return [this.createPetitBonhomme(), this.createKaren()]
    },
    () => {
      return [this.createEnfants(), this.createVieilleConnaissance(), this.createEnfants()]
    },
    () => {
      return [this.createVaccin(), this.createCovid()]
    },
    () => {
      return [this.createPetitBonhomme(), this.createKaren()]
    },
    () => {
      return [this.createPatron(), this.createPetitBonhomme(), this.createPatron()]
    },
    () => {
      return [this.createPatron(), this.createVaccin(), this.createVaccin()]
    },
    () => {
      return [this.createRacaille(), this.createWhisky(), this.createRacaille()]
    },
    () => {
      return [this.createPatron(), this.createVieilleConnaissance(), this.createVieilleConnaissance()]
    },
    () => {
      return [this.createKaren(), this.createVieilleConnaissance(), this.createEnfants(), this.createEnfants()]
    },
    () => {
      return [this.createRacaille(), this.createRacaille(), this.createWhisky(), this.createRacaille(), this.createRacaille()]
    },
    () => {
      return [this.createEnfants(),this.createEnfants(),this.createEnfants(),this.createEnfants(),this.createEnfants()]
    },
    () => {
      return [this.createWhisky(),this.createWhisky(),this.createPetitBonhomme(),this.createPetitBonhomme()]
    },
    () => {
      return [this.createVieilleConnaissance(),this.createVieilleConnaissance(), this.createPatron(),this.createVieilleConnaissance(),this.createVieilleConnaissance(),this.createVieilleConnaissance()]
    },
    () => {
      return [this.createKaren(), this.createKaren(), this.createKaren(), this.createEnfants(), this.createEnfants(), this.createEnfants()]
    }
  ]

  public enemyBucketTierTwo = [
    () => {
      return [this.createCovid(), this.createVirginie(), this.createCovid()]
    },
    () => {
      return [this.createVieilleConnaissance(), this.createSandie(), this.createVieilleConnaissance()]
    },
    () => {
      return [this.createPetitBonhomme(), this.createMilou(), this.createRacaille()]
    },
    () => {
      return [this.createAlberge(), this.createEnfants(), this.createEnfants()]
    },
    () => {
      return [this.createPatron(), this.createIvoirien(), this.createKaren()]
    },
    () => {
      return [this.createVaccin(), this.createMarie(), this.createCovid()]
    },
  ];

  public level: ICombat;
  public coeff: number = 0.35;

  constructor() {
  }

  generateEnemies(level): IEntityActor[] {
    let enemies;
    this.level = level;

    if (level.type === ELevelType.COMBAT_TIER_1) {
      const bucket = this.enemyBucketTierOne;
      const min = (level.floor - 2 < 0) ? 0 : level.floor - 2;
      const max = (level.floor + 2 > bucket.length) ? bucket.length : level.floor + 2;
      enemies = getRandomInArray(bucket, min, max)();
    } else if (level.type === ELevelType.COMBAT_TIER_2) {
      let f = getRandomInArray(this.enemyBucketTierTwo);
      enemies = f();
    } else if (level.type === ELevelType.COMBAT_TIER_3)  {
      enemies = [this.createFrancis()];
    }

    return enemies;
  }

  private applyBaseStats(enemy, base) {
    const health = Math.round(base.health + base.health * this.level.floor * this.coeff)
    enemy.health = new Health(health);

    const attack = Math.round(base.attack + base.attack * this.level.floor * this.coeff);
    const power = Math.round(base.power + base.power * this.level.floor * this.coeff);
    enemy.stats$ = new Stats(attack, power, base.speed);
  }

  createRacaille() {
    let enemy = new Actor('Petite racaille', EClass.TIER_1, false);

    this.applyBaseStats(enemy, { health: 12, attack: 1, power: 0, speed: 45});

    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.INSULTE));

    return enemy;
  }

  createPatron() {
    let enemy = new Actor('Patron lourd', EClass.TIER_1, false);

    this.applyBaseStats(enemy, { health: 12, attack: 2, power: 0, speed: 45});

    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.HEURES_SUPP));

    return enemy;
  }

  createVieilleConnaissance() {
    let enemy = new Actor('Vieille connaissance', EClass.TIER_1, false);

    this.applyBaseStats(enemy, { health: 13, attack: 2, power: 0, speed: 45});

    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.REPROCHE));

    return enemy;
  }


  createPetitBonhomme() {
    let enemy = new Actor('Petit Bonhomme', EClass.TIER_1, false);

    this.applyBaseStats(enemy, { health: 18, attack: 2, power: 0, speed: 39});

    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.POLICE));
    enemy.spells.push(new SpellDescription(ESPells.POELE));

    return enemy;
  }

  createWhisky() {
    let enemy = new Actor('Bouteille de whisky', EClass.TIER_1, false);

    this.applyBaseStats(enemy, { health: 60, attack: 1, power: 0, speed: 39});

    enemy.spells.push(new SpellDescription(ESPells.APPEL_IRRESISTIBLE));
    enemy.spells.push(new SpellDescription(ESPells.APERO_MINUTE));

    return enemy;
  }

  createVaccin() {
    let enemy = new Actor('Vaccin', EClass.TIER_1, false);

    this.applyBaseStats(enemy, { health: 25, attack: 2, power: 0, speed: 40});

    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.INJECTION));

    return enemy;
  }

  createCovid() {
    let enemy = new Actor('Covid', EClass.TIER_1, false);

    this.applyBaseStats(enemy, { health: 22, attack: 2, power: 3, speed: 38});

    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.DELTA));

    return enemy;
  }

  createEnfants() {
    let enemy = new Actor('Enfant', EClass.TIER_1, false);

    this.applyBaseStats(enemy, { health: 15, attack: 1, power: 0, speed: 28});

    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.CRIS));

    return enemy;
  }


  createKaren() {
    let enemy = new Actor('Karen', EClass.TIER_1, false);

    this.applyBaseStats(enemy, { health: 30, attack: 3, power: 0, speed: 36});

    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.MANAGER));

    return enemy;
  }


  // TIER 2
  createVirginie() {
    let enemy = new Actor('Virginie', EClass.TIER_2, false);

    this.applyBaseStats(enemy, { health: 95, attack: 3, power: 0, speed: 33});

    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.MOBY_DICK));
    enemy.spells.push(new SpellDescription(ESPells.HAMBURGER));

    return enemy;
  }

  createSandie() {
    let enemy = new Actor('Sandie', EClass.TIER_2, false);

    this.applyBaseStats(enemy, { health: 90, attack: 3, power: 0, speed: 32});

    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.INTERDICTION_SORTIE));
    enemy.spells.push(new SpellDescription(ESPells.TROMPERIE));

    return enemy;
  }

  createIvoirien() {
    let enemy = new Actor('Ivoirien', EClass.TIER_2, false);

    this.applyBaseStats(enemy, { health: 80, attack: 3, power: 0, speed: 28});

    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.FAKE_PHOTO));
    enemy.spells.push(new SpellDescription(ESPells.SMILEY_COEUR));

    return enemy;
  }

  createMilou() {
    let enemy = new Actor('Milou', EClass.TIER_2, false);

    this.applyBaseStats(enemy, { health: 65, attack: 2, power: 0, speed: 34});

    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.CLONE));
    enemy.spells.push(new SpellDescription(ESPells.PROTECTION));

    return enemy;
  }

  createMarie() {
    let enemy = new Actor('Marie', EClass.TIER_2, false);

    this.applyBaseStats(enemy, { health: 87, attack: 3, power: 0, speed: 31});

    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.SEX_ADDICT));
    enemy.spells.push(new SpellDescription(ESPells.MYTHO));

    return enemy;
  }

  createAlberge() {
    let enemy = new Actor('Mme Alberge', EClass.TIER_2, false);

    this.applyBaseStats(enemy, { health: 100, attack: 2, power: 0, speed: 42});

    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.CHEVEUX));
    enemy.spells.push(new SpellDescription(ESPells.CARTABLE_VIDE));

    return enemy;
  }


  createFrancis() {
    let enemy = new Actor('Francis Lalane', EClass.TIER_3, false);
    enemy.health = new Health(1200);
    enemy.stats$ = new Stats(25, 0, 33);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.COURSE_TRACTEUR));
    enemy.spells.push(new SpellDescription(ESPells.GAME_OF_THRONES));

    return enemy;
  }


}
