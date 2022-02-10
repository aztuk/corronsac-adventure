import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'civ-tooltip-map-node',
  templateUrl: './tooltip-map-node.component.html',
  styleUrls: ['./tooltip-map-node.component.scss']
})
export class TooltipMapNodeComponent implements OnInit {

  @Input() entity;
  @HostBinding('class.tooltip') isTooltip = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}
