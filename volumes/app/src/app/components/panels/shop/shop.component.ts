import { EHero } from './../../../sharedScript/enums';
import { IEquipmentDescription, IEntityActor, IShopItem } from './../../../sharedScript/interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CharactersService } from '../../../services/characters.service';
import { MapService } from '../../../services/map.service';
import { ShopService } from '../../../services/shop.service';
import { ELevelType } from '../../../sharedScript/enums';
import { ISpellDescription } from '../../../sharedScript/interfaces';



@Component({
  selector: 'civ-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {

  public currentMoney;
  public currentMoneySub;

  public spellsToBuy:IShopItem[];
  public equipmentToBuy:IShopItem[];
  public charactersToBuy:EHero[];

  public charactersInShop: IShopItem[] = [];

  constructor(private cs: CharactersService, private _router: Router, private ss: ShopService, private ms: MapService) {
    this.currentMoneySub = this.ss.currency$.subscribe(c => this.currentMoney = c);
   }

ngOnDestroy(): void {
    this.currentMoneySub.unsubscribe();
}

  ngOnInit(): void {
    this.ss.addCurrency(300);
    this.ms.antiCheat([ELevelType.SHOP]);
    this.equipmentToBuy = this.ss.generateEquipmentShop(this.cs.getLockedEquipments());
    this.spellsToBuy = this.ss.generateSpellShop(this.cs.getLockedSpells());
    this.charactersToBuy = this.ss.generateCharacterShop(this.cs.getFreeCharacters());

    this.charactersToBuy.forEach(a => {
      const shopItem = {
        sold: false,
        item: this.cs.createCharacterByName(a)
      }
      this.charactersInShop.push(shopItem);
    });
  }

  unlockActor(item:IShopItem, price:number){
    if(this.ss.hasEnough(price) && !item.sold) {
      this.cs.addCharacter(item.item.name);
      this.ss.removeCurrency(price);
      item.sold = true;
    }
  }

  unlockSpell(item:IShopItem, price:number){
    if(this.ss.hasEnough(price) && !item.sold) {
      item.item.spell.unlocked =true;
      this.ss.removeCurrency(price);
      item.sold = true;
    }
  }

  unlockEquipment(item:IShopItem, price:number){
    if(this.ss.hasEnough(price) && !item.sold) {
      item.item.equipment.giveEquipmentTo(item.item.actor);
      this.ss.removeCurrency(price);
      item.sold = true;
    }
  }

  leave(){
    this.ms.finished();
    this._router.navigate(['map']);
  }

}
