import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'civ-tooltip-spell',
  templateUrl: './tooltip-spell.component.html',
  styleUrls: ['./tooltip-spell.component.scss']
})
export class TooltipSpellComponent implements OnInit {

  @Input() entity;
  @Input() owner;
  @HostBinding('class.tooltip') isTooltip = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}
