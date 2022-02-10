import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'civ-spells',
  templateUrl: './spells.component.html',
  styleUrls: ['./spells.component.scss']
})
export class SpellsComponent implements OnInit {

  @Input() spell;

  public cssClass;

  constructor() {
  }

  ngOnInit(): void {
    this.cssClass = this.spell.name.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(' ', '').toUpperCase();
    this.cssClass += (this.spell.unlocked) ? '' : ' disabled';
  }

}
