import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CharactersService } from '../../../services/characters.service';
import { MapService } from '../../../services/map.service';
import { ShopService } from '../../../services/shop.service';
import { ELevelType } from '../../../sharedScript/enums';

@Component({
  selector: 'civ-treasure',
  templateUrl: './treasure.component.html',
  styleUrls: ['./treasure.component.scss']
})
export class TreasureComponent implements OnInit, OnDestroy {

  public currentMoney;
  public currentMoneySub;



  constructor(private cs: CharactersService, private _router: Router, private ss: ShopService, private ms: MapService) {
    this.currentMoneySub = this.ss.currency$.subscribe(c => this.currentMoney = c);
  }

  ngOnInit(): void {
    this.ms.antiCheat([ELevelType.TREASURE]);
/*
    let treasurePool = [];

    treasurePool = [treasurePool, ...this.cs.getFreeCharacters()];
    treasurePool = [treasurePool, ...this.cs.getLockedEquipments()];
    treasurePool = [treasurePool, ...this.cs.getLockedEquipments()];

    console.log(treasurePool);
*/
  }

  ngOnDestroy(): void {
    this.currentMoneySub.unsubscribe();
}

}
