import { EHero } from './../sharedScript/enums';
import { ESPells } from './../sharedScript/spells-enum';
import { ISpellDescription, IEquipmentDescription, IEntityActor, IShopItem } from './../sharedScript/interfaces';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { exists, getRandomElementsInArray, getRandomInArray } from '../sharedScript/helpers';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  public currency$: BehaviorSubject<number> = new BehaviorSubject(0)

  public set currency(value: any) {
    this.currency$.next(value);
  }

  public get currency() {
    return this.currency$.getValue();
  }

  public currentNumberInShop: number;
  public maxSpells: number = 6;
  public maxEquipments: number = 3;
  public maxCharacter: number = 1;

  constructor() {}

  generateEquipmentShop(lockedEquipment: IEquipmentDescription[]) : IShopItem[] {
    let equipments;

    if(lockedEquipment.length < this.maxEquipments) {
      equipments = lockedEquipment;
    } else {
      equipments = getRandomElementsInArray(lockedEquipment, this.maxEquipments);
    }

    this.currentNumberInShop += equipments.length;
    return this.anyToShopItem(equipments);
  }

  generateSpellShop(lockedSpells: ISpellDescription[]) : IShopItem[] {
    let spells;

    if(lockedSpells.length < this.maxSpells) {
      spells = lockedSpells;
    } else {
      spells = getRandomElementsInArray(lockedSpells, this.maxSpells);
    }

    this.currentNumberInShop += spells.length;

    return this.anyToShopItem(spells);
  }

  generateCharacterShop(freeCharacters: EHero[]) : EHero[] {
    let actors;

    if(freeCharacters.length < this.maxCharacter) {
      actors = freeCharacters;
    } else {
      actors = getRandomElementsInArray(freeCharacters, this.maxCharacter);
    }

    return actors;
  }

  anyToShopItem(array: any) : IShopItem[] {
    let result:IShopItem[] = [];

    array.forEach(a => {
      result.push({
        sold: false,
        item: a
      });
    });

    return result;
  }

  addCurrency(value: number) {
    this.currency += value;
  }

  removeCurrency(value:number) {
    this.currency -= value;

    if(this.currency < 0){
      this.currency = 0;
    }
  }

  hasEnough(value) {
    return value <= this.currency;
  }
}
