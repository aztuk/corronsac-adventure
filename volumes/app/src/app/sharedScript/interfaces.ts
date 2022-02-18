import { ESPells } from './spells-enum';
import { CharactersService } from './../services/characters.service';
import {EAttackStatus, EClass, EDamageType, EEffects, EHero, ELevelType} from "./enums";
import {SpellCast} from '../object/system/spellCast';
import { ShopService } from "../services/shop.service";

export interface IComponentHealth {
  current: number
  max: number
  isDead: boolean
  hurt: (param: number) => boolean
  heal: (param: number) => void
  ressucitate: () => void
}

export interface IComponentResource {
  name: string
  current: number
  max: number
  regen: number
  canRegen: boolean
}

export interface IComponentShield {
  current: number
  max: number
}

export interface IComponentStats {
  attack: number
  power: number
  critical: number
  criticalDamage: number
  dodge: number
  touch: number
  speed: number
  damageMultiplier: number
}

export interface ISystemEffect {
  getBuffValue(param: number): any;

  effect: EEffects;
  target: IEntityActor;
  caster: IEntityActor;
  timer: number;
  stackType: string;
  stacks: number;
  runPoison: () => ISystemDamage
  getPoisonDamage: () => number
  addStack: () => void
}

export interface ISystemCast {
  target: IEntityActor;
  caster: IEntityActor;
}

export interface ISystemDamage extends ISystemCast {
  damageType: EDamageType;
  damage: number;
  status: EAttackStatus;
  applyDamage: () => boolean;
}

export interface ISystemHeal extends ISystemCast{
  heal: number;
  applyHeal: () => void;
}

export interface IEntity {
  id: string
}


export interface ISystemBasicAttack {
  damage: number
}

export interface IEntityActor extends IEntity{
  name: string
  possessed: boolean
  specialty: EClass
  health: IComponentHealth
  buffs: IComponentStats
  shield: IComponentShield
  stats: IComponentStats
  stats$: IComponentStats
  spells: ISpellDescription[]
  equipment: IEquipmentDescription[]
  effects: ISystemEffect[]
  runCooldowns: () => void;
  isIncapacitated: () => boolean;
  runDots: () => ISystemDamage[];
  hasSpell: (param: ESPells) => boolean;
  spellTimers: () => void;
}

export interface ISpellDescription {
  name: string
  description: string
  timer: number
  cooldown: number
  damageInstances?: any
  healInstances?: any
  shieldInstances?: any
  effectInstances?: any
  invocation?: any
  onSpellCast?: any;
  unlocked: boolean;
  price: number
}

export interface IEquipmentDescription {
  name: string
  unlocked: boolean
  description: string
  stats: IComponentStats
  health: number
  price: number
  callback: (actor: IEntityActor) => {}
}

export interface ICombatLogItem {
  actor: IEntityActor,
  spell: SpellCast
}

export type ILevel = Array<ICombat>;

export interface ICombat {
  id: string;
  floor: number;
  unlocked: boolean;
  done: boolean;
  type: ELevelType;
  enemies?: IEntityActor[];
  parents: string[];
  children: string[];
}

export interface IEvent {
  title: string
  description: string
  owners: EHero[]
  condition?: (actors: IEntityActor[], $this: IEvent) => boolean
  choices: IEventChoices[]
}

export interface IEventChoices {
  name: string,
  text: () => string,
  reward: (characters: CharactersService, currency: ShopService) => void
  condition?: (characters: CharactersService, currency: ShopService)=> boolean
}

export interface IShopItem {
  sold: boolean;
  item: any;
}
