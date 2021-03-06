import { ISpellDescription } from './interfaces';
import { EnemiesService } from './../services/enemies.service';
import {Damage} from '../object/system/damage';
import {SpellDescription} from '../object/components/spell-description';
import {Health} from '../object/components/health';
import {Stats} from '../object/components/stats';
import {Actor} from '../object/entities/actor';
import {EAttackStatus, EClass, EDamageType, EEffects, EHero, ETargetTypes} from './enums';
import {dice, exists} from './helpers';
import {SpellCast} from '../object/system/spellCast';
import { EEquipment } from './equipment-enum';

/* AJOUTER UN EFFECT :
  - Tooltip effect description
  - actor entity compute stats
  - get buff value in effect system
  - add icon / display in effects list
*/


export type ESPells = typeof ESPells[keyof typeof ESPells];
export const ESPells = {
  BASIC: {
    name: 'Attaque',
    price: 0,
    description: (damageInstances, owner?) => {
      return `Lance une attaque de base infligeant <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco>`;
    },
    cooldown: 0,
    damageInstances: [{
      targetsType: ETargetTypes.TARGET,
      damageType: EDamageType.PHYSIC,
      amount: 1
    }],
    effectInstances: []
  },

  /* SORTS DE ADRIEN */
  ADRIEN_PASSIVE_PROC: {
    name: 'Agile',
    price: 1000,
    description: (damageInstances, owner?) => {
      return '';
    },
    cooldown: 0,
    damageInstances: [],
    effectInstances: [],
    healInstances: []
  },
  ESCALADE: {
      name: 'Escalade',
      price: 82,
      description: (damageInstances, owner?) => {
        let text = `Escalade la cible infligeant <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco>.
        Escalade inflige <dmg-deco amount="${damageInstances[1].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco> supplémentaire à sa cible pour chaque adversaire vivant.`

        const equipment = owner.equipment.find(e => e.name === EEquipment.GANTS_ESCALADE.name);

        if(equipment.unlocked){
          text += `<br/><br/><strong class="equipment-effect">${equipment.description(damageInstances, owner)}</strong>`;
        }

        return text;
      },
    cooldown: 2,
    damageInstances: [{
      targetsType: ETargetTypes.TARGET,
      damageType: EDamageType.PHYSIC,
      amount: 1.2
    }, {
      targetsType: ETargetTypes.TARGET,
      damageType: EDamageType.PHYSIC,
      amount: 0.5,
      onHit: ($this) => {
        let bonusDamages = [];
        for(let newInstance of Array($this._combatActors.enemies.length - 1)) {
          bonusDamages.push({
            targetsType: ETargetTypes.TARGET,
            damageType: EDamageType.PHYSIC,
            amount: 0.5
          });
        }

        $this.createDamageInstances(bonusDamages)
      }
    }],
    effectInstances: []

  },
  SMOKE_SCREEN: {
    name: 'Ecran de fumée',
    price: 38,
    description: (damageInstances, owner?) => {
      return `Fume aggressivement, provoquant un nuage de fumée permettant à tous les alliés de gagner
      <eff-deco effect="UP_DODGE" with-time></eff-deco>`
    },
    cooldown: 1,
    damageInstances: [],
    effectInstances: [{
      targetsType: ETargetTypes.ALL_ALLIES,
      effect: EEffects.UP_DODGE,
    }]

  },
  AMANDINE: {
    name: 'Amandine',
    price: 74,
    description: (damageInstances, owner?) => {
      let text = `Appelle Amandine à la rescousse qui par sa présence inattendue inflige <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco> à tous les enemis.`;


      const equipment = owner.equipment.find(e => e.name === EEquipment.FREELANCE.name);

      if(equipment.unlocked){
        text += `<br/><br/><strong class="equipment-effect">${equipment.description(damageInstances, owner)}</strong>`;
      }

      return text;
    },
    cooldown: 3,
    damageInstances: [{
      targetsType: ETargetTypes.ALL_ENEMIES,
      damageType: EDamageType.PHYSIC,
      amount: 1.1
    }],
    effectInstances: []

  },

  /* SORTS DE LOIC */
  DISCUSSION_INSENSEE: {
    name: 'Discussion insensée',
    price: 78,
    description: (damageInstances, owner?) => {
      let text =  `Entame une discussion avec sa cible lui infligeant <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco>.`;

      const equipment = owner.equipment.find(e => e.name === EEquipment.ALCOTEST.name);

      if(equipment.unlocked){
        text += `<br/><br/><strong class="equipment-effect">${equipment.description(damageInstances, owner)}</strong>`;
      }

      return text;
    },
    cooldown: 1,
    damageInstances: [{
      targetsType: ETargetTypes.TARGET,
      damageType: EDamageType.PHYSIC,
      amount: 1.2
    }],
    effectInstances: []
  },
  FRONT_LISSE: {
    name: 'Front lisse',
    price: 40,
    description: (damageInstances, owner?) => {
      return `Les reflets du front lisse de ${owner.name} aveuglent ses enemis. Ce qui lui permet de gagner  <eff-deco effect="UP_CRIT" with-time></eff-deco>.`
    },
    cooldown: 1,
    damageInstances: [],
    effectInstances: [{
      targetsType: ETargetTypes.SELF,
      effect: EEffects.UP_CRIT,
    }]
  },
  TETE_PREMIERE: {
    name: 'Tête la première',
    price: 89,
    description: (damageInstances, owner?) => {
      let text = `Envoie un violent coup de tête vers l'avant, sans réfléchir, s'infligeant au passage
      <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco>
       mais aussi <dmg-deco amount="${damageInstances[1].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco> à tous les enemis`;

       const equipment = owner.equipment.find(e => e.name === EEquipment.CASQUE.name);

       if(equipment.unlocked){
         text += `<br/><br/><strong class="equipment-effect">${equipment.description(damageInstances, owner)}</strong>`;
       }

       return text;
    },
    cooldown: 3,
    damageInstances: [{
      targetsType: ETargetTypes.SELF,
      damageType: EDamageType.PHYSIC,
      amount: 0.5
    }, {
      targetsType: ETargetTypes.ALL_ENEMIES,
      damageType: EDamageType.PHYSIC,
      amount: 1.2
    }],
    effectInstances: []
  },

  /* SORTS DE KEVIN */
  MAURICE: {
    name: 'Maurice',
    price: 66,
    description: (damageInstances, owner?) => {
      return `Fait goûter une portion de Maurice à sa cible lui infligeant <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.power * owner.stats.damageMultiplier}" type="magical"></dmg-deco>
      et empoisonne la cible lui infligeant <eff-deco effect="POISON" with-time multiplier="${owner.stats.damageMultiplier}" power="${owner.stats.power}"></eff-deco>`
    },
    cooldown: 1,
    damageInstances: [{
      targetsType: ETargetTypes.TARGET,
      damageType: EDamageType.MAGIC,
      amount: 1
    }],
    effectInstances: [{
      targetsType: ETargetTypes.TARGET,
      effect: EEffects.POISON,
    }]
  },
  PIGEON: {
    name: 'Pigeon',
    price: 88,
    description: (damageInstances, owner?) => {
      let text =`Propose un pigeon, alors que personne n'a envie. Tous les enemis sont empoisonnés infligeant <eff-deco effect="POISON" with-time multiplier="${owner.stats.damageMultiplier}" power="${owner.stats.power}"></eff-deco>.`
      const equipment = owner.equipment.find(e => e.name === EEquipment.BALLANTINES.name);

      if(equipment.unlocked){
        text += `<br/><br/><strong class="equipment-effect">${equipment.description(damageInstances, owner)}</strong>`;
      }

      return text;
    },
    cooldown: 2,
    damageInstances: [],
    effectInstances: [{
      targetsType: ETargetTypes.ALL_ENEMIES,
      effect: EEffects.POISON,
    }]
  },
  SNAKES: {
    name: 'Serpents',
    price: 83,
    description: (damageInstances, owner?) => {
      let text = `Invoque 1 serpent rabougri qui rejoindra l'équipe.`;
      const equipment = owner.equipment.find(e => e.name === EEquipment.SOURIS.name);

      if(equipment.unlocked){
        text += `<br/><br/><strong class="equipment-effect">${equipment.description(damageInstances, owner)}</strong>`;
      }

      return text;
    },
    cooldown: 3,
    invocation: ($this) => {
      const snake = new Actor('Serpent', EClass.INVOCATION, true);
      snake.stats$ = new Stats(2, 0, 25);
      snake.health = new Health(8);
      snake.spells.push(new SpellDescription(ESPells.BASIC));
      snake.spells.push(new SpellDescription(ESPells.SNAKES_BITE));

      return [snake];
    },
    damageInstances: [],
    effectInstances: []
  },
  SNAKES_BITE: {
    name: 'Morsure de serpent',
    price: 24,
    description: (damageInstances, owner?) => {
      return `Tente d'empoisonner la cible infligeant  <eff-deco effect="POISON" with-time multiplier="${owner.stats.damageMultiplier}" power="${owner.stats.power}"></eff-deco>, environ 50% de chance de réussir.`
    },
    cooldown: 1,
    damageInstances: [],
    effectInstances: [{
      targetsType: ETargetTypes.TARGET,
      effect: EEffects.POISON,
      condition: ($this) => {
        return dice(50)
      }
    }]
  },

  /* SORTS DE QUENTIN */
  SMART_LIFE: {
    name: 'Smart life',
    price: 81,
    description: (damageInstances, owner?) => {
      let text = `Propose un smart life à ${damageInstances[0].targetsAmount} adversaire aléatoire leur infligeant <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.power * owner.stats.damageMultiplier}" type="magical"></dmg-deco>.<br/><br/>
      Chaque cible touchée augmente définitivement les dégâts de 8% de ce sort.`;
      const equipment = owner.equipment.find(e => e.name === EEquipment.EXTENSION_SMARTLIFE.name);

      if(equipment.unlocked){
        text += `<br/><br/><strong class="equipment-effect">${equipment.description(damageInstances, owner)}</strong>`;
      }

      return text;
    },
    cooldown: 2,
    damageInstances: [{
      targetsType: ETargetTypes.RANDOM_ENEMY,
      targetsAmount: 1,
      damageType: EDamageType.MAGIC,
      amount: 1,
      onHit: ($this) => {
        $this.spellDescription.damageInstances[0].amount += 0.08;
      }
    }],
    effectInstances: []
  },
  DEBAT_POLITIQUE: {
    name: 'Débat politique',
    price: 73,
    description: (damageInstances, owner?) => {
      return `Lance un ennuyeux débat politique à l'adversaire le plus faible et inflige <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.power * owner.stats.damageMultiplier}" type="magical"></dmg-deco>.`
    },
    cooldown: 2,
    damageInstances: [{
      targetsType: ETargetTypes.LOWEST_ENEMY,
      damageType: EDamageType.MAGIC,
      amount: 1.5
    }],
    effectInstances: []
  },
  FUITE: {
    name: 'Fuite',
    price: 45,
    description: (damageInstances, owner?) => {
      let text = `Ne donne plus de nouvelles infligeant <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.power * owner.stats.damageMultiplier}" type="magical"></dmg-deco> à un personnage aléatoire, mais revient plus fort avec <eff-deco effect="UP_AP" with-time></eff-deco>.`;
      const equipment = owner.equipment.find(e => e.name === EEquipment.DISCORD.name);

      if(equipment.unlocked){
        text += `<br/><br/><strong class="equipment-effect">${equipment.description(damageInstances, owner)}</strong>`;
      }

      return text;
    },
    cooldown: 1,
    damageInstances: [{
      targetsType: ETargetTypes.RANDOM_ENEMY,
      targetsAmount: 1,
      damageType: EDamageType.MAGIC,
      amount: 1.7
    }],
    effectInstances: [{
      targetsType: ETargetTypes.SELF,
      effect: EEffects.UP_AP,
    }]
  },

  /* SORTS DE CLEMENT */

  CLEMENT_PASSIVE_PROC: {
    name: 'Leader',
    price: 1000,
    description: (damageInstances, owner?) => {
      return '';
    },
    cooldown: 0,
    damageInstances: [],
    effectInstances: [{
      targetsType: ETargetTypes.SELF,
      effect: EEffects.TAUNT,
    }],
    healInstances: []
  },
  JONGLAGE: {
    name: 'Jonglage',
    price: 69,
    description: (damageInstances, owner?, healInstances?) => {
      let text = `Se met à jongler pour impressionner sa cible et lui inflige  <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco>.<br/><br/>
      Si ça cible est tuée par son impressionante prestation, ${owner.name} récupère <strong class="heal">${Math.round(healInstances[0].amount * owner.health.max)} PV</strong>.`;
      const equipment = owner.equipment.find(e => e.name === EEquipment.PROTEGE_TIBIA.name);

      if(equipment.unlocked){
        text += `<br/><br/><strong class="equipment-effect">${equipment.description(damageInstances, owner)}</strong>`;
      }

      return text;
    },
    cooldown: 1,
    damageInstances: [{
      targetsType: ETargetTypes.TARGET,
      damageType: EDamageType.PHYSIC,
      amount: 0.7
    }],
    effectInstances: [],
    healInstances: [{
      targetsType: ETargetTypes.SELF,
      amount: 0.03,
      condition: ($this) => {
        return $this.damages[0].damage >= $this.damages[0].target.health.current;
      }
    }]
  },
  TRAINING: {
    name: 'Entraînement',
    price: 53,
    description: (damageInstances, owner?, healInstances?) => {
      return `Se lance dans un coaching individuel, ce qui fait gagner <eff-deco effect="UP_AD" with-time></eff-deco> à tous ses alliés.<br/><br/>
      Son allié le plus faible récupère <strong class="heal">${Math.round(healInstances[0].amount * owner.health.max)} PV</strong>.`
    },
    cooldown: 2,
    damageInstances: [],
    effectInstances: [{
      targetsType: ETargetTypes.ALL_ALLIES,
      effect: EEffects.UP_AD,
    }],
    healInstances: [{
      targetsType: ETargetTypes.LOWEST_ALLY,
      amount: 0.05,
    }]
  },
  SEDUCTION: {
    name: 'Séduction',
    price: 95,
    description: (damageInstances, owner?, healInstances?) => {
      let text = `Le regard de ${owner.name} emplie ses adversaires d'envie, qui finisse par ne penser qu'à lui. ${owner.name} gagne <eff-deco effect="TAUNT" with-time></eff-deco>.<br/><br/>
      La confiance engendrée lui permet de récupèrer <strong class="heal">${Math.round(healInstances[0].amount * owner.health.max)} PV</strong>.`;
      const equipment = owner.equipment.find(e => e.name === EEquipment.VESTE_MARQUE.name);

      if(equipment.unlocked){
        text += `<br/><br/><strong class="equipment-effect">${equipment.description(damageInstances, owner)}</strong>`;
      }

      return text;
    },
    cooldown: 1,
    damageInstances: [],
    effectInstances: [{
      targetsType: ETargetTypes.SELF,
      effect: EEffects.TAUNT,
    }],
    healInstances: [{
      targetsType: ETargetTypes.SELF,
      amount: 0.04,
    }]
  },

  /* SORTS DE COSTY */
  NOOB: {
    name: 'Noob',
    price: 61,
    description: (damageInstances, owner?, healInstances?) => {
      let text = `Essaye un nouveau jeu sans lire les règles, faisant n'importe quoi. Le rire provoqué soigne l'allié le plus faible de <strong class="heal">${Math.round(healInstances[0].amount * owner.health.max)} PV</strong>.`;
      const equipment = owner.equipment.find(e => e.name === EEquipment.MANETTE_XBOX.name);

      if(equipment.unlocked){
        text += `<br/><br/><strong class="equipment-effect">${equipment.description(damageInstances, owner)}</strong>`;
      }

      return text;

    },
    cooldown: 1,
    damageInstances: [],
    effectInstances: [],
    healInstances: [{
      targetsType: ETargetTypes.LOWEST_ALLY,
      amount: 0.08,
    }]
  },
  PLAYLIST: {
    name: 'Playlist',
    price: 71,
    description: (damageInstances, owner?, healInstances?) => {
      let text = `Lance une bonne playlist qui encense ses alliés leur permettant de gagner <eff-deco effect="UP_AP" with-time></eff-deco>.`;
      const equipment = owner.equipment.find(e => e.name === EEquipment.MANETTE_XBOX.name);

      if(equipment.unlocked){
        text += `<br/><br/><strong class="equipment-effect">${equipment.description(damageInstances, owner, healInstances)}</strong>`;
      }

      return text;

    },
    cooldown: 1,
    damageInstances: [],
    effectInstances: [{
      targetsType: ETargetTypes.ALL_ALLIES,
      effect: EEffects.UP_AP,
    }],
    healInstances: []
  },
  TRAGO_SOCIAL: {
    name: 'Trago social',
    price: 93,
    description: (damageInstances, owner?, healInstances?) => {
      return `Propose un trago social à tous ses alliés, qui acceptent et récupèrent <strong class="heal">${Math.round(healInstances[0].amount * owner.health.max)} PV</strong>.`
    },
    cooldown: 3,
    damageInstances: [],
    effectInstances: [],
    healInstances: [{
      targetsType: ETargetTypes.ALL_ALLIES,
      amount: 0.05,
    }]
  },

  /* TIER 1 SPELLS */
  POLICE: {
    name: 'Police',
    price: 39,
    description: (damageInstances, owner?, healInstances?) => {
      return `Énervé par la présence d'autres personnes, ${owner.name} appelle la police.`
    },
    cooldown: 3,
    timer: 1,
    invocation: ($this) => {
      const invocation = new Actor('Policier', EClass.INVOCATION, false);
      invocation.stats$ = new Stats(6, 0, 42);
      invocation.health = new Health(15);
      invocation.spells.push(new SpellDescription(ESPells.BASIC));

      return [invocation];
    },
    damageInstances: [],
    effectInstances: [],
    healInstances: []
  },
  POELE: {
    name: 'Poêle',
    price: 18,
    description: (damageInstances, owner?, healInstances?) => {
      return `Assène un coup de poêle, une arme redoutable, infligeant  <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco>.`
    },
    cooldown: 1,
    timer: 0,
    damageInstances: [{
      targetsType: ETargetTypes.TARGET,
      damageType: EDamageType.PHYSIC,
      amount: 0.8
    }],
    effectInstances: [],
    healInstances: []
  },
  APPEL_IRRESISTIBLE: {
    name: 'Appel irresistible',
    price: 33,
    description: (damageInstances, owner?, healInstances?) => {
      return `On ne peut pas s'empêcher de prendre un verre. ${owner.name} gagne <eff-deco effect="TAUNT" with-time></eff-deco> et empoisonne la cible infligeant
      <eff-deco effect="POISON" with-time multiplier="${owner.stats.damageMultiplier}" power="${owner.stats.power}"></eff-deco>.`
    },
    cooldown: 1,
    timer: 0,
    damageInstances: [],
    effectInstances: [{
      targetsType: ETargetTypes.TARGET,
      effect: EEffects.POISON,
    },
      {
        targetsType: ETargetTypes.SELF,
        effect: EEffects.TAUNT,
      }],
    healInstances: []
  },
  APERO_MINUTE: {
    name: 'Apéro minute',
    price: 19,
    description: (damageInstances, owner?, healInstances?) => {
      return `Se voyant à peine rempli, ${owner.name} décide d'appeler ApéroMinute pour se soigner de <strong class="heal">${Math.round(healInstances[0].amount * owner.health.max)} PV</strong>.`
    },
    cooldown: 1,
    timer: 1,
    damageInstances: [],
    effectInstances: [],
    healInstances: [{
      targetsType: ETargetTypes.SELF,
      amount: 0.15,
    }]
  },
  DELTA: {
    name: 'Variant Delta',
    price: 42,
    description: (damageInstances, owner?, healInstances?) => {
      return `Contamine la cible et empoisonne la cible infligeant  <eff-deco effect="POISON" with-time multiplier="${owner.stats.damageMultiplier}" power="${owner.stats.power}"></eff-deco>. <br/> <br/> Si la cible est déjà empoissonée, invoque Vaccin.`
    },
    cooldown: 2,
    timer: 1,
    invocation: ($this) => {
      if (exists($this._combatActors.target.effects.find((e) => e.effect === EEffects.POISON))) {
        const invocation = new Actor('Vaccin', EClass.INVOCATION, false);
        invocation.stats$ = new Stats(6, 0, 38);
        invocation.health = new Health(50);
        invocation.spells.push(new SpellDescription(ESPells.BASIC));
        invocation.spells.push(new SpellDescription(ESPells.INJECTION));

        return [invocation];
      }

      return [];
    },
    damageInstances: [],
    effectInstances: [{
      targetsType: ETargetTypes.TARGET,
      effect: EEffects.POISON,
    }],
    healInstances: []
  },
  INJECTION: {
    name: '4ème dose',
    price: 42,
    description: (damageInstances, owner?, healInstances?) => {
      return `Injecte une énième dose de vaccin dans votre corps infligeant  <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco>
      et <eff-deco effect="STUN" with-time></eff-deco> <br/> <br/>
      Si la cible est déjà <strong class="effect-decorator">étourdit</strong>, invoque Covid.`
    },
    cooldown: 2,
    timer: 1,
    invocation: ($this) => {
      if (exists($this._combatActors.target.effects.find((e) => e.effect === EEffects.STUN))) {
        const invocation = new Actor('Covid', EClass.INVOCATION, false);
        invocation.stats$ = new Stats(6, 6, 32);
        invocation.health = new Health(36);
        invocation.spells.push(new SpellDescription(ESPells.BASIC));
        invocation.spells.push(new SpellDescription(ESPells.DELTA));

        return [invocation];
      }

      return [];
    },
    damageInstances: [{
      targetsType: ETargetTypes.TARGET,
      damageType: EDamageType.PHYSIC,
      amount: 0.5
    }],
    effectInstances: [{
      targetsType: ETargetTypes.TARGET,
      effect: EEffects.STUN
    }],
    healInstances: []
  },
  CRIS: {
    name: 'Cris stridents',
    price: 16,
    description: (damageInstances, owner?, healInstances?) => {
      return `Les enfants foutent un bordel monstre perçant les tympans de 2 enemis et infligeant  <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco>. <br/><br/>
      Les cibles perdent <eff-deco effect="DOWN_AD" with-time></eff-deco>.`
    },
    cooldown: 0,
    timer: 0,
    damageInstances: [{
      targetsType: ETargetTypes.RANDOM_ENEMY,
      targetsAmount: 2,
      damageType: EDamageType.PHYSIC,
      amount: 0.4
    }],
    effectInstances: [{
      targetsType: ETargetTypes.RANDOM_ENEMY,
      targetsAmount: 2,
      effect: EEffects.DOWN_AD
    }],
    healInstances: []
  },
  REPROCHE: {
    name: 'Reproche',
    price: 19,
    description: (damageInstances, owner?, healInstances?) => {
      return `La jalousie pousse ${owner.name} a faire un reproche mesquin à sa cible et gagne <eff-deco effect="UP_AD" with-time></eff-deco>. <br/><br>
      Si la cible a plus de points de vie, elle perd  <eff-deco effect="DOWN_AD" with-time></eff-deco>`
    },
    cooldown: 1,
    timer: 0,
    damageInstances: [],
    effectInstances: [{
      targetsType: ETargetTypes.SELF,
      effect: EEffects.UP_AD
    }, {
      targetsType: ETargetTypes.TARGET,
      effect: EEffects.DOWN_AD,
      condition: ($this) => {
        return $this.targets[0].health.current > $this._caster.health.current;
      }
    }],
    healInstances: []
  },
  MANAGER: {
    name: 'Manager',
    price: 21,
    description: (damageInstances, owner?, healInstances?) => {
      return `${owner.name} demande à voir le manager, pour se plainder, encore...  Sa cible subit <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco> <br/><br>
      Si la cible a moins de points de vie, elle subit <dmg-deco amount="${damageInstances[1].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco> supplémentaires`
    },
    cooldown: 0,
    timer: 0,
    damageInstances: [{
      targetsType: ETargetTypes.TARGET,
      damageType: EDamageType.PHYSIC,
      amount: 0.6
    }, {
      targetsType: ETargetTypes.TARGET,
      damageType: EDamageType.PHYSIC,
      amount: 0.6,
      condition: ($this) => {
        return $this.targets[0].health.current < $this._caster.health.current;
      }
    }],
    effectInstances: [],
    healInstances: []
  },
  INSULTE: {
    name: 'Insultes',
    price: 11,
    description: (damageInstances, owner?, healInstances?) => {
      return `"Ta mère c'est une pute" inflige  <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco> à 2 enemis. <br><br>
      Chaque fois que l'insulte est ratée, ${owner.name} subit les dégâts à la place.`
    },
    cooldown: 1,
    timer: 0,
    damageInstances: [{
      targetsType: ETargetTypes.RANDOM_ENEMY,
      targetsAmount: 2,
      damageType: EDamageType.PHYSIC,
      amount: 0.4,
      onMissed: ($this, damageInstance?) => {
        $this.createDamageInstances([{
          targetsType: $this._caster,
          damageType: EDamageType.PHYSIC,
          amount: 0.6,
        }]);
      }
    }],
    effectInstances: [],
    healInstances: []
  },
  HEURES_SUPP: {
    name: 'Heures supp',
    price: 13,
    description: (damageInstances, owner?, healInstances?) => {
      return `Après un appel inconfortable, les heures supplémentaires infligent  <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco> à l'interlocuteur. <br><br>
      La cible est <eff-deco effect="STUN" with-time></eff-deco> si le coup est critique, sinon ${owner.name} gagne <eff-deco effect="UP_CRIT" with-time></eff-deco>.`
    },
    cooldown: 0,
    timer: 0,
    damageInstances: [{
      targetsType: ETargetTypes.TARGET,
      damageType: EDamageType.PHYSIC,
      amount: 0.4
    }],
    effectInstances: [{
      targetsType: ETargetTypes.TARGET,
      effect: EEffects.STUN,
      condition: ($this) => {
        if ($this.damages[0].status === EAttackStatus.CRITICAL) {
          return true;
        }
        return false;
      }
    }, {
      targetsType: ETargetTypes.SELF,
      effect: EEffects.UP_CRIT,
      condition: ($this) => {
        if ($this.damages[0].status !== EAttackStatus.CRITICAL) {
          return true;
        }
        return false;
      }
    }],
    healInstances: []
  },

  /* VIRGINIE */
  MOBY_DICK: {
    name: 'Moby dick',
    price: 0,
    description: (damageInstances, owner?, healInstances?) => {
      return `Virginie gonfle et gagne <eff-deco effect="UP_AD" with-time></eff-deco>. <br/><br/>
      Ensuite, sous son poids, elle roule tel un ballon sur les adversaires, leur infligeant  <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco>.
      Si Kevin est touché, il est <eff-deco effect="STUN" with-time></eff-deco>.`
    },
    cooldown: 1,
    timer: 0,
    damageInstances: [{
      targetsType: ETargetTypes.ALL_ENEMIES,
      damageType: EDamageType.PHYSIC,
      amount: 1,
      onHit: ($this, damageInstance?) => {
        if (damageInstance.target.name === EHero.KEVIN) {
          $this.createEffectInstances([{
            targetsType: damageInstance.target,
            effect: EEffects.STUN
          }]);
        }
      }
    }],
    effectInstances: [{
      targetsType: ETargetTypes.SELF,
      effect: EEffects.UP_AD,
    }],
    healInstances: []
  },
  HAMBURGER: {
    name: 'Hamburger',
    price: 0,
    description: (damageInstances, owner?, healInstances?) => {
      return `Virginie mange un énorme hamburger, ce qui lui permet de se soigner de <strong class="heal">${Math.round(healInstances[0].amount * owner.health.max)} PV</strong>.`
    },
    cooldown: 1,
    damageInstances: [],
    effectInstances: [],
    healInstances: [{
      targetsType: ETargetTypes.SELF,
      amount: 0.15,
    }]
  },

  /* SANDIE */
  INTERDICTION_SORTIE: {
    name: 'Interdiction de sortie',
    price: 0,
    description: (damageInstances, owner?, healInstances?) => {
      return `Interdit 2 enemis de sortir leur infligeant <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.power * owner.stats.damageMultiplier}" type="magical"></dmg-deco> et a une chance qu'ils soient
      <eff-deco effect="STUN" with-time></eff-deco>. <br><br/>
      Si l'un des enemis est Quentin, lui inflige <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.power * owner.stats.damageMultiplier}" type="magical"></dmg-deco> supplémentaires`
    },
    cooldown: 2,
    timer: 0,
    damageInstances: [{
      targetsType: ETargetTypes.RANDOM_ENEMY,
      targetsAmount: 2,
      damageType: EDamageType.MAGIC,
      amount: 1,
      onHit: ($this, damageInstance?) => {
        if (damageInstance.target.name === EHero.QUENTIN) {
          $this.createDamageInstances([{
            targetsType: damageInstance.target,
            damageType: EDamageType.MAGIC,
            amount: 1,
          }]);
        }
        if (dice(50)) {
          $this.createEffectInstances([{
            targetsType: damageInstance.target,
            effect: EEffects.STUN
          }]);
        }
      }
    }],
    effectInstances: [],
    healInstances: []
  },
  TROMPERIE: {
    name: 'Tromperie',
    price: 0,
    description: (damageInstances, owner?, healInstances?) => {
      return `Sandie va voir ailleurs et revient avec un puissant amant.`
    },
    cooldown: 3,
    invocation: ($this) => {
      const inv = new Actor('Amant', EClass.INVOCATION, false);
      inv.stats$ = new Stats(8, 0, 28);
      inv.health = new Health(95);
      inv.spells.push(new SpellDescription(ESPells.BASIC));
      inv.spells.push(new SpellDescription(ESPells.REPROCHE));

      return [inv];
    },
    damageInstances: [],
    effectInstances: [],
    healInstances: []
  },

  /* IVOIRIEN */
  FAKE_PHOTO: {
    name: 'Fausse photo',
    price: 0,
    description: (damageInstances, owner?, healInstances?) => {
      return `Envoie une fausse photo extrêmement réaliste, infligeant  <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco> à 4 enemis.<br/><br/>
      Si Costy est touché, il est <eff-deco effect="STUN" with-time></eff-deco>.`
    },
    cooldown: 2,
    timer: 0,
    damageInstances: [{
      targetsType: ETargetTypes.RANDOM_ENEMY,
      damageType: EDamageType.PHYSIC,
      amount: 0.8,
      targetsAmount: 4,
      onHit: ($this: SpellCast, damage: Damage) => {
        if (damage.target.name === EHero.COSTY) {
          $this.createEffectInstances([{
            targetsType: damage.target,
            effect: EEffects.STUN
          }]);
        }
      }
    }],
    effectInstances: [],
    healInstances: []
  },
  SMILEY_COEUR: {
    name: 'Smiley coeur',
    price: 0,
    description: (damageInstances, owner?, healInstances?) => {
      return `Un sms est envoyé contenu un nombre incalculable de coeurs. Les destinataires perdent <eff-deco effect="DOWN_AP" with-time></eff-deco>`
    },
    cooldown: 1,
    timer: 0,
    damageInstances: [],
    effectInstances: [{
      targetsType: ETargetTypes.RANDOM_ENEMY,
      targetsAmount: 3,
      effect: EEffects.DOWN_AP
    }],
    healInstances: []
  },


  /* MILOU */
  CLONE: {
    name: 'Clone',
    price: 0,
    description: (damageInstances, owner?, healInstances?) => {
      return `Tente de créer l'alter égo d'Adrien et inflige <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco> à tous les enemis. <br/> <br/>
      Si Adrien est dans la partie, le clonage réussi.`
    },
    cooldown: 3,
    timer: 0,
    invocation: ($this) => {
      if ($this._combatActors.enemies.some((a) => a.name === EHero.ADRIEN)) {
        const alterego = new Actor('Alter-égo', EClass.INVOCATION, false);
        const adrien = $this._combatActors.enemies.find((a) => a.name === EHero.ADRIEN);

        alterego.stats$ = new Stats(4, 0, 32);
        alterego.health = new Health(36);
        alterego.spells = adrien.spells;

        return [alterego];
      }
    },
    damageInstances: [{
      targetsType: ETargetTypes.ALL_ENEMIES,
      damageType: EDamageType.PHYSIC,
      amount: 0.8
    }],
    effectInstances: [],
    healInstances: []
  },
  PROTECTION: {
    name: 'Protection',
    price: 0,
    description: (damageInstances, owner?, healInstances?) => {
      return `${owner.name} gagne <eff-deco effect="TAUNT" with-time></eff-deco>.`
    },
    cooldown: 1,
    timer: 0,
    damageInstances: [],
    effectInstances: [
      {
        targetsType: ETargetTypes.SELF,
        effect: EEffects.TAUNT,
      }],
    healInstances: []
  },


  /* MARIE */
  SEX_ADDICT: {
    name: 'Sex addict',
    price: 0,
    description: (damageInstances, owner?, healInstances?) => {
      return `Cherche Clément pour une nuit de folie. Si elle le trouve, Clément perd tous effets actuellement en cours.<br/> <br/>
      Le sexe lui permet de récupèrer <strong class="heal">${Math.round(healInstances[0].amount * owner.health.max)} PV</strong>.`
    },
    cooldown: 1,
    timer: 0,
    damageInstances: [],
    effectInstances: [],
    healInstances: [{
      targetsType: ETargetTypes.SELF,
      amount: 0.1
    }],
    onSpellCast: ($this) => {
      if ($this._combatActors.enemies.some((a) => a.name === EHero.CLEMENT)) {
        const clement = $this._combatActors.enemies.find((a) => a.name === EHero.CLEMENT);
        clement.effects = [];
      }
    }
  },
  MYTHO: {
    name: 'Mytho',
    price: 0,
    description: (damageInstances, owner?, healInstances?) => {
      return `${owner.name} raconte un énième mytho à 2 de ses adversaires infligeant <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco>. <br/><br/>
      Si la cible tente d'éviter le mytho, elle subit le double.`
    },
    cooldown: 2,
    timer: 0,
    damageInstances: [{
      targetsType: ETargetTypes.RANDOM_ENEMY,
      targetsAmount: 2,
      damageType: EDamageType.PHYSIC,
      amount: 1.4,
      onMissed: ($this, damageInstance?) => {
        $this.createDamageInstances([{
          targetsType: damageInstance.target,
          damageType: EDamageType.PHYSIC,
          amount: 2.8,
        }]);
      }
    }],
    effectInstances: [],
    healInstances: []
  },

  /* ALBERGE */
  CHEVEUX: {
    name: 'Poignée de cheveux',
    price: 0,
    description: (damageInstances, owner?, healInstances?) => {
      return `Tente de convertir sa cible en Front lisse et lui arrache une poignée de cheveux et inflige <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco>  >br/><br/>
      Si la cible est Loïc, inflige <dmg-deco amount="${damageInstances[1].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco> supplémentaires.`
    },
    cooldown: 2,
    timer: 0,
    damageInstances: [{
      targetsType: ETargetTypes.TARGET,
      damageType: EDamageType.PHYSIC,
      amount: 2
    },{
      targetsType: ETargetTypes.TARGET,
      damageType: EDamageType.PHYSIC,
      amount: 2,
      condition: ($this) => {
        console.log($this._combatActors.target.name === 'Loic')
        return $this._combatActors.target.name === 'Loic';
      },
    }],
    effectInstances: [],
    healInstances: []
  },
  CARTABLE_VIDE: {
    name: 'Cartable vidée',
    price: 0,
    description: (damageInstances, owner?, healInstances?) => {
      return `Mme Alberge prend un cartable et le vide violemment. La sensation de pouvoir ressentie lui permet de se soigner de <strong class="heal">${Math.round(healInstances[0].amount * owner.health.max)} PV</strong>
      et de gagner <eff-deco effect="UP_AD" with-time></eff-deco>.`
    },
    cooldown: 1,
    timer: 1,
    damageInstances: [],
    effectInstances: [{
      targetsType: ETargetTypes.SELF,
      effect: EEffects.UP_AD
    }],
    healInstances: [{
      targetsType: ETargetTypes.SELF,
      amount: 0.15,
    }]
  },

  /* FRANCIS LALANE */
  COURSE_TRACTEUR: {
    name: 'Course de tracteur',
    price: 0,
    description: (damageInstances, owner?, healInstances?) => {
      return `Francis Lalane prend son tracteur et poursuit ses adversaires infligeant <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco> à 3 enemis`
    },
    cooldown: 2,
    timer: 0,
    damageInstances: [{
      targetsType: ETargetTypes.RANDOM_ENEMY,
      targetsAmount: 3,
      damageType: EDamageType.PHYSIC,
      amount: 1
    }],
    effectInstances: [],
    healInstances: []
  },
  RUGISSEMENT: {
    name: 'Rugissment',
    price: 0,
    description: (damageInstances, owner?, healInstances?) => {
      return `Gueule tellement fort que les enemis perdent <eff-deco effect="DOWN_AD" with-time></eff-deco> alors que lui gagne <eff-deco effect="UP_AD" with-time></eff-deco>.`
    },
    cooldown: 1,
    timer: 1,
    damageInstances: [],
    effectInstances: [{
      targetsType: ETargetTypes.ALL_ENEMIES,
      effect: EEffects.DOWN_AD,
    },{
      targetsType: ETargetTypes.SELF,
      effect: EEffects.UP_AD,
    }],
    healInstances: []
  },
  GAME_OF_THRONES: {
    name: 'Jeux de pouvoir',
    price: 0,
    description: (damageInstances, owner?, healInstances?) => {
      return `Francis Lalane tente de convaincre la mairie de lui donner plus de pouvoirs. Il invoque trois conseillers municipaux.`
    },
    cooldown: 3,
    timer: 0,
    invocation: ($this) => {
      let inv = [];

      for(let i of Array(3)) {
        const actor = new Actor('Conseiller municipal', EClass.INVOCATION, false);
        actor.stats$ = new Stats(10, 0, 32);
        actor.health = new Health(80);
        actor.spells.push(new SpellDescription(ESPells.BASIC));
        actor.spells.push(new SpellDescription(ESPells.PROTECTION));

        inv.push(actor);
      }

      return inv;
    },
    damageInstances: [],
    effectInstances: [],
    healInstances: []
  },



  TEMPLATE: {
    // Name displayed in UI
    name: 'TEMPLATE',
    price: 0,

    // Injected html description displayed in UI
    description: (damageInstances, owner?, healInstances?) => {
      return `
      PHYSICAL :  <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.attack * owner.stats.damageMultiplier}" type="physical"></dmg-deco>
      MAGICAL : <dmg-deco amount="${damageInstances[0].amount}" stat="${owner.stats.power * owner.stats.damageMultiplier}" type="magical"></dmg-deco>
      ***** -> If multiple instances of damage, just change the 0 to the wanted damage instance index

      EFFECT : <eff-deco effect="STUN" with-time></eff-deco>
      ***** -> attribute with time will add the number of turns the effect will last
      ***** -> add attribute "power" with the caster power value if the effect is a DOT (like poison)

      HEAL : <strong class="heal">${Math.round(healInstances[0].amount * owner.health.max)} PV</strong>`
    },

    // How much turns needed to reload the spell
    cooldown: 1,

    // Initial timer of the spell, 0 will make the spell available at the start of the combat
    timer: 1,

    // $this is the spell cast instance (check the spell cast interface to see what properties you can use)
    // Invocation must return an array of IEntityActor
    invocation: ($this) => {
      const inv = new Actor('Amant', EClass.INVOCATION, false);
      inv.stats$ = new Stats(8, 0, 28);
      inv.health = new Health(30);
      inv.spells.push(new SpellDescription(ESPells.BASIC));
      inv.spells.push(new SpellDescription(ESPells.REPROCHE));

      return [inv];
    },

    // You can create as many damage instance as you like, you can also use the OnMissed and OnHit self explanatory callback functions
    // Amount property takes the ATTACK stat for Physical damage and POWER stat for magical, it's a % of it (1 = 100% of the attack or power)
    // Define a targetsAmount when chosing a RANDOM_ENEMIES or RANDOM_ALLIES target type
    damageInstances: [{
      targetsType: ETargetTypes.ALL_ALLIES,
      damageType: EDamageType.MAGIC,
      amount: 0,
      targetsAmount: 0,
      condition: ($this: SpellCast) => {
      },
      onMissed: ($this: SpellCast, damage: Damage) => {
      },
      onHit: ($this: SpellCast, damage: Damage) => {
      },
    }],

    // You can create as many effect instance as you like
    // Define a targetsAmount when chosing a RANDOM_ENEMIES or RANDOM_ALLIES target type
    effectInstances: [{
      targetsType: ETargetTypes.ALL_ALLIES,
      effect: EEffects.POISON,
      targetsAmount: 0,
      condition: ($this: SpellCast) => {
      }
    }],

    // You can create as many effect instance as you like
    // Amount is the % of max health of the caster
    healInstances: [{
      targetsType: ETargetTypes.SELF,
      amount: 0,
    }]
  },
}
