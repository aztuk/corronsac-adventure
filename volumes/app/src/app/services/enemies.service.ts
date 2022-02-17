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
      return [this.createPatron()]
    },
    () => {
      return [this.createRacaille()]
    },
    () => {
      return [this.createVieilleConnaissance()]
    },
    () => {
      return [this.createPetitBonhomme(), this.createKaren()]
    },
    () => {
      return [this.createVaccin(), this.createCovid()]
    },
    () => {
      return [this.createPatron(), this.createPetitBonhomme(), this.createPatron()]
    },
    () => {
      return [this.createRacaille(), this.createWhisky(), this.createRacaille()]
    },
    () => {
      return [this.createEnfants(), this.createVieilleConnaissance(), this.createEnfants()]
    },
    () => {
      return [this.createKaren(), this.createVieilleConnaissance(), this.createEnfants(), this.createEnfants()]
    },
    () => {
      return [this.createKaren(), this.createVieilleConnaissance(), this.createVaccin(), this.createPatron()]
    },
    () => {
      return [this.createCovid(), this.createPetitBonhomme(), this.createCovid(), this.createCovid()]
    },
    () => {
      return [this.createWhisky(), this.createPatron(), this.createVaccin(), this.createCovid()]
    },
    () => {
      return [this.createPetitBonhomme(), this.createEnfants(), this.createVaccin(), this.createRacaille()]
    },
    () => {
      return [this.createVirginie()]
    },
    () => {
      return [this.createSandie()]
    },
    () => {
      return [this.createMilou()]
    },
    () => {
      return [this.createAlberge()]
    },
    () => {
      return [this.createIvoirien()]
    },
    () => {
      return [this.createMarie()]
    },
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
  ]

  constructor() {
  }

  generateEnemies(level): IEntityActor[] {
    let enemies;

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

  createRacaille() {
    let enemy = new Actor('Petite racaille', EClass.TIER_1, false);
    enemy.health = new Health(24);
    enemy.stats$ = new Stats(4, 0, 48);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.INSULTE));

    return enemy;
  }

  createPatron() {
    let enemy = new Actor('Patron lourd', EClass.TIER_1, false);
    enemy.health = new Health(24);
    enemy.stats$ = new Stats(4, 0, 48);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.HEURES_SUPP));

    return enemy;
  }

  createVieilleConnaissance() {
    let enemy = new Actor('Vieille connaissance', EClass.TIER_1, false);
    enemy.health = new Health(29);
    enemy.stats$ = new Stats(4, 0, 48);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.REPROCHE));

    return enemy;
  }


  createPetitBonhomme() {
    let enemy = new Actor('Petit Bonhomme', EClass.TIER_1, false);
    enemy.health = new Health(52);
    enemy.stats$ = new Stats(5, 0, 39);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.POLICE));
    enemy.spells.push(new SpellDescription(ESPells.POELE));

    return enemy;
  }

  createWhisky() {
    let enemy = new Actor('Bouteille de whisky', EClass.TIER_1, false);
    enemy.health = new Health(86);
    enemy.stats$ = new Stats(5, 0, 39);
    enemy.spells.push(new SpellDescription(ESPells.APPEL_IRRESISTIBLE));
    enemy.spells.push(new SpellDescription(ESPells.APERO_MINUTE));

    return enemy;
  }

  createVaccin() {
    let enemy = new Actor('Vaccin', EClass.TIER_1, false);
    enemy.health = new Health(47);
    enemy.stats$ = new Stats(6, 0, 40);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.INJECTION));

    return enemy;
  }

  createCovid() {
    let enemy = new Actor('Covid', EClass.TIER_1, false);
    enemy.health = new Health(41);
    enemy.stats$ = new Stats(6, 6, 36);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.DELTA));

    return enemy;
  }

  createEnfants() {
    let enemy = new Actor('Enfant', EClass.TIER_1, false);
    enemy.health = new Health(39);
    enemy.stats$ = new Stats(6, 0, 30);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.CRIS));

    return enemy;
  }


  createKaren() {
    let enemy = new Actor('Karen', EClass.TIER_1, false);
    enemy.health = new Health(55);
    enemy.stats$ = new Stats(4, 0, 36);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.MANAGER));

    return enemy;
  }

  // TIER 2
  createVirginie() {
    let enemy = new Actor('Virginie', EClass.TIER_2, false);
    enemy.health = new Health(240);
    enemy.stats$ = new Stats(14, 0, 33);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.MOBY_DICK));
    enemy.spells.push(new SpellDescription(ESPells.HAMBURGER));

    return enemy;
  }

  createSandie() {
    let enemy = new Actor('Sandie', EClass.TIER_2, false);
    enemy.health = new Health(235);
    enemy.stats$ = new Stats(11, 11, 32);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.INTERDICTION_SORTIE));
    enemy.spells.push(new SpellDescription(ESPells.TROMPERIE));

    return enemy;
  }

  createIvoirien() {
    let enemy = new Actor('Ivoirien', EClass.TIER_2, false);
    enemy.health = new Health(215);
    enemy.stats$ = new Stats(13, 0, 28);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.FAKE_PHOTO));
    enemy.spells.push(new SpellDescription(ESPells.SMILEY_COEUR));

    return enemy;
  }

  createMilou() {
    let enemy = new Actor('Milou', EClass.TIER_2, false);
    enemy.health = new Health(228);
    enemy.stats$ = new Stats(13, 0, 34);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.CLONE));
    enemy.spells.push(new SpellDescription(ESPells.PROTECTION));

    return enemy;
  }

  createMarie() {
    let enemy = new Actor('Marie', EClass.TIER_2, false);
    enemy.health = new Health(220);
    enemy.stats$ = new Stats(14, 0, 31);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.SEX_ADDICT));
    enemy.spells.push(new SpellDescription(ESPells.MYTHO));

    return enemy;
  }

  createAlberge() {
    let enemy = new Actor('Mme Alberge', EClass.TIER_2, false);
    enemy.health = new Health(310);
    enemy.stats$ = new Stats(15, 0, 42);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.CHEVEUX));
    enemy.spells.push(new SpellDescription(ESPells.CARTABLE_VIDE));

    return enemy;
  }


  createFrancis() {
    let enemy = new Actor('Francis Lalane', EClass.TIER_3, false);
    enemy.health = new Health(980);
    enemy.stats$ = new Stats(19, 0, 33);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.COURSE_TRACTEUR));
    enemy.spells.push(new SpellDescription(ESPells.GAME_OF_THRONES));

    return enemy;
  }


}
