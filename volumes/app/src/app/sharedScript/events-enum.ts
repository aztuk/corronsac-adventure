import { Effects } from './../object/system/effects';
import { ESPells } from './spells-enum';
import { IEvent, IEntityActor } from './interfaces';
import { EnemiesService } from '../services/enemies.service';
import {Damage} from '../object/system/damage';
import {SpellDescription} from '../object/components/spell-description';
import {Health} from '../object/components/health';
import {Stats} from '../object/components/stats';
import {Actor} from '../object/entities/actor';
import {EAttackStatus, EClass, EDamageType, EEffects, EHero, ETargetTypes} from './enums';
import {dice} from './helpers';
import {SpellCast} from '../object/system/spellCast';
import { EEquipment } from './equipment-enum';
import { ShopService } from '../services/shop.service';
import { CharactersService } from '../services/characters.service';

/* AJOUTER UN EFFECT :
  - Tooltip effect description
  - actor entity compute stats
  - get buff value in effect system
  - add icon / display in effects list
*/

export const EVENTS: IEvent[] = [

  /* EVENTS DE CLEMENT */
  {
  owners: [EHero.CLEMENT],
  title: 'Beauty Sané',
  description: 'Clément se permet de prendre une petite collation avant de continuer l\'aventure. Choisissez votre mixture:',
  condition: (actors, $this) => {
    return actors.some(a => $this.owners.some(owner => owner === a.name));
  },
  choices: [
    {
      name: `Soupe indienne`,
      text: () => {
        return `Clément est soigné à 100%`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        const actor = characters.getCharacterByName(EHero.CLEMENT);
        actor.health.heal(1000);
      }
    },{
      name: `Collagène marin`,
      text: () => {
        return `Clément gagne 10 points de vie maximum`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        const actor = characters.getCharacterByName(EHero.CLEMENT);
        actor.health.heal(10);
        actor.health.max+=10;
      }
    },{
      name: `Vitamines D3`,
      text: () => {
        return `Clément apprend Entraînement
        mais perd 30% points de vie`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        const actor = characters.getCharacterByName(EHero.CLEMENT);
        actor.spells.find(s => s.name === ESPells.TRAINING.name).unlocked = true;
        actor.health.current = Math.round(actor.health.current * 0.66);
      },
      condition: (actors) => {
        const actor = actors.getCharacterByName(EHero.CLEMENT);
        return !actor.hasSpell(ESPells.TRAINING);
      }
    }
  ]
},

{
  owners: [EHero.CLEMENT],
  title: 'Match important',
  description: 'La coupe de France a commencé, un match important pour Clément s\'annonce.',
  condition: (actors, $this) => {
    return actors.some(a => $this.owners.some(owner => owner === a.name));
  },
  choices: [
    {
      name: `Jouer le match`,
      text: () => {
        return `Clément perd 10 points de vie max. Vous gagnez 80 euros.`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        const actor = characters.getCharacterByName(EHero.CLEMENT);
        actor.health.hurt(10);
        actor.health.max-=10;
        currency.addCurrency(80);
      },
      condition: (actors, currency) => {
        return actors.getCharacterByName(EHero.CLEMENT).health.current > 10;
      }
    },{
      name: `Inventer une excuse`,
      text: () => {
        return `Clément gagne 10 points de vie max. Vous perdez 80 euros.`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        const actor = characters.getCharacterByName(EHero.CLEMENT);
        actor.health.heal(10);
        actor.health.max+=10;
        currency.removeCurrency(80);
      },
      condition: (actors, currency) => {
        return currency.hasEnough(80);
      }
    },{
      name: `Inviter les amis à voir le match`,
      text: () => {
        return `Rien ne se passe`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
      }
    }
  ]
},

/* EVENTS DE COSTY */
{
  owners: [EHero.COSTY],
  title: 'Partie Blitz',
  description: 'Costy lance une partie Blitz sur son téléphone.',
  condition: (actors, $this) => {
    return actors.some(a => $this.owners.some(owner => owner === a.name));
  },
  choices: [
    {
      name: `Ouverture Queens Gambit`,
      text: () => {
        return `Costy apprend Noob mais perd 30% points de vie`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        const actor = characters.getCharacterByName(EHero.COSTY);
        actor.spells.find(s => s.name === ESPells.NOOB.name).unlocked = true;
        actor.health.current = Math.round(actor.health.current * 0.66);
      },
      condition: (actors) => {
        const actor = actors.getCharacterByName(EHero.COSTY);
        return !actor.hasSpell(ESPells.NOOB);
      }
    },{
      name: `Ouverture Londonienne`,
      text: () => {
        return `Costy gagne 10% d'esquive mais perd 3 attaque`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        const actor = characters.getCharacterByName(EHero.COSTY);
        actor.stats$.dodge+=10;
        actor.stats$.attack-=3;
      }
    },{
      name: `Ouverture Ruy Lopez`,
      text: () => {
        return `Costy gagne 5 d'attaque mais perd 5% esquive`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        const actor = characters.getCharacterByName(EHero.COSTY);
        actor.stats$.dodge-=5;
        actor.stats$.attack+=5;
      }
    }
  ]
},
{
  owners: [EHero.COSTY],
  title: 'Message privé',
  description: 'Costy envoie un message privé à un de ses amis pour lui demander de rejoindre l\'aventure.',
  condition: (actors, $this) => {
    return actors.some(a => $this.owners.some(owner => owner === a.name)) && actors.length < 6;
  },
  choices: [
    {
      name: `"Un p'tit Lol?"`,
      text: () => {
        return `Demande à Quentin de rejoindre le groupe`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        characters.addCharacter(EHero.QUENTIN);
      },
      condition: (actors) => {
        return !actors.isInParty(EHero.QUENTIN);
      }
    },{
      name: `Chaud pour un dévers?`,
      text: () => {
        return `Demande à Adrien de rejoindre le groupe`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        characters.addCharacter(EHero.ADRIEN);
      },
      condition: (actors) => {
        return !actors.isInParty(EHero.ADRIEN);
      }
    },{
      name: `On se rejoint à Intermarché?`,
      text: () => {
        return `Demande à Loïc de rejoindre le groupe`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        characters.addCharacter(EHero.LOIC);
      },
      condition: (actors) => {
        return !actors.isInParty(EHero.LOIC);
      }
    },{
      name: `Thauvin est là, tu viens?`,
      text: () => {
        return `Demande à Kevin de rejoindre le groupe`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        characters.addCharacter(EHero.KEVIN);
      },
      condition: (actors) => {
        return !actors.isInParty(EHero.KEVIN);
      }
    },{
      name: `Oui Clément, je suis toujours célibataire....`,
      text: () => {
        return `Demande à Clément de rejoindre le groupe`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        characters.addCharacter(EHero.CLEMENT);
      },
      condition: (actors) => {
        return !actors.isInParty(EHero.CLEMENT);
      }
    },{
      name: `Ranger son téléphone`,
      text: () => {
        return `Rien ne se passe`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
      }
    }
  ]
},

/* EVENTS DE KEVIN */
{
  owners: [EHero.KEVIN],
  title: 'Jam musical',
  description: 'Kevin passe une bonne soirée à préparer une musique à faire écouter aux copains.',
  condition: (actors, $this) => {
    return actors.some(a => $this.owners.some(owner => owner === a.name));
  },
  choices: [
    {
      name: `Rap`,
      text: () => {
        return `Tous le monde gagne 7 PV Max`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        characters.characters.forEach(c=> {
          c.health.heal(7);
          c.health.max += 7;
        });
      }
    },{
      name: `Electro`,
      text: () => {
        return `Tout le monde gagne 3 attaque`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        characters.characters.forEach(c=> {
          c.stats$.attack +=3;
        });
      }
    },{
      name: `Chill`,
      text: () => {
        return `Tout le monde gagne 3 puissances`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        characters.characters.forEach(c => {
          c.stats$.power +=3;
        });
      }
    }
  ]
},{
  owners: [EHero.KEVIN],
  title: 'Barbecue',
  description: 'Kevin invite tout le monde à un barbecue chez lui. Le long trajet et les projets d\'alcolémie pousse à faire des choix.',
  condition: (actors, $this) => {
    return actors.some(a => $this.owners.some(owner => owner === a.name));
  },
  choices: [
    {
      name: `Dormir sur place`,
      text: () => {
        return `Kevin gagne 5 puissance mais vous perdez 80 euros`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        currency.removeCurrency(80);

        const actor = characters.getCharacterByName(EHero.KEVIN);
        actor.stats$.power +=5;
      },
      condition: (actors, currency) => {
        return currency.hasEnough(80);
      }
    },{
      name: `Rentrer quand même`,
      text: () => {
        return `Vous gagnez 80 euros mais tout le monde perd 15 PV`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        currency.addCurrency(80);
        characters.characters.forEach(c=> {
          c.health.hurt(15);
        });
      }
    },{
      name: `Ne pas y aller`,
      text: () => {
        return `Rien ne se passe`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
      }
    }
  ]
},

/* EVENTS DE ADRIEN */
{
  owners: [EHero.ADRIEN],
  title: 'Venue bimensuelle',
  description: 'Adrien vient sur la région et une soirée s\'organise, l\'occasion de récupérer certains aventuriers perdus au combat.',
  condition: (actors, $this) => {
    return actors.some(a => $this.owners.some(owner => owner === a.name));
  },
  choices: [
    {
      name: `Prévenir tout le monde`,
      text: () => {
        return `Réanime tous les personnages mort pour 220 euros`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        const actors = characters.getDeadActors();
        actors.forEach(a => a.health.ressucitate())
        currency.removeCurrency(220);
      },
      condition: (actors, currency) => {
        return currency.hasEnough(220) && actors.getDeadActors().length > 0;
      }

    },{
      name: `Prévenir personne`,
      text: () => {
        return `Le trajet vous coûte quand même 30 euros`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        currency.removeCurrency(30);
      }
    }
  ]
},{
  owners: [EHero.ADRIEN],
  title: 'Clients nombreux',
  description: 'Les affaires de Adrien vont bon train et beaucoup de clients sonnent à la porte.',
  condition: (actors, $this) => {
    return actors.some(a => $this.owners.some(owner => owner === a.name));
  },
  choices: [
    {
      name: `Accepter tous les projets`,
      text: () => {
        return `Vous gagnez 150 euros mais Adrien perd 10 PV max`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        const actor = characters.getCharacterByName(EHero.ADRIEN);
        actor.health.max -= 10;
        if(actor.health.current > actor.health.max) {
          actor.health.current = actor.health.max;
        }
        currency.addCurrency(150);
      },
    },{
      name: `Accepter juste une partie`,
      text: () => {
        return `Vous gagnez 70 euros mais Adrien perd 30% de ses PV actuels`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        const actor = characters.getCharacterByName(EHero.ADRIEN);
        actor.health.current = actor.health.current * 0.3;
        currency.addCurrency(70);
      }
    },{
      name: `En accepter aucun`,
      text: () => {
        return `Rien ne se passe`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
      }
    }
  ]
},

/* EVENTS DE LOIC */
{
  owners: [EHero.LOIC],
  title: 'Fête forraine',
  description: 'Une fête forraine a lieu dans les environs, Loïc décide de s\'y rendre.',
  condition: (actors, $this) => {
    return actors.some(a => $this.owners.some(owner => owner === a.name));
  },
  choices: [
    {
      name: `Punchin-ball`,
      text: () => {
        return `Loic apprend Tête la première mais vous perdez 80 euros`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        const actor = characters.getCharacterByName(EHero.LOIC);
        actor.spells.find(s => s.name === ESPells.TETE_PREMIERE.name).unlocked = true;
        currency.removeCurrency(80);
      },
      condition: (actors, currency) => {
        return currency.hasEnough(80) && !actors.getCharacterByName(EHero.LOIC).hasSpell(ESPells.TETE_PREMIERE);
      }

    },{
      name: `Buvette`,
      text: () => {
        return `Loic apprend Discussion Insensée mais vous perdez 60 euros`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        const actor = characters.getCharacterByName(EHero.LOIC);
        actor.spells.find(s => s.name === ESPells.DISCUSSION_INSENSEE.name).unlocked = true;
        currency.removeCurrency(60);
      },
      condition: (actors, currency) => {
        return currency.hasEnough(60) && !actors.getCharacterByName(EHero.LOIC).hasSpell(ESPells.DISCUSSION_INSENSEE);
      }
    },{
      name: `Annuler la soirée`,
      text: () => {
        return `Rien ne se passe`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
      }
    }
  ]
},{
  owners: [EHero.LOIC],
  title: 'Je vous aime !',
  description: 'Loïc boit trop et atteint un stade de son alcolémie où il propage son amour à son entourage.',
  condition: (actors, $this) => {
    return actors.some(a => $this.owners.some(owner => owner === a.name));
  },
  choices: [
    {
      name: `Stade 3`,
      text: () => {
        return `Tout le monde est soigné à 100% mais Loic perd 40% de ses PV`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        characters.characters.filter(c => c.name !== EHero.LOIC).forEach(c => c.health.heal(1000));
        characters.getCharacterByName(EHero.LOIC).health.current *= 0.4;
      }
    },{
      name: `Stade 2`,
      text: () => {
        return `Tout le monde est soigné de 20 PV mais Loic perd 20% de ses PV`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        characters.characters.filter(c => c.name !== EHero.LOIC).forEach(c => c.health.heal(20));
        characters.getCharacterByName(EHero.LOIC).health.current *= 0.8;
      }
    },{
      name: `Stade 1`,
      text: () => {
        return `Tout le monde est soigné de 10 PV, même Loic`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        characters.characters.forEach(c => c.health.heal(10));
      }
    }
  ]
},

/* EVENTS DE QUENTIN */
{
  owners: [EHero.QUENTIN],
  title: 'Pandémie mondiale',
  description: 'Une pandémie se répand dans le monde, ce qui donne lieu à d\'intéressantes discussion.',
  condition: (actors, $this) => {
    return actors.some(a => $this.owners.some(owner => owner === a.name));
  },
  choices: [
    {
      name: `Débat entre amis`,
      text: () => {
        return `Quentin apprend Débat politique. Tout le monde démarre le prochain combat avec Poison`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        const actor = characters.getCharacterByName(EHero.QUENTIN);
        actor.spells.find(s => s.name === ESPells.DEBAT_POLITIQUE.name).unlocked = true;
        characters.characters.forEach(c => {
          new Effects(actor, c, EEffects.POISON);
        });
      },
      condition: (actors, currency) => {
        return !actors.getCharacterByName(EHero.QUENTIN).hasSpell(ESPells.DEBAT_POLITIQUE);
      }
    },{
      name: `Débat en famille`,
      text: () => {
        return `Quentin apprend Fuite. Tout le monde démarre le prochain combat avec Poison`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        const actor = characters.getCharacterByName(EHero.QUENTIN);
        actor.spells.find(s => s.name === ESPells.FUITE.name).unlocked = true;
        characters.characters.forEach(c => new Effects(actor, c, EEffects.POISON));
      },
      condition: (actors, currency) => {
        return !actors.getCharacterByName(EHero.QUENTIN).hasSpell(ESPells.FUITE);
      }
    },{
      name: `Jouons plutôt`,
      text: () => {
        return `Quentin apprend Smart Life. Tout le monde démarre le prochain combat avec Poison`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        const actor = characters.getCharacterByName(EHero.QUENTIN);
        actor.spells.find(s => s.name === ESPells.SMART_LIFE.name).unlocked = true;
        characters.characters.forEach(c => new Effects(actor, c, EEffects.POISON));
      },
      condition: (actors, currency) => {
        return !actors.getCharacterByName(EHero.QUENTIN).hasSpell(ESPells.SMART_LIFE);
      }
    },{
      name: `Se taire`,
      text: () => {
        return `Rien ne se passe`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
      }
    }
  ]
},
{
  owners: [EHero.QUENTIN],
  title: 'Fête de famille',
  description: 'Une fête de famille s\'organise chez les Gillon. Ca sent l\'alcool jusque la mairie.',
  condition: (actors, $this) => {
    return actors.some(a => $this.owners.some(owner => owner === a.name));
  },
  choices: [
    {
      name: `Rester jusqu'à l'aube`,
      text: () => {
        return `Quentin gagne 5 AP mais perdez 20 PV.`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        const actor = characters.getCharacterByName(EHero.QUENTIN);
        actor.stats$.power += 5;
        actor.health.hurt(20);
      },
      condition: (actors) => {
        return !actors.getCharacterByName(EHero.QUENTIN).health.isDead;
      }
    },{
      name: `Se coucher tôt`,
      text: () => {
        return `Quentin récupère 20 PV`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        const actor = characters.getCharacterByName(EHero.QUENTIN);
        actor.health.heal(20);
      },
      condition: (actors) => {
        return !actors.getCharacterByName(EHero.QUENTIN).health.isDead;
      }
    },{
      name: `Ne pas y aller`,
      text: () => {
        return `Rien ne se passe`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
      }
    }
  ]
},
{
  owners: [EHero.QUENTIN,EHero.ADRIEN,EHero.CLEMENT,EHero.COSTY,EHero.LOIC,EHero.KEVIN,],
  title: 'Souvenirs',
  description: 'Les souvenirs des aventuriers tombés au combat sont évoqué lors d\'une soirée, vous pouvez réanimer un mort.',
  condition: (actors, $this) => {
    return actors.some(a => $this.owners.some(owner => owner === a.name) && a.health.isDead);
  },
  choices: [
    {
      name: `40 minutes`,
      text: () => {
        return `Réanimer Quentin`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        characters.getCharacterByName(EHero.QUENTIN).health.ressucitate();
      },
      condition: (actors) => {
        return actors.isInParty(EHero.QUENTIN) && actors.getCharacterByName(EHero.QUENTIN).health.isDead;
      }
    },{
      name: `Oiseau fusillé`,
      text: () => {
        return `Réanimer Adrien`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        characters.getCharacterByName(EHero.ADRIEN).health.ressucitate();
      },
      condition: (actors) => {
        return actors.isInParty(EHero.ADRIEN) && actors.getCharacterByName(EHero.ADRIEN).health.isDead;
      }
    },{
      name: `Internat`,
      text: () => {
        return `Réanimer Loïc`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        characters.getCharacterByName(EHero.LOIC).health.ressucitate();
      },
      condition: (actors) => {
        return actors.isInParty(EHero.LOIC) && actors.getCharacterByName(EHero.LOIC).health.isDead;
      }
    },{
      name: `Caméra whisky`,
      text: () => {
        return `Réanimer Kevin`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        characters.getCharacterByName(EHero.KEVIN).health.ressucitate();
      },
      condition: (actors) => {
        return actors.isInParty(EHero.KEVIN) && actors.getCharacterByName(EHero.KEVIN).health.isDead;
      }
    },{
      name: `La bougie`,
      text: () => {
        return `Réanimer Clément`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        characters.getCharacterByName(EHero.CLEMENT).health.ressucitate();
      },
      condition: (actors) => {
        return actors.isInParty(EHero.CLEMENT) && actors.getCharacterByName(EHero.CLEMENT).health.isDead;
      }
    },{
      name: `Fin de pandémie`,
      text: () => {
        return `Réanimer Costy`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        characters.getCharacterByName(EHero.COSTY).health.ressucitate();
      },
      condition: (actors) => {
        return actors.isInParty(EHero.COSTY) && actors.getCharacterByName(EHero.COSTY).health.isDead;
      }
    },{
      name: `Rien à dire`,
      text: () => {
        return `Rien ne se passe`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
      }
    }
  ]
},
{
  owners: [EHero.QUENTIN],
  title: 'Jet de dé',
  description: 'Vous rencontrez un joueur qui vous offre la possibilité de gagner un équipement en jouant au dé.',
  condition: (actors, $this) => {
    return actors.some(a => $this.owners.some(owner => owner === a.name));
  },
  choices: [
    {
      name: `Discord`,
      text: () => {
        return `50% de chance de gagner l'équipement Discord.`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        if(dice(50)) {
          const actor = characters.getCharacterByName(EHero.QUENTIN);
          actor.getEquipment(EEquipment.DISCORD).giveEquipmentTo(actor);
        }
      },
      condition: (actors) => {
        return !actors.getCharacterByName(EHero.QUENTIN).hasEquipment(EEquipment.DISCORD);
      }
    },{
      name: `Risk`,
      text: () => {
        return `50% de chance de gagner l'équipement Risk`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        if(dice(50)) {
          const actor = characters.getCharacterByName(EHero.QUENTIN);
          actor.getEquipment(EEquipment.EXTENSION_SMARTLIFE).giveEquipmentTo(actor);
        }
      },
      condition: (actors) => {
        return !actors.getCharacterByName(EHero.QUENTIN).hasEquipment(EEquipment.EXTENSION_SMARTLIFE);
      }
    },{
      name: `Ne pas y aller`,
      text: () => {
        return `Rien ne se passe`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
      }
    }
  ]
},
{
  owners: [EHero.CLEMENT],
  title: 'Jet de dé',
  description: 'Vous rencontrez un joueur qui vous offre la possibilité de gagner un équipement en jouant au dé.',
  condition: (actors, $this) => {
    return actors.some(a => $this.owners.some(owner => owner === a.name));
  },
  choices: [
    {
      name: `Protège tibia`,
      text: () => {
        return `50% de chance de gagner l'équipement Protège tibia.`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        if(dice(50)) {
          const actor = characters.getCharacterByName(EHero.CLEMENT);
          actor.getEquipment(EEquipment.PROTEGE_TIBIA).giveEquipmentTo(actor);
        }
      },
      condition: (actors) => {
        return !actors.getCharacterByName(EHero.CLEMENT).hasEquipment(EEquipment.PROTEGE_TIBIA);
      }
    },{
      name: `Risk`,
      text: () => {
        return `50% de chance de gagner l'équipement Veste de marque`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        if(dice(50)) {
          const actor = characters.getCharacterByName(EHero.CLEMENT);
          actor.getEquipment(EEquipment.VESTE_MARQUE).giveEquipmentTo(actor);
        }
      },
      condition: (actors) => {
        return !actors.getCharacterByName(EHero.CLEMENT).hasEquipment(EEquipment.VESTE_MARQUE);
      }
    },{
      name: `Ne pas y aller`,
      text: () => {
        return `Rien ne se passe`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
      }
    }
  ]
},
{
  owners: [EHero.LOIC],
  title: 'Jet de dé',
  description: 'Vous rencontrez un joueur qui vous offre la possibilité de gagner un équipement en jouant au dé.',
  condition: (actors, $this) => {
    return actors.some(a => $this.owners.some(owner => owner === a.name));
  },
  choices: [
    {
      name: `Casque`,
      text: () => {
        return `50% de chance de gagner l'équipement Casque.`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        if(dice(50)) {
          const actor = characters.getCharacterByName(EHero.LOIC);
          actor.getEquipment(EEquipment.CASQUE).giveEquipmentTo(actor);
        }
      },
      condition: (actors) => {
        return !actors.getCharacterByName(EHero.LOIC).hasEquipment(EEquipment.CASQUE);
      }
    },{
      name: `Risk`,
      text: () => {
        return `50% de chance de gagner l'équipement Alcotest`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        if(dice(50)) {
          const actor = characters.getCharacterByName(EHero.LOIC);
          actor.getEquipment(EEquipment.ALCOTEST).giveEquipmentTo(actor);
        }
      },
      condition: (actors) => {
        return !actors.getCharacterByName(EHero.LOIC).hasEquipment(EEquipment.ALCOTEST);
      }
    },{
      name: `Ne pas y aller`,
      text: () => {
        return `Rien ne se passe`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
      }
    }
  ]
},
{
  owners: [EHero.KEVIN],
  title: 'Jet de dé',
  description: 'Vous rencontrez un joueur qui vous offre la possibilité de gagner un équipement en jouant au dé.',
  condition: (actors, $this) => {
    return actors.some(a => $this.owners.some(owner => owner === a.name));
  },
  choices: [
    {
      name: `Casque`,
      text: () => {
        return `50% de chance de gagner l'équipement Ballantines.`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        if(dice(50)) {
          const actor = characters.getCharacterByName(EHero.KEVIN);
          actor.getEquipment(EEquipment.BALLANTINES).giveEquipmentTo(actor);
        }
      },
      condition: (actors) => {
        return !actors.getCharacterByName(EHero.KEVIN).hasEquipment(EEquipment.BALLANTINES);
      }
    },{
      name: `Risk`,
      text: () => {
        return `50% de chance de gagner l'équipement Souris congélées`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        if(dice(50)) {
          const actor = characters.getCharacterByName(EHero.KEVIN);
          actor.getEquipment(EEquipment.SOURIS).giveEquipmentTo(actor);
        }
      },
      condition: (actors) => {
        return !actors.getCharacterByName(EHero.KEVIN).hasEquipment(EEquipment.SOURIS);
      }
    },{
      name: `Ne pas y aller`,
      text: () => {
        return `Rien ne se passe`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
      }
    }
  ]
},
{
  owners: [EHero.ADRIEN],
  title: 'Jet de dé',
  description: 'Vous rencontrez un joueur qui vous offre la possibilité de gagner un équipement en jouant au dé.',
  condition: (actors, $this) => {
    return actors.some(a => $this.owners.some(owner => owner === a.name));
  },
  choices: [
    {
      name: `Casque`,
      text: () => {
        return `50% de chance de gagner l'équipement Gants d'escalade.`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        if(dice(50)) {
          const actor = characters.getCharacterByName(EHero.ADRIEN);
          actor.getEquipment(EEquipment.GANTS_ESCALADE).giveEquipmentTo(actor);
        }
      },
      condition: (actors) => {
        return !actors.getCharacterByName(EHero.ADRIEN).hasEquipment(EEquipment.GANTS_ESCALADE);
      }
    },{
      name: `Risk`,
      text: () => {
        return `50% de chance de gagner l'équipement Freelance`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        if(dice(50)) {
          const actor = characters.getCharacterByName(EHero.ADRIEN);
          actor.getEquipment(EEquipment.FREELANCE).giveEquipmentTo(actor);
        }
      },
      condition: (actors) => {
        return !actors.getCharacterByName(EHero.ADRIEN).hasEquipment(EEquipment.FREELANCE);
      }
    },{
      name: `Ne pas y aller`,
      text: () => {
        return `Rien ne se passe`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
      }
    }
  ]
},
{
  owners: [EHero.COSTY],
  title: 'Jet de dé',
  description: 'Vous rencontrez un joueur qui vous offre la possibilité de gagner un équipement en jouant au dé.',
  condition: (actors, $this) => {
    return actors.some(a => $this.owners.some(owner => owner === a.name));
  },
  choices: [
    {
      name: `Casque`,
      text: () => {
        return `50% de chance de gagner l'équipement Manette.`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        if(dice(50)) {
          const actor = characters.getCharacterByName(EHero.COSTY);
          actor.getEquipment(EEquipment.MANETTE_XBOX).giveEquipmentTo(actor);
        }
      },
      condition: (actors) => {
        return !actors.getCharacterByName(EHero.COSTY).hasEquipment(EEquipment.MANETTE_XBOX);
      }
    },{
      name: `Risk`,
      text: () => {
        return `50% de chance de gagner l'équipement Compte deezer`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
        if(dice(50)) {
          const actor = characters.getCharacterByName(EHero.COSTY);
          actor.getEquipment(EEquipment.SPOTIFY).giveEquipmentTo(actor);
        }
      },
      condition: (actors) => {
        return !actors.getCharacterByName(EHero.COSTY).hasEquipment(EEquipment.SPOTIFY);
      }
    },{
      name: `Ne pas y aller`,
      text: () => {
        return `Rien ne se passe`;
      },
      reward: (characters: CharactersService, currency: ShopService) => {
      }
    }
  ]
}]
