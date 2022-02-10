import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'civ-loot-item',
  templateUrl: './loot-item.component.html',
  styleUrls: ['./loot-item.component.scss']
})
export class LootItemComponent implements OnInit {

  @Input() loot;
  @Input() type;


  constructor() { }

  ngOnInit(): void {
  }

}
