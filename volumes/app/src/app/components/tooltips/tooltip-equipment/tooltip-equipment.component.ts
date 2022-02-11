import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'civ-tooltip-equipment',
  templateUrl: './tooltip-equipment.component.html',
  styleUrls: ['./tooltip-equipment.component.scss']
})
export class TooltipEquipmentComponent implements OnInit {

  @Input() entity;
  @Input() owner;
  @HostBinding('class.tooltip') isTooltip = true;

  constructor() { }

  ngOnInit(): void {
  }

}
