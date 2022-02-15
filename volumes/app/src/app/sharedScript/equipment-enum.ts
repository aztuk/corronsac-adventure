import { ESPells } from './spells-enum';
import { Stats } from './../object/components/stats';
import {EClass, EDamageType, EEffects, ETargetTypes} from './enums';
import { dice, exists } from './helpers';
import { Actor } from '../object/entities/actor';
import { Health } from '../object/components/health';
import { SpellDescription } from '../object/components/spell-description';

export type EEquipment = typeof EEquipment[keyof typeof EEquipment];
export const EEquipment = {
  GANTS_ESCALADE: {
    name: 'Gants d\'escalade',
    price: 58,
    description: (damageInstances, owner?) => {
      return `Les chances que votre cible soit <eff-deco effect="STUN"></eff-deco> lors d\'une <strong class="spell-decorator">Escalade</strong> passe à 80%.`
    },
    stats: () => {
      const stats = new Stats(0,0,0);
      stats.speed = -3;
      stats.dodge = 15;
      return stats;
    },
    callback: (actor) => {
      let spellUpgrade = actor.spells.find(s => s.name === ESPells.ESCALADE.name);

      if(exists(spellUpgrade)) {
        spellUpgrade.effectInstances[0].condition = ($this) => {
          return dice(80)
        }
      }
    }
  },
  FREELANCE: {
    name: 'Freelance',
    price: 55,
    description: (damageInstances, owner?) => {
      return `<strong class="spell-decorator">Amandine</strong> vous permet de gagner aussi <eff-deco effect="UP_CRIT"></eff-deco>.`
    },
    stats: () => {
      const stats = new Stats(0,0,0);
      stats.attack = 3;
      stats.dodge = 15;
      return stats;
    },
    callback: (actor) => {
      let spellUpgrade = actor.spells.find(s => s.name === ESPells.AMANDINE.name);

      if(exists(spellUpgrade)) {
        spellUpgrade.effectInstances.push({
          targetsType: ETargetTypes.SELF,
          effect: EEffects.UP_CRIT,
        })
      }
    }
  },
  SOURIS: {
    name: 'Souris congelées',
    price: 64,
    description: (damageInstances, owner?) => {
      return `<strong class="spell-decorator">Serpents</strong> invoque un serpent supplémentaire.`
    },
    stats: () => {
      const stats = new Stats(0,0,0);
      stats.power = 3;
      stats.touch = 5;
      return stats;
    },
    callback: (actor) => {
      let spellUpgrade = actor.spells.find(s => s.name === ESPells.SNAKES.name);

      if(exists(spellUpgrade)) {
        spellUpgrade.invocation = ($this) => {
          let invocations = [];

          for(let i of Array(2)) {
            const snake = new Actor('Serpent', EClass.INVOCATION, true);
            snake.stats$ = new Stats(2, 0, 25);
            snake.health = new Health(8);
            snake.spells.push(new SpellDescription(ESPells.BASIC));
            snake.spells.push(new SpellDescription(ESPells.SNAKES_BITE));

            invocations.push(snake);
          }

          return invocations;
        }
      }
    }
  },
  BALLANTINES: {
    name: 'Ballantines',
    price: 67,
    description: (damageInstances, owner?) => {
      return `<strong class="spell-decorator">Pigeon</strong> applique <eff-deco effect="POISON" power="${owner.stats.power}"></eff-deco> une fois supplémentaire.`
    },
    stats: () => {
      const stats = new Stats(0,0,0);
      stats.power = 3;
      return stats;
    },
    health: 12,
    callback: (actor) => {
      actor.health.heal(12);
      actor.health.max += 12;

      let spellUpgrade = actor.spells.find(s => s.name === ESPells.PIGEON.name);

      if(exists(spellUpgrade)) {
        spellUpgrade.effectInstances.push({
          targetsType: ETargetTypes.ALL_ENEMIES,
          effect: EEffects.POISON,
        });
      }
    }
  },
  CASQUE: {
    name: 'Casque',
    price: 72,
    description: (damageInstances, owner?) => {
      return `<strong class="spell-decorator">Tête la première</strong> n'inflige plus de dégâts collatéraux.`
    },
    stats: () => {
      const stats = new Stats(0,0,0);
      stats.critical = 8;
      stats.criticalDamage = 1.5;
      return stats;
    },
    callback: (actor) => {
      let spellUpgrade = actor.spells.find(s => s.name === ESPells.TETE_PREMIERE.name);

      if(exists(spellUpgrade)) {
        spellUpgrade.damageInstances[0].amount = 0;
      }
    }
  },
  ALCOTEST: {
    name: 'Alcotest',
    price: 63,
    description: (damageInstances, owner?) => {
      return `<strong class="spell-decorator">Discussion insensée</strong> inflige désormais 180% au lieu de 120% de l'attaque.`
    },
    stats: () => {
      const stats = new Stats(0,0,0);
      stats.attack = 3;
      stats.critical = 8;
      return stats;
    },
    callback: (actor) => {
      let spellUpgrade = actor.spells.find(s => s.name === ESPells.DISCUSSION_INSENSEE.name);

      if(exists(spellUpgrade)) {
        spellUpgrade.damageInstances[0].amount = 1.8;
      }
    }
  },
  EXTENSION_SMARTLIFE: {
    name: 'Risk',
    price: 63,
    description: (damageInstances, owner?) => {
      return `<strong class="spell-decorator">Smart life</strong> touche maintenant 2 cibles.`
    },
    stats: () => {
      const stats = new Stats(0,0,0);
      stats.touch = 10;
      return stats;
    },
    callback: (actor) => {
      let spellUpgrade = actor.spells.find(s => s.name === ESPells.SMART_LIFE.name);

      if(exists(spellUpgrade)) {
        spellUpgrade.damageInstances[0].targetsAmount =  2;
      }
    }
  },
  DISCORD: {
    name: 'Discord',
    price: 59,
    description: (damageInstances, owner?) => {
      return `<strong class="spell-decorator">Fuite</strong> donne aussi <eff-deco effect="UP_AP"></eff-deco> à 3 alliés.`
    },
    stats: () => {
      const stats = new Stats(0,0,0);
      stats.power = 6;
      return stats;
    },
    callback: (actor) => {
      let spellUpgrade = actor.spells.find(s => s.name === ESPells.FUITE.name);

      if(exists(spellUpgrade)) {
        spellUpgrade.effectInstances.push({
          targetsType: ETargetTypes.RANDOM_ALLY,
          effect: EEffects.UP_AP,
          targetsAmount: 3
        });
      }
    }
  },
  PROTEGE_TIBIA: {
    name: 'Protège tibia',
    price: 79,
    description: (damageInstances, owner?) => {
      return `<strong class="spell-decorator">Jonglage</strong> ne nécessite plus de tuer sa cible pour récupérer des points de vie.`
    },
    health: 25,
    stats: () => {
      const stats = new Stats(0,0,0);
      return stats;
    },
    callback: (actor) => {
      actor.health.current += 25;
      actor.health.max += 25;

      let spellUpgrade = actor.spells.find(s => s.name === ESPells.JONGLAGE.name);

      if(exists(spellUpgrade)) {
        spellUpgrade.healInstances[0].condition = ($this) =>{ return true};
      }
    }
  },
  VESTE_MARQUE: {
    name: 'Veste de marque',
    price: 62,
    description: (damageInstances, owner?) => {
      return `<strong class="spell-decorator">Seduction</strong> soigne de 10% de la santé maximale au lieu de 5%.`
    },
    health: 15,
    stats: () => {
      const stats = new Stats(0,0,0);
      stats.attack = 3;
      return stats;
    },
    callback: (actor) => {
      actor.health.current += 15;
      actor.health.max += 15;

      let spellUpgrade = actor.spells.find(s => s.name === ESPells.SEDUCTION.name);

      if(exists(spellUpgrade)) {
        spellUpgrade.healInstances[0].amount = 0.1;
      }
    }
  },
  MANETTE_XBOX: {
    name: 'Manette',
    price: 61,
    description: (damageInstances, owner?) => {
      return `<strong class="spell-decorator">Noob</strong> applique <eff-deco effect="UP_DODGE"></eff-deco> à tous ses alliés.`
    },
    health: 8,
    stats: () => {
      const stats = new Stats(0,0,0);
      stats.speed = -4;
      return stats;
    },
    callback: (actor) => {
      actor.health.heal(8);
      actor.health.max += 8;

      let spellUpgrade = actor.spells.find(s => s.name === ESPells.NOOB.name);

      if(exists(spellUpgrade)) {
        spellUpgrade.effectInstances.push({
          targetsType: ETargetTypes.ALL_ALLIES,
          effect: EEffects.UP_DODGE
        });
      }
    }
  },
  SPOTIFY: {
    name: 'Compte Deezer',
    price: 66,
    description: (damageInstances, owner?) => {
      return `<strong class="spell-decorator">Playlist</strong> fait maintenant gagner <eff-deco effect="TAUNT"></eff-deco>.`
    },
    health: 8,
    stats: () => {
      const stats = new Stats(0,0,0);
      stats.speed = -2;
      return stats;
    },
    callback: (actor) => {
      actor.health.heal(12);
      actor.health.max += 12;

      let spellUpgrade = actor.spells.find(s => s.name === ESPells.PLAYLIST.name);

      if(exists(spellUpgrade)) {
        spellUpgrade.effectInstances.push({
          targetsType: ETargetTypes.SELF,
          effect: EEffects.TAUNT
        });
      }
    }
  },
}
