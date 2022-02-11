import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'civ-tooltip-score',
  templateUrl: './tooltip-score.component.html',
  styleUrls: ['./tooltip-score.component.scss']
})
export class TooltipScoreComponent implements OnInit {

  @Input() entity;
  @HostBinding('class.tooltip') isTooltip = true;

  public total;

  constructor() { }

  ngOnInit(): void {
    this.total = this.entity.getScore();
  }

}
