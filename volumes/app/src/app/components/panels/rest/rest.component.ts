import { IEntityActor } from './../../../sharedScript/interfaces';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CharactersService } from '../../../services/characters.service';
import { MapService } from '../../../services/map.service';
import { ELevelType } from '../../../sharedScript/enums';
import { exists } from '../../../sharedScript/helpers';

@Component({
  selector: 'civ-rest',
  templateUrl: './rest.component.html',
  styleUrls: ['./rest.component.scss']
})
export class RestComponent implements OnInit {

  public characters;
  public deadCharacters;

  constructor(private cs: CharactersService, private _router: Router, private ms: MapService) {
    this.characters = this.cs.characters;
    this.deadCharacters = this.cs.getDeadActors();
  }

  ngOnInit(): void {
    this.ms.antiCheat([ELevelType.HEAL]);
  }

  healAll() {
    this.characters.filter(a => !a.health.isDead).forEach(a => {
      let heal = a.health.max * 0.5;
      a.health.heal(heal);
    });
    this.ms.finished();
    this._router.navigate(['map']);
  }
  ressucitate(actor: IEntityActor) {
    actor.health.ressucitate();
    this.ms.finished();
    this._router.navigate(['map']);
  }
}
