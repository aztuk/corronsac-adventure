import { EquipmentDescription } from './../../../object/components/equipment-description';
import { SpellDescription } from './../../../object/components/spell-description';
import { Actor } from './../../../object/entities/actor';
import { ELootType } from './../../../sharedScript/enums';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CharactersService } from '../../../services/characters.service';
import { MapService } from '../../../services/map.service';
import { ShopService } from '../../../services/shop.service';
import { ELevelType } from '../../../sharedScript/enums';
import { getRandomElementsInArray, getRandomInt } from '../../../sharedScript/helpers';

@Component({
  selector: 'civ-treasure',
  templateUrl: './treasure.component.html',
  styleUrls: ['./treasure.component.scss']
})
export class TreasureComponent implements OnInit, OnDestroy {

  public currentMoney;
  public currentMoneySub;

  public rerollPrice = 20;
  public lootTable = [];
  public treasure = [];

  constructor(private cs: CharactersService, private _router: Router, private ss: ShopService, private ms: MapService) {
    this.currentMoneySub = this.ss.currency$.subscribe(c => this.currentMoney = c);
  }

  ngOnInit(): void {
    this.ms.antiCheat([ELevelType.TREASURE]);
    this.generateLootTable();
    this.treasure = getRandomElementsInArray(this.lootTable, 3);
    this.ss.addCurrency(200);
  }


  ngOnDestroy(): void {
    this.currentMoneySub.unsubscribe();
  }

  generateLootTable() {
    const actorPool = this.cs.getFreeCharacters().map(a => {
      return { type: ELootType.CHARACTER, value: this.cs.createCharacterByName(a) }
    });

    const spellPool = this.cs.getLockedSpells().map(a => {
      return { type: ELootType.SPELL, value: a }
    });

    const equipPool = this.cs.getLockedEquipments().map(a => {
      return { type: ELootType.EQUIPMENT, value: a }
    });

    this.lootTable = this.lootTable.concat(actorPool, spellPool, equipPool);

    for(let i of Array(Math.round(this.lootTable.length / 3))) {
      this.lootTable.push({ type: ELootType.GOLD, value: getRandomInt(150, 200)});
    }
  }

  reroll() {
    if(this.ss.hasEnough(this.rerollPrice)) {
      this.ss.removeCurrency(this.rerollPrice);
      this.treasure = getRandomElementsInArray(this.lootTable, 3);
    }
  }

  leave() {
    this.treasure.forEach(treasure =>{
      if(treasure.type === ELootType.CHARACTER) {
        this.cs.characters.push(treasure.value);
      }
      if(treasure.type === ELootType.GOLD) {
        this.ss.addCurrency(treasure.value);
      }
      if(treasure.type === ELootType.SPELL) {
        treasure.value.spell.unlocked = true;
      }
      if(treasure.type === ELootType.EQUIPMENT) {
        treasure.value.equipment.unlocked = true;
      }
    });


    this.ms.finished();
    this._router.navigate(['map']);
  }



}
