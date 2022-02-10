import { MapService } from './../../../services/map.service';
import { IEvent } from './../../../sharedScript/interfaces';
import { CharactersService } from './../../../services/characters.service';
import { EventService } from './../../../services/event.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShopService } from '../../../services/shop.service';
import { ELevelType } from '../../../sharedScript/enums';
import { exists } from '../../../sharedScript/helpers';

@Component({
  selector: 'civ-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  public event: IEvent;
  public characters;
  public currency;

  constructor(private es: EventService, private cs: CharactersService, private _router: Router, private ss: ShopService, private ms: MapService) { }

  ngOnInit(): void {
    this.ms.antiCheat([ELevelType.EVENT]);
    this.characters = this.cs.characters;
    this.event = this.es.generateEvent(this.cs.characters);
  }

  checkChoice(choice) {
    return (choice.condition && choice.condition(this.cs, this.ss)) || !choice.condition
  }

  applyChoice(choice) {
    if(this.checkChoice(choice)) {
      choice.reward(this.cs, this.ss);
      this.ms.finished();
      this._router.navigate(['map']);
    }
  }

}
