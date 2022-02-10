import {ISpellDescription} from "../../sharedScript/interfaces";


export class SpellDescription implements ISpellDescription {

  name: string;
  description: string;
  unlocked: boolean = true;
  damageInstances: Array<any>;
  effectInstances: Array<any>;
  healInstances: any;
  shieldInstances: any;
  timer: number;
  cooldown: number;
  invocation?: any;
  onSpellCast?: any;
  public price: number;

  constructor(spellDescription) {
    this.name = spellDescription.name;
    this.description = spellDescription.description;
    this.cooldown = spellDescription.cooldown;
    this.price = spellDescription.price;
    this.timer = (spellDescription.timer !== undefined) ? spellDescription.timer : spellDescription.cooldown;
    this.damageInstances = spellDescription.damageInstances || null;
    this.effectInstances = spellDescription.effectInstances || null;
    this.invocation = spellDescription.invocation || null;
    this.healInstances = spellDescription.healInstances || null;
    this.onSpellCast = spellDescription.onSpellCast || null;
  }

}
