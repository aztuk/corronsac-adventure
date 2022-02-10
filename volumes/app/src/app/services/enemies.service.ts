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

  private enemyBucketTierOne = [
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
      return [this.createKaren(), this.createEnfants()]
    },
    () => {
      return [this.createPetitBonhomme(), this.createKaren()]
    },
    () => {
      return [this.createVieilleConnaissance(), this.createCovid()]
    },
    () => {
      return [this.createPatron(), this.createVaccin()]
    },
    () => {
      return [this.createEnfants(), this.createEnfants(), this.createEnfants()]
    },
    () => {
      return [this.createWhisky(), this.createRacaille()]
    },
    () => {
      return [this.createWhisky(), this.createVieilleConnaissance()]
    },
    () => {
      return [this.createWhisky(), this.createPatron()]
    },
    () => {
      return [this.createVaccin(), this.createCovid()]
    },
    () => {
      return [this.createPetitBonhomme(), this.createPatron(), this.createPatron()]
    },
  ]

  public enemyBucketTierTwo = [
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
      enemies = getRandomInArray(this.enemyBucketTierTwo, 0, this.enemyBucketTierTwo.length)();
    } else {
      enemies = [this.createAlberge()];
    }

    return enemies;
  }

  createPetitBonhomme() {
    let enemy = new Actor('Petit Bonhomme', EClass.TIER_1, false);
    enemy.health = new Health(36);
    enemy.stats$ = new Stats(4, 0, 24);
    enemy.spells.push(new SpellDescription(ESPells.POLICE));
    enemy.spells.push(new SpellDescription(ESPells.POELE));

    return enemy;
  }

  createWhisky() {
    let enemy = new Actor('Bouteille de whisky', EClass.TIER_1, false);
    enemy.health = new Health(42);
    enemy.stats$ = new Stats(4, 4, 29);
    enemy.spells.push(new SpellDescription(ESPells.APPEL_IRRESISTIBLE));
    enemy.spells.push(new SpellDescription(ESPells.APERO_MINUTE));

    return enemy;
  }

  createVaccin() {
    let enemy = new Actor('Vaccin', EClass.TIER_1, false);
    enemy.health = new Health(37);
    enemy.stats$ = new Stats(4, 1, 42);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.INJECTION));

    return enemy;
  }

  createCovid() {
    let enemy = new Actor('Covid', EClass.TIER_1, false);
    enemy.health = new Health(26);
    enemy.stats$ = new Stats(1, 4, 23);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.DELTA));

    return enemy;
  }

  createEnfants() {
    let enemy = new Actor('Enfant', EClass.TIER_1, false);
    enemy.health = new Health(21);
    enemy.stats$ = new Stats(4, 0, 23);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.CRIS));

    return enemy;
  }

  createVieilleConnaissance() {
    let enemy = new Actor('Vieille connaissance', EClass.TIER_1, false);
    enemy.health = new Health(30);
    enemy.stats$ = new Stats(3, 1, 40);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.REPROCHE));

    return enemy;
  }

  createKaren() {
    let enemy = new Actor('Karen', EClass.TIER_1, false);
    enemy.health = new Health(38);
    enemy.stats$ = new Stats(3, 0, 36);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.MANAGER));

    return enemy;
  }

  createRacaille() {
    let enemy = new Actor('Petite racaille', EClass.TIER_1, false);
    enemy.health = new Health(23);
    enemy.stats$ = new Stats(4, 0, 30);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.INSULTE));

    return enemy;
  }

  createPatron() {
    let enemy = new Actor('Patron lourd', EClass.TIER_1, false);
    enemy.health = new Health(16);
    enemy.stats$ = new Stats(6, 0, 25);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.HEURES_SUPP));

    return enemy;
  }

  // TIER 2
  createVirginie() {
    let enemy = new Actor('Virginie', EClass.TIER_2, false);
    enemy.health = new Health(140);
    enemy.stats$ = new Stats(8, 0, 34);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.MOBY_DICK));
    enemy.spells.push(new SpellDescription(ESPells.HAMBURGER));

    return enemy;
  }

  createSandie() {
    let enemy = new Actor('Sandie', EClass.TIER_2, false);
    enemy.health = new Health(135);
    enemy.stats$ = new Stats(4, 5, 32);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.INTERDICTION_SORTIE));
    enemy.spells.push(new SpellDescription(ESPells.TROMPERIE));

    return enemy;
  }

  createIvoirien() {
    let enemy = new Actor('Ivoirien', EClass.TIER_2, false);
    enemy.health = new Health(115);
    enemy.stats$ = new Stats(9, 0, 28);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.FAKE_PHOTO));
    enemy.spells.push(new SpellDescription(ESPells.SMILEY_COEUR));

    return enemy;
  }

  createMilou() {
    let enemy = new Actor('Milou', EClass.TIER_2, false);
    enemy.health = new Health(128);
    enemy.stats$ = new Stats(6, 0, 34);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.CLONE));
    enemy.spells.push(new SpellDescription(ESPells.PROTECTION));

    return enemy;
  }

  createMarie() {
    let enemy = new Actor('Marie', EClass.TIER_2, false);
    enemy.health = new Health(120);
    enemy.stats$ = new Stats(7, 0, 31);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.SEX_ADDICT));
    enemy.spells.push(new SpellDescription(ESPells.MYTHO));

    return enemy;
  }

  createAlberge() {
    let enemy = new Actor('Mme Alberge', EClass.TIER_2, false);
    enemy.health = new Health(185);
    enemy.stats$ = new Stats(5, 0, 42);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.CHEVEUX));
    enemy.spells.push(new SpellDescription(ESPells.CARTABLE_VIDE));

    return enemy;
  }


  createFrancis() {
    let enemy = new Actor('Francis Lalane', EClass.TIER_3, false);
    enemy.health = new Health(360);
    enemy.stats$ = new Stats(8, 0, 29);
    enemy.spells.push(new SpellDescription(ESPells.COURSE_TRACTEUR));
    enemy.spells.push(new SpellDescription(ESPells.RUGISSEMENT));
    enemy.spells.push(new SpellDescription(ESPells.GAME_OF_THRONES));

    return enemy;
  }


}
