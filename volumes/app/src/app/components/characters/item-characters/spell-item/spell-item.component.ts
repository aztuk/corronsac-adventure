import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'civ-spell-item',
  templateUrl: './spell-item.component.html',
  styleUrls: ['./spell-item.component.scss']
})
export class SpellItemComponent implements OnInit {

  @Input() spell;

  constructor() {
  }

  ngOnInit(): void {
  }

}
