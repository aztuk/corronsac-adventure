import { ScoreService } from './score.service';
import { EquipmentDescription } from './../object/components/equipment-description';
import {ESPells} from '../sharedScript/spells-enum';
import {SpellDescription} from '../object/components/spell-description';
import {Stats} from '../object/components/stats';
import {Health} from '../object/components/health';
import {Actor} from '../object/entities/actor';
import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';
import {IEntityActor} from '../sharedScript/interfaces';
import {EClass, EHero} from '../sharedScript/enums';
import { EEquipment } from '../sharedScript/equipment-enum';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  public characters$: BehaviorSubject<IEntityActor[]> = new BehaviorSubject([])

  public set characters(value: any) {
    this.characters$.next(value);
  }

  public get characters() {
    return this.characters$.getValue();
  }

  constructor() {
  }

  countFullStuff() {
    let count = 0;

    this.characters.forEach(element => {
      if(!element.spells.some(s => !s.unlocked) && !element.equipment.some(s => !s.unlocked)) {
        count++;
      }
    });

    return count;
  }

  createCharacterByName(name: EHero): Actor {
    switch(name) {
      case EHero.ADRIEN:
        return this.createAdrien(false);
      case EHero.CLEMENT:
        return this.createClement(false);
      case EHero.COSTY:
        return this.createCosty(false);
      case EHero.KEVIN:
        return this.createKevin(false);
      case EHero.QUENTIN:
        return this.createQuentin(false);
      case EHero.LOIC:
        return this.createLoic(false);
    }
  }

  addCharacter(name: EHero) {
    ScoreService.getInstance().stats.sizeTeam =  this.characters.length;
    this.characters.push(this.createCharacterByName(name));
  }

  getDeadActors(): IEntityActor[] {
    return this.characters.filter(a => a.health.isDead);
  }

  isInParty(name: EHero): boolean {
    return this.characters.some(a => a.name === name);
  }

  getFreeCharacters(): EHero[] {
    let allCharacters = Object.values(EHero);
    let currentCharacters = this.characters.map(a => a.name);
    return allCharacters.filter(name => !currentCharacters.includes(name));
  }

  getLockedEquipments(): any[] {
    let lockedEquipment: any[] = [];

    this.characters.forEach((actor) => {
      actor.equipment.forEach(s => {
        if(!s.unlocked) {
          lockedEquipment.push({actor: actor, equipment: s});
        }
    });
  });

    return lockedEquipment;
  }

  getLockedSpells(): any[] {
    let lockedSpells: any[] = [];

    this.characters.forEach((actor) => {
      actor.spells.forEach(s => {
        if(!s.unlocked) {
          lockedSpells.push({actor: actor, spell: s});
        }
    });
  });

    return lockedSpells;
  }

  getCharacterByName(name) {
    return this.characters.filter((char) => char.name === name)[0];
  }

  // Locks all spells
  lockAllSpells(character) {
    character.spells.forEach(s => {
      if(s.name !== ESPells.BASIC.name) {
        s.unlocked = false;
      }
    })
  }

  createAdrien(full) {
    let character = new Actor(EHero.ADRIEN, EClass.COMBATTANT, true);
    character.health = new Health(72);
    character.stats$ = new Stats(8, 0, 35);

    // Spells
    character.spells.push(new SpellDescription(ESPells.BASIC));
    character.spells.push(new SpellDescription(ESPells.ESCALADE));
    character.spells.push(new SpellDescription(ESPells.SMOKE_SCREEN));
    character.spells.push(new SpellDescription(ESPells.AMANDINE));

    // Equipment
    character.equipment.push(new EquipmentDescription(EEquipment.GANTS_ESCALADE));
    character.equipment.push(new EquipmentDescription(EEquipment.FREELANCE));

    if (!full) {
      this.lockAllSpells(character);
    }

    return character;
  }

  createLoic(full):Actor {
    let character = new Actor(EHero.LOIC, EClass.COMBATTANT, true);
    character.health = new Health(65);
    character.stats$ = new Stats(9, 0, 30);
    character.spells.push(new SpellDescription(ESPells.BASIC));
    character.spells.push(new SpellDescription(ESPells.DISCUSSION_INSENSEE));
    character.spells.push(new SpellDescription(ESPells.FRONT_LISSE));
    character.spells.push(new SpellDescription(ESPells.TETE_PREMIERE));
    // Equipment
    character.equipment.push(new EquipmentDescription(EEquipment.ALCOTEST));
    character.equipment.push(new EquipmentDescription(EEquipment.CASQUE));

    if (!full) {
      this.lockAllSpells(character);
    }


    return character;
  }

  createKevin(full) {
    let character = new Actor(EHero.KEVIN, EClass.MAGE, true);
    character.health = new Health(54);
    character.stats$ = new Stats(4, 4, 32);
    character.spells.push(new SpellDescription(ESPells.BASIC));
    character.spells.push(new SpellDescription(ESPells.MAURICE));
    character.spells.push(new SpellDescription(ESPells.SNAKES));
    character.spells.push(new SpellDescription(ESPells.PIGEON));
    // Equipment
    character.equipment.push(new EquipmentDescription(EEquipment.BALLANTINES));
    character.equipment.push(new EquipmentDescription(EEquipment.SOURIS));

    if (!full) {
      this.lockAllSpells(character);
    }


    return character;
  }

  createQuentin(full) {
    let character = new Actor(EHero.QUENTIN, EClass.MAGE, true);
    character.health = new Health(47);
    character.stats$ = new Stats(4, 5, 30);
    character.spells.push(new SpellDescription(ESPells.BASIC));
    character.spells.push(new SpellDescription(ESPells.SMART_LIFE));
    character.spells.push(new SpellDescription(ESPells.DEBAT_POLITIQUE));
    character.spells.push(new SpellDescription(ESPells.FUITE));
    // Equipment
    character.equipment.push(new EquipmentDescription(EEquipment.EXTENSION_SMARTLIFE));
    character.equipment.push(new EquipmentDescription(EEquipment.DISCORD));

    if (!full) {
      this.lockAllSpells(character);
    }


    return character;
  }

  createClement(full) {
    let character = new Actor(EHero.CLEMENT, EClass.TANK, true);
    character.health = new Health(84);
    character.stats$ = new Stats(7, 1, 25);
    character.spells.push(new SpellDescription(ESPells.BASIC));
    character.spells.push(new SpellDescription(ESPells.JONGLAGE));
    character.spells.push(new SpellDescription(ESPells.TRAINING));
    character.spells.push(new SpellDescription(ESPells.SEDUCTION));
    // Equipment
    character.equipment.push(new EquipmentDescription(EEquipment.VESTE_MARQUE));
    character.equipment.push(new EquipmentDescription(EEquipment.PROTEGE_TIBIA));

    if (!full) {
      this.lockAllSpells(character);
    }

    return character;
  }

  createCosty(full) {
    let character = new Actor(EHero.COSTY, EClass.SUPPORT, true);
    character.health = new Health(59);
    character.stats$ = new Stats(5, 3, 24);
    character.spells.push(new SpellDescription(ESPells.BASIC));
    character.spells.push(new SpellDescription(ESPells.NOOB));
    character.spells.push(new SpellDescription(ESPells.PLAYLIST));
    character.spells.push(new SpellDescription(ESPells.TRAGO_SOCIAL));
    // Equipment
    character.equipment.push(new EquipmentDescription(EEquipment.SPOTIFY));
    character.equipment.push(new EquipmentDescription(EEquipment.MANETTE_XBOX));


    if (!full) {
      this.lockAllSpells(character);
    }


    return character;
  }

  initCharacterGame(name) {
    switch (name) {
      case EHero.ADRIEN:
        this.characters.push(this.createAdrien(false));
        break;
      case EHero.LOIC:
        this.characters.push(this.createLoic(false));
        break;
      case EHero.KEVIN:
        this.characters.push(this.createKevin(false));
        break;
      case EHero.QUENTIN:
        this.characters.push(this.createQuentin(false));
        break;
      case EHero.COSTY:
        this.characters.push(this.createCosty(false));
        break;
      case EHero.CLEMENT:
        this.characters.push(this.createClement(false));
        break;
    }
    ScoreService.getInstance().stats.sizeTeam =  this.characters.length;
  }
}
