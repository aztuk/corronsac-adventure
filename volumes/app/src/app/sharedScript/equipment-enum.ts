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
    price: 72,
    description: (damageInstances, owner?) => {
      return `Les dégâts supplémentaires infligés passent à <dmg-deco amount="2" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco>.`
    },
    health: 8,
    stats: () => {
      const stats = new Stats(0,0,0);
      stats.attack = 9;
      return stats;
    },
    callback: (actor) => {
      actor.health.heal(8);
      actor.health.max += 8;

      let spellUpgrade = actor.spells.find(s => s.name === ESPells.ESCALADE.name);

      if(exists(spellUpgrade)) {
        spellUpgrade.damageInstances[1].amount = 2
      }
    }
  },
  FREELANCE: {
    name: 'Freelance',
    price: 78,
    description: (damageInstances, owner?) => {
      return `<strong class="spell-decorator">Amandine</strong> vous permet de gagner aussi <eff-deco effect="UP_CRIT"></eff-deco>.`
    },
    health: 16,
    stats: () => {
      const stats = new Stats(0,0,0);
      stats.speed = -6;
      return stats;
    },
    callback: (actor) => {
      actor.health.heal(16);
      actor.health.max += 16;

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
    health: 6,
    stats: () => {
      const stats = new Stats(0,0,0);
      stats.power = 9;
      return stats;
    },
    callback: (actor) => {
      actor.health.heal(6);
      actor.health.max += 6;

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
      return `<strong class="spell-decorator">Pigeon</strong> applique poison une fois supplémentaire.`
    },
    stats: () => {
      const stats = new Stats(0,0,0);
      stats.touch = 8;
      return stats;
    },
    health: 9,
    callback: (actor) => {
      actor.health.heal(9);
      actor.health.max += 9;

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
    health: 7,
    stats: () => {
      const stats = new Stats(0,0,0);
      stats.criticalDamage = 1.5;
      return stats;
    },
    callback: (actor) => {
      actor.health.heal(7);
      actor.health.max += 7;
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
    health: 7,
    stats: () => {
      const stats = new Stats(0,0,0);
      stats.critical = 15;
      return stats;
    },
    callback: (actor) => {
      actor.health.heal(7);
      actor.health.max += 7;
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
      stats.power = 5;
      stats.critical = 10;
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
      stats.touch = 8;
      return stats;
    },
    health: 6,
    callback: (actor) => {
      actor.health.heal(6);
      actor.health.max += 6;

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
    health: 35,
    stats: () => {
      const stats = new Stats(0,0,0);
      return stats;
    },
    callback: (actor) => {
      actor.health.current += 35;
      actor.health.max += 35;

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
    health: 7,
    stats: () => {
      const stats = new Stats(0,0,0);
      stats.attack = 6;
      return stats;
    },
    callback: (actor) => {
      actor.health.current += 7;
      actor.health.max += 7;

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
      return `<strong class="spell-decorator">Noob</strong> applique <eff-deco effect="UP_DODGE"></eff-deco> l'adversaire le plus faible.`
    },
    health: 12,
    stats: () => {
      const stats = new Stats(0,0,0);
      stats.dodge = 5;
      return stats;
    },
    callback: (actor) => {
      actor.health.heal(12);
      actor.health.max += 12;

      let spellUpgrade = actor.spells.find(s => s.name === ESPells.NOOB.name);

      if(exists(spellUpgrade)) {
        spellUpgrade.effectInstances.push({
          targetsType: ETargetTypes.LOWEST_ALLY,
          effect: EEffects.UP_DODGE
        });
      }
    }
  },
  SPOTIFY: {
    name: 'Compte Deezer',
    price: 66,
    description: (damageInstances, owner?, healInstances?) => {
      return `<strong class="spell-decorator">Playlist</strong> soigne aussi l'allié le plus faible de <strong class="heal">${Math.round(0.05* owner.health.max)} PV</strong>.`
    },
    health: 6,
    stats: () => {
      const stats = new Stats(0,0,0);
      stats.dodge = 5;
      return stats;
    },
    callback: (actor) => {
      actor.health.heal(6);
      actor.health.max += 6;

      let spellUpgrade = actor.spells.find(s => s.name === ESPells.PLAYLIST.name);

      if(exists(spellUpgrade)) {
        spellUpgrade.healInstances.push({
          targetsType: ETargetTypes.LOWEST_ALLY,
          amount: 0.05,
        });
      }
    }
  },
}
