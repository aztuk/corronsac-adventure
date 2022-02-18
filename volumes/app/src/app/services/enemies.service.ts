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
      return [this.createPatronUp(), this.createVieilleConnaissance(), this.createVieilleConnaissance()]
    },
    () => {
      return [this.createKaren(), this.createVieilleConnaissance(), this.createEnfants(), this.createEnfants()]
    },
    () => {
      return [this.createVaccinUp(), this.createCovidUp()]
    },
    () => {
      return [this.createPetitBonhommeUp(), this.createKarenUp()]
    },
    () => {
      return [this.createRacaille(), this.createRacaille(), this.createWhiskyUp(), this.createRacaille(), this.createRacaille()]
    },
    () => {
      return [this.createEnfants(), this.createVieilleConnaissanceUp(), this.createEnfants()]
    },
    () => {
      return [this.createPatronUp(), this.createVaccinUp(), this.createVaccinUp()]
    },
    () => {
      return [this.createVieilleConnaissance(),this.createVieilleConnaissance(), this.createPatronUp(),this.createVieilleConnaissance(),this.createVieilleConnaissance(),this.createVieilleConnaissance()]
    },
    () => {
      return [this.createEnfants(),this.createEnfants(),this.createEnfantsUp(),this.createEnfants(),this.createEnfants()]
    },
    () => {
      return [this.createWhiskyUp(),this.createWhisky(),this.createPetitBonhommeUp(),this.createPetitBonhomme()]
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


  // --------------------------------

  createRacailleUp() {
    let enemy = new Actor('Racaille', EClass.TIER_1, false);
    enemy.health = new Health(87);
    enemy.stats$ = new Stats(6, 0, 52);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.INSULTE));

    return enemy;
  }

  createPatronUp() {
    let enemy = new Actor('Patron abusif', EClass.TIER_1, false);
    enemy.health = new Health(89);
    enemy.stats$ = new Stats(6, 0, 52);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.HEURES_SUPP));

    return enemy;
  }

  createVieilleConnaissanceUp() {
    let enemy = new Actor('Faux ami', EClass.TIER_1, false);
    enemy.health = new Health(88);
    enemy.stats$ = new Stats(6, 0, 53);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.REPROCHE));

    return enemy;
  }


  createPetitBonhommeUp() {
    let enemy = new Actor('Petit Bonhomme colérique', EClass.TIER_1, false);
    enemy.health = new Health(117);
    enemy.stats$ = new Stats(8, 0, 43);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.POLICE));
    enemy.spells.push(new SpellDescription(ESPells.POELE));

    return enemy;
  }

  createWhiskyUp() {
    let enemy = new Actor('Magnum', EClass.TIER_1, false);
    enemy.health = new Health(188);
    enemy.stats$ = new Stats(10, 0, 41);
    enemy.spells.push(new SpellDescription(ESPells.APPEL_IRRESISTIBLE));
    enemy.spells.push(new SpellDescription(ESPells.APERO_MINUTE));

    return enemy;
  }

  createVaccinUp() {
    let enemy = new Actor('Astra-zeneca', EClass.TIER_1, false);
    enemy.health = new Health(112);
    enemy.stats$ = new Stats(8, 0, 42);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.INJECTION));

    return enemy;
  }

  createCovidUp() {
    let enemy = new Actor('Covid 20', EClass.TIER_1, false);
    enemy.health = new Health(108);
    enemy.stats$ = new Stats(7, 7, 36);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.DELTA));

    return enemy;
  }

  createEnfantsUp() {
    let enemy = new Actor('Peste', EClass.TIER_1, false);
    enemy.health = new Health(98);
    enemy.stats$ = new Stats(6, 0, 32);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.CRIS));

    return enemy;
  }


  createKarenUp() {
    let enemy = new Actor('Karen surmontée', EClass.TIER_1, false);
    enemy.health = new Health(105);
    enemy.stats$ = new Stats(7, 0, 34);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.MANAGER));

    return enemy;
  }

  // TIER 2
  createVirginie() {
    let enemy = new Actor('Virginie', EClass.TIER_2, false);
    enemy.health = new Health(308);
    enemy.stats$ = new Stats(20, 0, 33);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.MOBY_DICK));
    enemy.spells.push(new SpellDescription(ESPells.HAMBURGER));

    return enemy;
  }

  createSandie() {
    let enemy = new Actor('Sandie', EClass.TIER_2, false);
    enemy.health = new Health(274);
    enemy.stats$ = new Stats(15, 15, 32);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.INTERDICTION_SORTIE));
    enemy.spells.push(new SpellDescription(ESPells.TROMPERIE));

    return enemy;
  }

  createIvoirien() {
    let enemy = new Actor('Ivoirien', EClass.TIER_2, false);
    enemy.health = new Health(269);
    enemy.stats$ = new Stats(18, 0, 28);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.FAKE_PHOTO));
    enemy.spells.push(new SpellDescription(ESPells.SMILEY_COEUR));

    return enemy;
  }

  createMilou() {
    let enemy = new Actor('Milou', EClass.TIER_2, false);
    enemy.health = new Health(284);
    enemy.stats$ = new Stats(18, 0, 34);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.CLONE));
    enemy.spells.push(new SpellDescription(ESPells.PROTECTION));

    return enemy;
  }

  createMarie() {
    let enemy = new Actor('Marie', EClass.TIER_2, false);
    enemy.health = new Health(267);
    enemy.stats$ = new Stats(17, 0, 31);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.SEX_ADDICT));
    enemy.spells.push(new SpellDescription(ESPells.MYTHO));

    return enemy;
  }

  createAlberge() {
    let enemy = new Actor('Mme Alberge', EClass.TIER_2, false);
    enemy.health = new Health(365);
    enemy.stats$ = new Stats(17, 0, 42);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.CHEVEUX));
    enemy.spells.push(new SpellDescription(ESPells.CARTABLE_VIDE));

    return enemy;
  }


  createFrancis() {
    let enemy = new Actor('Francis Lalane', EClass.TIER_3, false);
    enemy.health = new Health(1100);
    enemy.stats$ = new Stats(24, 0, 33);
    enemy.spells.push(new SpellDescription(ESPells.BASIC));
    enemy.spells.push(new SpellDescription(ESPells.COURSE_TRACTEUR));
    enemy.spells.push(new SpellDescription(ESPells.GAME_OF_THRONES));

    return enemy;
  }


}
