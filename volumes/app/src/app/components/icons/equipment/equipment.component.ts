import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'civ-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {

  @Input() equipment;

  public cssClass;

  constructor() { }

  ngOnInit(): void {
    this.cssClass = this.equipment.name.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(' ', '').replace('\'', '').toUpperCase();
    this.cssClass += (this.equipment.unlocked) ? '' : ' disabled';
  }

}
