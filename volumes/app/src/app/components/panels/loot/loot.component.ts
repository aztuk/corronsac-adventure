import { Router } from '@angular/router';
import { MapService } from './../../../services/map.service';
import { ShopService } from './../../../services/shop.service';
import { CombatService } from './../../../services/combat.service';
import { IEntityActor } from './../../../sharedScript/interfaces';
import { CharactersService } from './../../../services/characters.service';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { createWeightedTable, getRandomElementsInArray, getRandomInArray, getRandomInt, weightedRand } from '../../../sharedScript/helpers';
import { ELevelType, ELootType } from '../../../sharedScript/enums';

@Component({
  selector: 'civ-loot',
  templateUrl: './loot.component.html',
  styleUrls: ['./loot.component.scss']
})
export class LootComponent implements OnInit, OnDestroy {

  @Output() retrievedLoot = new EventEmitter<boolean>();

  public lootTable = [];
  private lootRates: any;
  public currentLevel;
  public forcedCurrencyEarning: number;
  public selectedLoot;


  constructor(private cs: CharactersService, private combatService: CombatService, private ss: ShopService, private ms: MapService, private _router: Router) {
    this.currentLevel = this.ms.currentLevel;
   }

  ngOnInit(): void {
    this.ms.antiCheat([ELevelType.COMBAT_TIER_1]);
    if(this.combatService.getEnemies().some(a => !a.health.isDead)) {
      this._router.navigate(['combat']);
    }
    this.forcedCurrencyEarning = 3 + (this.currentLevel.floor * getRandomInt(4, 6));
    this.generateLootRates();
    this.generateLootTable();
  }

  ngOnDestroy(): void {
  }

  generateLootRates() {
    // Create a loot rate spec object
    this.lootRates = {
      // Count available characters
      characters:  this.cs.getFreeCharacters().length,
      // Count available spells (max is 4 / characters)
      spells:  this.cs.getLockedSpells().length,
      // Count available equipment (max is 2 / characters)
      equipment: this.cs.getLockedEquipments().length,
      gold: 1
    }
  }

  generateLootTable() {
    // Create a loot topology array weighted with the loot rates
    let lootTypology = createWeightedTable(this.lootRates);
    let freeCharacters = this.cs.getFreeCharacters();
    let freeSpells = this.cs.getLockedSpells();
    let freeEquipment = this.cs.getLockedEquipments();

    for(let i of Array(3)) {
      // Get a random loot type from the loot topology
      const index = getRandomInt(0, lootTypology.length - 1);
      const type = lootTypology[index];
      lootTypology.splice(index, 1);

      switch(type) {
        case 'characters':
          // Push the character to the loot table
          this.lootTable.push({
            type: ELootType.CHARACTER,
            value: this.cs.createCharacterByName(this.getLootFrom(freeCharacters))
          });
        break;
        case 'spells':
          // Push the spell to the loot table
          this.lootTable.push({
            type: ELootType.SPELL,
            value: this.getLootFrom(freeSpells)
          });
        break;
        case 'equipment':
          // Push the spell to the loot table
          this.lootTable.push({
            type: ELootType.EQUIPMENT,
            value: this.getLootFrom(freeEquipment)
          });
        break;
        case 'gold':
          this.lootTable.push({
            type: ELootType.GOLD,
            value: 30 + (this.currentLevel.floor * getRandomInt(12, 15))
          });
        break;
      }
    }
  }

  getLootFrom(array) {
    // Get a random character that is free
    const index = getRandomInt(0, array.length - 1);
    const randomLoot = array[index];

    // Remove from available loot
    array.splice(index, 1);

    return randomLoot;
  }

  select(loot) {
    this.selectedLoot = loot;
  }

  confirmLoot() {
    if(this.selectedLoot !== undefined) {
      if(this.selectedLoot.type === ELootType.CHARACTER) {
        this.cs.characters.push(this.selectedLoot.value);
      }
      if(this.selectedLoot.type === ELootType.EQUIPMENT) {
        this.selectedLoot.value.actor.equipment.find(e => e.name === this.selectedLoot.value.equipment.name).giveEquipmentTo(this.selectedLoot.value.actor);
      }
      if(this.selectedLoot.type === ELootType.SPELL) {
        this.selectedLoot.value.actor.spells.find(e => e.name === this.selectedLoot.value.spell.name).unlocked = true;
      }
      if(this.selectedLoot.type === ELootType.GOLD) {
        this.ss.addCurrency(this.selectedLoot.value);
      }
      this.ss.addCurrency(this.forcedCurrencyEarning);
      this.ms.finished();
      this._router.navigate(['map']);
    }
  }

}
