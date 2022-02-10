import {Component, OnDestroy, OnInit} from '@angular/core';
import {CharactersService} from '../../../services/characters.service';
import {IEntityActor} from '../../../sharedScript/interfaces';

@Component({
  selector: 'civ-list-characters',
  templateUrl: './list-characters.component.html',
  styleUrls: ['./list-characters.component.scss']
})
export class ListCharactersComponent implements OnInit, OnDestroy {

  public characters: Array<IEntityActor>

  public charSub;

  constructor(private characterService: CharactersService) {
    this.charSub = this.characterService.characters$.subscribe((characters) => this.characters = characters);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.charSub.unsubscribe()
  }

}
